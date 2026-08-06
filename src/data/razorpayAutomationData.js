const razorpayAutomationData = [
  {
    title: "Must to have",
    ideas: [
      {
        id: "idea-1",
        text: "Generate Razorpay Payment Link from Google Forms",
        description: "Automatically create a Razorpay Payment Link whenever a customer submits a service request or booking form.",
        workflow: [
          { icon: "https://stuff.thingsofbrand.com/google.com/images/imgb_Google_Forms_Logo.png", alt: "Google Forms", label: "Google Forms" },
          { icon: "https://stuff.thingsofbrand.com/razorpay.com/images/img678aa307e6_razorpay.jpg", alt: "Razorpay", label: "Razorpay" }
        ]
      },
      {
        id: "idea-2",
        text: "Generate Razorpay Payment Link from Tally Forms",
        description: "Automatically generate a Razorpay Payment Link when a customer submits a Tally Form.",
        workflow: [
          { icon: "https://stuff.thingsofbrand.com/tally.so/images/imge_tally.png", alt: "Tally Forms", label: "Tally Forms" },
          { icon: "https://stuff.thingsofbrand.com/razorpay.com/images/img678aa307e6_razorpay.jpg", alt: "Razorpay", label: "Razorpay" }
        ]
      },
    ],
  },
  {
    title: "High value",
    ideas: [
      {
        id: "idea-3",
        text: "Create Google Calendar Event After Successful Payment",
        description: "Automatically schedule a consultation, onboarding call, or booked session after payment.",
        workflow: [
          { icon: "https://stuff.thingsofbrand.com/razorpay.com/images/img678aa307e6_razorpay.jpg", alt: "Razorpay", label: "Razorpay" },
          { icon: "https://stuff.thingsofbrand.com/google.com/images/img7_Google-Calendar.png", alt: "Google Calendar", label: "Google Calendar" }
        ]
      },
      { 
        id: "idea-4", 
        text: "Notify Owner About High-Value Payment",
        description: "Notify the business owner only when a payment exceeds a configurable amount.",
        workflow: [
          { icon: "https://stuff.thingsofbrand.com/google.com/images/img7_Google-Calendar.png", alt: "Google Calendar", label: "Google Calendar" },
          { label: "your threshold" },
          { icon: "https://stuff.thingsofbrand.com/razorpay.com/images/img678aa307e6_razorpay.jpg", alt: "Razorpay", label: "WhatsApp" }
        ]
      },
      { 
        id: "idea-5", 
        text: "Follow Up on Expired Payment Link",
        description: "Recover lost sales by automatically generating a fresh payment link and sending it to the customer after the previous link expires.",
        workflow: [
          { icon: "https://stuff.thingsofbrand.com/razorpay.com/images/img678aa307e6_razorpay.jpg", alt: "Razorpay", label: "Razorpay" },
          { icon: "https://stuff.thingsofbrand.com/razorpay.com/images/img678aa307e6_razorpay.jpg", alt: "Razorpay", label: "payment" },
          { icon: "https://stuff.thingsofbrand.com/viasocket.com/images/imge_whatsapp.svg", alt: "WhatsApp", label: "WhatsApp" }
        ]
      },
      { 
        id: "idea-6", 
        text: "Ask Customer for Refund Feedback",
        description: "Automatically collect customer feedback after a refund is processed.",
        workflow: [
          { icon: "https://stuff.thingsofbrand.com/razorpay.com/images/img678aa307e6_razorpay.jpg", alt: "Razorpay", label: "Razorpay" },
          { icon: "https://stuff.thingsofbrand.com/google.com/images/imgb_Google_Forms_Logo.png", alt: "Google Forms", label: "feedback form" },
          { icon: "https://stuff.thingsofbrand.com/viasocket.com/images/imge_whatsapp.svg", alt: "WhatsApp", label: "WhatsApp" }
        ]
      },
      { 
        id: "idea-7", 
        text: "Unlock Premium Content After Payment",
        description: "Automatically share premium content or resources with customers after successful payment.",
        workflow: [
          { icon: "https://stuff.thingsofbrand.com/razorpay.com/images/img678aa307e6_razorpay.jpg", alt: "Razorpay", label: "Razorpay" },
          { icon: "https://stuff.thingsofbrand.com/google.com/images/img9_googledrive.png", alt: "Google Drive", label: "Google Drive" }
        ]
      },
      { 
        id: "idea-8", 
        text: "Automatically Send Invoice After Payment",
        description: "Generate and send invoices automatically after successful payment capture.",
        workflow: [
          { icon: "https://stuff.thingsofbrand.com/razorpay.com/images/img678aa307e6_razorpay.jpg", alt: "Razorpay", label: "Razorpay" },
          { icon: "https://stuff.thingsofbrand.com/razorpay.com/images/img678aa307e6_razorpay.jpg", alt: "Razorpay", label: "Razorpay" },
          { icon: "https://stuff.thingsofbrand.com/gmail.com/images/imge_idrA5FDGTH_1763454052978.svg", alt: "Gmail", label: "Gmail" }
        ]
      },
    ],
  },
  {
    title: "AI workflows",
    ideas: [
      { 
        id: "idea-9", 
        text: "AI Classify High-Value Customers",
        description: "Use AI to sort customers based on payment value and update their status automatically.",
        workflow: [
          { icon: "https://stuff.thingsofbrand.com/razorpay.com/images/img678aa307e6_razorpay.jpg", alt: "Razorpay", label: "Razorpay" },
          { icon: "https://stuff.thingsofbrand.com/openai.com/images/img6299ba7193_openai.jpg", alt: "OpenAI", label: "Customer with AI" },
          { icon: "https://stuff.thingsofbrand.com/google.com/images/img4_googlesheet.png", alt: "Google Sheets", label: "Google Sheets" }
        ]
      },
      { 
        id: "idea-10", 
        text: "AI Generate Personalized Thank-You Message",
        description: "Generate personalized thank-you messages using AI and send them via WhatsApp for high-value payments.",
        workflow: [
          { icon: "https://stuff.thingsofbrand.com/razorpay.com/images/img678aa307e6_razorpay.jpg", alt: "Razorpay", label: "Razorpay" },
          { label: "your threshold" },
          { icon: "https://stuff.thingsofbrand.com/openai.com/images/img6299ba7193_openai.jpg", alt: "OpenAI", label: "Generate with AI" },
          { icon: "https://stuff.thingsofbrand.com/viasocket.com/images/imge_whatsapp.svg", alt: "WhatsApp", label: "WhatsApp" }
        ]
      },
      { 
        id: "idea-11", 
        text: "AI Analyze Refund Reasons",
        description: "Use AI to group and analyze refund feedback from Google Forms and add records to Google Sheets.",
        workflow: [
          { icon: "https://stuff.thingsofbrand.com/google.com/images/imgb_Google_Forms_Logo.png", alt: "Google Forms", label: "Google Forms" },
          { icon: "https://stuff.thingsofbrand.com/openai.com/images/img6299ba7193_openai.jpg", alt: "OpenAI", label: "Feedback with AI" },
          { icon: "https://stuff.thingsofbrand.com/viasocket.com/images/imge_whatsapp.svg", alt: "Google Sheets", label: "Google Sheets" }
        ]
      },
      { 
        id: "idea-12", 
        text: "AI Recover Failed Payments",
        description: "Use AI to write recovery messages and send them via WhatsApp when payments fail.",
        workflow: [
          { icon: "https://stuff.thingsofbrand.com/razorpay.com/images/img678aa307e6_razorpay.jpg", alt: "Razorpay", label: "Razorpay" },
          { icon: "https://stuff.thingsofbrand.com/openai.com/images/img6299ba7193_openai.jpg", alt: "OpenAI", label: "Message with AI" },
          { icon: "https://stuff.thingsofbrand.com/viasocket.com/images/imge_whatsapp.svg", alt: "WhatsApp", label: "WhatsApp" }
        ]
      },
    ],
  },
];

export default razorpayAutomationData;
