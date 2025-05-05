import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const sendTravelPlanEmail = async (
  email: string,
  travelPlan: any,
  pdfBlob: Blob
): Promise<void> => {
  try {
    // Format travel plan data for email
    const formattedPlan = {
      destination: travelPlan.destination,
      summary: travelPlan.summary,
      totalCost: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
      }).format(travelPlan.totalCost),
      days: travelPlan.days.map((day: any) => ({
        day: day.day,
        activities: {
          morning: day.activities.morning,
          afternoon: day.activities.afternoon,
          evening: day.activities.evening
        },
        accommodation: day.accommodation,
        meals: day.meals,
        costs: day.estimatedCosts
      })),
      tips: travelPlan.tips
    };

    // Prepare email template parameters
    const templateParams = {
      to_email: email,
      travel_plan: JSON.stringify(formattedPlan, null, 2),
      subject: `Your Travel Plan to ${travelPlan.destination}`,
      message: `Here is your travel plan to ${travelPlan.destination}. The detailed itinerary is attached as a PDF file.`
    };

    // Create attachment object
    const attachment = {
      name: `${travelPlan.destination.toLowerCase().replace(/\s+/g, '-')}-travel-plan.pdf`,
      data: pdfBlob
    };

    // Send email using EmailJS with attachment
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY,
      {
        attachment: attachment
      }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send travel plan email');
  }
}; 