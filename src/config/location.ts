/**
 * SRI SAI Tuition & Learning Centre - Location Configuration
 *
 * Real location: Sri Sai Tuition Point - Patamata, Vijayawada, Andhra Pradesh
 * Coordinates: 16.4907149, 80.6643382
 */
export interface LocationConfig {
  name: string;
  subtitle: string;
  tagline: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
    landmark: string;
    formattedAddress: string;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  googleMapsUrl: string;
  googleMapsEmbedUrl: string;
  contact: {
    phone: string;
    phoneSecondary?: string;
    whatsapp: string;
    email: string;
    supportEmail: string;
  };
  workingHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
    holidays: string;
  };
  admin: {
    name: string;
    qualifications: string;
    role: string;
    experience: string;
    phone: string;
    bio: string;
    awards: string[];
    previousInstitutions: string[];
  };
}

export const locationConfig: LocationConfig = {
  name: "SRI SAI",
  subtitle: "Tuition & Learning Centre",
  tagline: "Learn Better. Grow Stronger. Achieve More.",
  address: {
    line1: "Sri Sai Tuition Point",
    line2: "Patamata",
    city: "Vijayawada",
    state: "Andhra Pradesh",
    pincode: "520007",
    landmark: "Patamata, Vijayawada",
    formattedAddress: "Sri Sai Tuition Point, Patamata, Vijayawada, Andhra Pradesh – 520007",
  },
  coordinates: {
    latitude: 16.4907149,
    longitude: 80.6643382,
  },
  googleMapsUrl: "https://maps.app.goo.gl/kycDgH2NV5erfXJp9",
  googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.5847959219746!2d80.66176327490506!3d16.490714884273226!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35fb007201ad1d%3A0xac04ca1a555d1581!2sSri%20Sai%20Tuition%20Point%20-%20Patamata!5e0!3m2!1sen!2sin!4v1699000000000!5m2!1sen!2sin",
  contact: {
    phone: "+91 63012 93925",
    whatsapp: "+916301293925",
    email: "admissions@srisaituition.edu.in",
    supportEmail: "support@srisaituition.edu.in",
  },
  workingHours: {
    weekdays: "Monday – Friday: 8:00 AM – 8:00 PM",
    saturday: "Saturday: 8:00 AM – 6:30 PM",
    sunday: "Sunday: 9:00 AM – 1:00 PM (Doubt Clearing Sessions)",
    holidays: "Special revision classes on notified schedules",
  },
  admin: {
    name: "Mrs. Telu Dhana Lakshmi",
    qualifications: "M.Sc, B.Ed",
    role: "Founder & Head Mathematics Faculty",
    experience: "10+ Years",
    phone: "+91 63012 93925",
    bio: "Mrs. Telu Dhana Lakshmi is an exceptionally accomplished Mathematics educator with over a decade of distinguished teaching experience at some of Andhra Pradesh's most prestigious institutions. Her deep subject mastery and student-first teaching philosophy have inspired hundreds of learners to achieve academic excellence.",
    awards: ["Exceptional Teacher Award"],
    previousInstitutions: ["Narayana Educational Institutions", "Chaithanya Educational Institutions", "Leading Corporate Colleges, AP"],
  },
};
