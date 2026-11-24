export type ActivePage = "home" | "destinations" | "tours" | "about" | "contact";

export const site = {
  name: "Estnak Tours and Travel",
  url: "https://www.estnaktoursandtravel.com",
  phone: "0769 532299",
  internationalPhone: "+256769532299",
  whatsapp: "256769532299",
  email: "estnaktoursandtravel@gmail.com",
  address: "Civic Centre, Christ The King, 217507 Kampala GPO, Kampala, Uganda",
  hours: "Monday–Saturday, 9:00 AM–5:00 PM EAT; Sunday closed",
} as const;

export const siteSchema = {
  "@context": "https://schema.org",
  "@type": ["TravelAgency", "TourOperator"],
  "@id": `${site.url}/#travel-agency`,
  name: site.name,
  url: `${site.url}/`,
  logo: `${site.url}/assets/img/estnak%20logo.svg`,
  image: `${site.url}/assets/img/optimized/hero-safari.webp`,
  description:
    "Kampala travel agency for Uganda tours, East Africa safaris, flights, visas, transport, stays and global holidays.",
  telephone: site.internationalPhone,
  email: site.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Civic Centre, Christ The King, 217507 Kampala GPO",
    addressLocality: "Kampala",
    addressCountry: "UG",
  },
  openingHours: "Mo-Sa 09:00-17:00",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "https://schema.org/Monday",
      "https://schema.org/Tuesday",
      "https://schema.org/Wednesday",
      "https://schema.org/Thursday",
      "https://schema.org/Friday",
      "https://schema.org/Saturday",
    ],
    opens: "09:00",
    closes: "17:00",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: site.internationalPhone,
    email: site.email,
    contactType: "travel bookings and customer support",
    availableLanguage: ["English"],
  },
  areaServed: [
    { "@type": "Country", name: "Uganda" },
    { "@type": "Country", name: "Kenya" },
    { "@type": "Country", name: "Tanzania" },
    { "@type": "Country", name: "Rwanda" },
    { "@type": "Place", name: "East Africa" },
    { "@type": "Place", name: "Africa" },
    { "@type": "Place", name: "Worldwide" },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Travel and concierge services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Flight & Air Ticket Booking" } },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Visa Processing & Documentation Assistance" },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Local & International Tour Operations & Safaris",
        },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Transport & Vehicle Rentals" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Hotel & Accommodation Bookings" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Corporate Travel & MICE Management" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Relocation & Educational Travel Support" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Travel Insurance & Digital Booking Support" },
      },
    ],
  },
  sameAs: [
    "https://www.instagram.com/estnaktoursandtravel",
    "https://www.facebook.com/estnaktoursandtravel",
    "https://x.com/estnaktoursandtravel",
    "https://www.youtube.com/@estnaktoursandtravel",
  ],
};

export const contactFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${site.url}/contact.html#faq`,
  mainEntity: [
    {
      "@type": "Question",
      name: "Can you create a custom trip?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Share your dates, destination, travel style and budget. Availability and pricing are confirmed in your written quote.",
      },
    },
    {
      "@type": "Question",
      name: "How do gorilla trekking permits work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Permits are required and must be available for your date. Fees can change and availability is not guaranteed. We can help explore options.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need a visa to visit Uganda?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Requirements depend on your nationality, travel document and itinerary. Check official immigration rules before travel; we can assist with your application.",
      },
    },
    {
      "@type": "Question",
      name: "When is the best time to visit Uganda?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Uganda is a year-round destination. Timing depends on your route, activities and regional rainfall. We can help choose dates.",
      },
    },
    {
      "@type": "Question",
      name: "What is included and excluded in a quote?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Your written quote lists inclusions and exclusions. Flights, visas, insurance and personal expenses are included only when stated.",
      },
    },
    {
      "@type": "Question",
      name: "What are the payment and change terms?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Payment schedules and change or cancellation terms appear in your written quote and vary by itinerary and supplier. Review them before booking.",
      },
    },
    {
      "@type": "Question",
      name: "How can I contact Estnak Tours and Travel?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Call 0769 532299, message us on WhatsApp or email estnaktoursandtravel@gmail.com. We’re open Monday–Saturday, 9:00 AM–5:00 PM EAT; Sunday closed.",
      },
    },
  ],
};
