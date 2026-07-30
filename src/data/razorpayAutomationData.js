const razorpayAutomationData = [
  {
    title: "Must-have",
    ideas: [
      {
        id: "idea-1",
        text: "1. Generate Razorpay Payment Link from Google Forms",
        description: "Automatically create a Razorpay Payment Link whenever a customer submits a service request or booking form.",
        workflow: [
          { icon: "https://stuff.thingsofbrand.com/google.com/images/imgb_Google_Forms_Logo.png", alt: "Google Forms", label: "New response in Google Forms" },
          { icon: "https://stuff.thingsofbrand.com/razorpay.com/images/img678aa307e6_razorpay.jpg", alt: "Razorpay", label: "Create a payment link in Razorpay" }
        ]
      },
      {
        id: "idea-2",
        text: "2. Generate Razorpay Payment Link from Tally Forms",
        description: "Automatically generate a Razorpay Payment Link when a customer submits a Tally Form.",
        workflow: [
          { icon: "https://stuff.thingsofbrand.com/tally.so/images/imge_tally.png", alt: "Tally Forms", label: "New response in Tally Forms" },
          { icon: "https://stuff.thingsofbrand.com/razorpay.com/images/img678aa307e6_razorpay.jpg", alt: "Razorpay", label: "Create a payment link in Razorpay" }
        ]
      },
    ],
  },
  {
    title: "High value",
    ideas: [
      {
        id: "idea-3",
        text: "3. Create Google Calendar Event After Successful Payment",
        description: "Automatically schedule a consultation, onboarding call, or booked session after payment.",
        workflow: [
          { icon: "https://stuff.thingsofbrand.com/razorpay.com/images/img678aa307e6_razorpay.jpg", alt: "Razorpay", label: "Payment captured in Razorpay" },
          { icon: "https://stuff.thingsofbrand.com/google.com/images/img7_Google-Calendar.png", alt: "Google Calendar", label: "Create an event in Google Calendar" }
        ]
      },
      { 
        id: "idea-4", 
        text: "4. Notify Owner About High-Value Payment",
        description: "Notify the business owner only when a payment exceeds a configurable amount.",
        workflow: [
          { icon: "https://stuff.thingsofbrand.com/google.com/images/img7_Google-Calendar.png", alt: "Google Calendar", label: "Create an event in Google Calendar" },
          { label: "If the amount meets your threshold" },
          { icon: "https://stuff.thingsofbrand.com/razorpay.com/images/img678aa307e6_razorpay.jpg", alt: "Razorpay", label: "Send a WhatsApp message" }
        ]
      },
      { 
        id: "idea-5", 
        text: "5. Follow Up on Expired Payment Link",
        description: "Recover lost sales by automatically generating a fresh payment link and sending it to the customer after the previous link expires.",
        workflow: [
          { icon: "https://stuff.thingsofbrand.com/razorpay.com/images/img678aa307e6_razorpay.jpg", alt: "Razorpay", label: "Payment link expired in Razorpay" },
          { icon: "https://stuff.thingsofbrand.com/razorpay.com/images/img678aa307e6_razorpay.jpg", alt: "Razorpay", label: "Create a fresh payment link" },
          { icon: "https://stuff.thingsofbrand.com/viasocket.com/images/imge_whatsapp.svg", alt: "WhatsApp", label: "Send the payment link on WhatsApp" }
        ]
      },
      { 
        id: "idea-6", 
        text: "6. Ask Customer for Refund Feedback",
        description: "Automatically collect customer feedback after a refund is processed.",
        workflow: [
          { icon: "https://stuff.thingsofbrand.com/razorpay.com/images/img678aa307e6_razorpay.jpg", alt: "Razorpay", label: "Refund processed in Razorpay" },
          { icon: "https://stuff.thingsofbrand.com/google.com/images/imgb_Google_Forms_Logo.png", alt: "Google Forms", label: "Create a feedback form" },
          { icon: "https://stuff.thingsofbrand.com/viasocket.com/images/imge_whatsapp.svg", alt: "WhatsApp", label: "Send the feedback form on WhatsApp" }
        ]
      },
      { 
        id: "idea-7", 
        text: "7. Unlock Premium Content After Payment",
        description: "Automatically share premium content or resources with customers after successful payment.",
        workflow: [
          { icon: "https://stuff.thingsofbrand.com/razorpay.com/images/img678aa307e6_razorpay.jpg", alt: "Razorpay", label: "Payment captured in Razorpay" },
          { icon: "https://stuff.thingsofbrand.com/google.com/images/img9_googledrive.png", alt: "Google Drive", label: "Share the folder in Google Drive" }
        ]
      },
      { 
        id: "idea-8", 
        text: "8. Automatically Send Invoice After Payment",
        description: "Generate and send invoices automatically after successful payment capture.",
        workflow: [
          { icon: "https://stuff.thingsofbrand.com/razorpay.com/images/img678aa307e6_razorpay.jpg", alt: "Razorpay", label: "Payment captured in Razorpay" },
          { icon: "https://stuff.thingsofbrand.com/razorpay.com/images/img678aa307e6_razorpay.jpg", alt: "Razorpay", label: "Create an invoice in Razorpay" },
          { icon: "https://stuff.thingsofbrand.com/gmail.com/images/imge_idrA5FDGTH_1763454052978.svg", alt: "Gmail", label: "Send the invoice with Gmail" }
        ]
      },
    ],
  },
  {
    title: "AI workflows",
    ideas: [
      { 
        id: "idea-9", 
        text: "9. AI Classify High-Value Customers",
        description: "Use AI to sort customers based on payment value and update their status automatically.",
        workflow: [
          { icon: "https://stuff.thingsofbrand.com/razorpay.com/images/img678aa307e6_razorpay.jpg", alt: "Razorpay", label: "Payment captured in Razorpay" },
          { icon: "https://stuff.thingsofbrand.com/openai.com/images/img6299ba7193_openai.jpg", alt: "OpenAI", label: "Sort the customer with AI" },
          { icon: "https://stuff.thingsofbrand.com/google.com/images/img4_googlesheet.png", alt: "Google Sheets", label: "Update their status in Google Sheets" }
        ]
      },
      { 
        id: "idea-10", 
        text: "10. AI Generate Personalized Thank-You Message",
        description: "Generate personalized thank-you messages using AI and send them via WhatsApp for high-value payments.",
        workflow: [
          { icon: "https://stuff.thingsofbrand.com/razorpay.com/images/img678aa307e6_razorpay.jpg", alt: "Razorpay", label: "Payment captured in Razorpay" },
          { label: "If the amount meets your threshold" },
          { icon: "https://stuff.thingsofbrand.com/openai.com/images/img6299ba7193_openai.jpg", alt: "OpenAI", label: "Generate the message with AI" },
          { icon: "https://stuff.thingsofbrand.com/viasocket.com/images/imge_whatsapp.svg", alt: "WhatsApp", label: "Send a WhatsApp message" }
        ]
      },
      { 
        id: "idea-11", 
        text: "11. AI Analyze Refund Reasons",
        description: "Use AI to group and analyze refund feedback from Google Forms and add records to Google Sheets.",
        workflow: [
          { icon: "https://stuff.thingsofbrand.com/google.com/images/imgb_Google_Forms_Logo.png", alt: "Google Forms", label: "New response in Google Forms" },
          { icon: "https://stuff.thingsofbrand.com/openai.com/images/img6299ba7193_openai.jpg", alt: "OpenAI", label: "Group the feedback with AI" },
          { icon: "https://stuff.thingsofbrand.com/viasocket.com/images/imge_whatsapp.svg", alt: "Google Sheets", label: "Add the record to Google Sheets" }
        ]
      },
      { 
        id: "idea-12", 
        text: "12. AI Recover Failed Payments",
        description: "Use AI to write recovery messages and send them via WhatsApp when payments fail.",
        workflow: [
          { icon: "https://stuff.thingsofbrand.com/razorpay.com/images/img678aa307e6_razorpay.jpg", alt: "Razorpay", label: "Payment failed in Razorpay" },
          { icon: "https://stuff.thingsofbrand.com/openai.com/images/img6299ba7193_openai.jpg", alt: "OpenAI", label: "Write a recovery message with AI" },
          { icon: "https://stuff.thingsofbrand.com/viasocket.com/images/imge_whatsapp.svg", alt: "WhatsApp", label: "Send a WhatsApp message" }
        ]
      },
    ],
  },
];

export default razorpayAutomationData;
