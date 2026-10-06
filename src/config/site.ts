/**
 * SRI SAI Tuition & Learning Centre - Site Configuration
 */
export const siteConfig = {
  name: "SRI SAI",
  shortName: "SRI SAI",
  fullName: "SRI SAI Tuition & Learning Centre",
  subtitle: "Tuition & Learning Centre",
  tagline: "Where Curiosity Becomes Confidence",
  heroSubtitle: "Personalised learning and focused academic support for students from LKG to Intermediate.",
  philosophyHeadline: "More Than Tuition. A Place to Grow.",
  
  about: {
    story: "SRI SAI Tuition & Learning Centre was founded with a single uncompromising mission: to make high-quality, concept-driven learning accessible, engaging, and deeply transformative for every child. We bridge the gap between classroom theory and real intellectual confidence through small-batch mentoring, rigorous assessments, and compassionate guidance.",
    pillars: [
      {
        title: "Strong Fundamentals",
        description: "We dismantle rote memorisation and build deep conceptual mastery in mathematics, sciences, and languages from early schooling to higher secondary.",
        icon: "BookOpen"
      },
      {
        title: "Individual Attention",
        description: "Strict student-to-teacher batch caps ensure no learner is lost in the crowd and every query is thoroughly addressed.",
        icon: "Users"
      },
      {
        title: "Consistent Practice",
        description: "Daily problem-solving worksheets, modular homework tracking, and guided revision cycles to build academic stamina.",
        icon: "CheckCircle2"
      },
      {
        title: "Regular Assessments",
        description: "Structured chapter tests, unit reviews, and full-length term examinations benchmarked to both CBSE and State Board standards.",
        icon: "Award"
      },
      {
        title: "Parent Involvement",
        description: "Real-time attendance logs, transparent performance metrics, and regular parent-educator dialogues to keep families synchronized.",
        icon: "HeartHandshake"
      },
      {
        title: "Confidence Building",
        description: "Fostering analytical curiosity, exam composure, and intrinsic motivation so students approach exams with complete self-belief.",
        icon: "Sparkles"
      }
    ]
  },

  trustBadges: [
    { label: "Grade Coverage", value: "LKG → Intermediate", sub: "Complete K-12 Progression" },
    { label: "Curricula", value: "CBSE + State Board", sub: "Dual Curriculum Mastery" },
    { label: "Evaluation", value: "Regular Assessments", sub: "Weekly & Chapter Metrics" },
    { label: "Mentorship", value: "Personal Attention", sub: "Small Focused Batches" }
  ],

  programs: [
    {
      id: "early-learning",
      title: "Early Learning",
      grades: "LKG – UKG",
      tag: "Foundational Literacy & Numeracy",
      boards: ["CBSE", "State Board"],
      description: "Interactive sensory learning, phonics, number sense, and building curiosity through playful discovery in a warm, encouraging environment.",
      subjects: ["Phonics & English", "Foundational Math", "Environmental Wonder", "Creative Expression"],
      features: ["Activity-based learning", "Story-driven numeracy", "Fine motor skill development", "Regular milestone updates"],
      color: "from-[#F0F5F3] to-[#DCE7E3]",
      border: "border-[#8FB1A5]/40"
    },
    {
      id: "primary",
      title: "Primary School",
      grades: "Classes 1 – 5",
      tag: "Core Habit & Concept Formation",
      boards: ["CBSE", "State Board"],
      description: "Nurturing fundamental arithmetic, reading comprehension, logical inquiry, and consistent daily study habits without overburdening the child.",
      subjects: ["Mathematics", "General Science", "English & Grammar", "Regional Languages", "Social Studies"],
      features: ["Mental math training", "Conceptual science demonstrations", "Daily reading & vocabulary", "Bi-weekly progress checks"],
      color: "from-[#FFFDF8] to-[#F7F3EA]",
      border: "border-[#C99A3D]/40"
    },
    {
      id: "middle-school",
      title: "Middle School",
      grades: "Classes 6 – 8",
      tag: "Analytical Depth & Problem Solving",
      boards: ["CBSE", "State Board"],
      description: "Transitioning students from basic concepts to analytical problem-solving, structured geometry, scientific reasoning, and grammar fluency.",
      subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "Social Sciences", "English"],
      features: ["Step-by-step problem dissection", "Laboratory-style concept illustrations", "Chapter-wise diagnostic tests", "Doubt-solving clinics"],
      color: "from-[#FAF2F0] to-[#F5E2DC]",
      border: "border-[#B85C45]/40"
    },
    {
      id: "high-school",
      title: "High School",
      grades: "Classes 9 – 10",
      tag: "Board Exam Preparation & Excellence",
      boards: ["CBSE", "State Board"],
      description: "Intensive board-exam oriented curriculum with past-decade question solving, rigorous blueprint revision, answer-writing finesse, and time management.",
      subjects: ["Mathematics", "Integrated Sciences", "Social Science", "English & Second Language"],
      features: ["10+ Year Previous Question Papers", "Strict Board Simulation Exams", "Time Management Coaching", "One-on-one weak area remediation"],
      color: "from-[#F0F5F3] to-[#E6ECE5]",
      border: "border-[#2E6B57]/40"
    },
    {
      id: "intermediate",
      title: "Intermediate / Higher Secondary",
      grades: "1st & 2nd Year (Classes 11 – 12)",
      tag: "Stream Specialization & Competitive Edge",
      boards: ["MPC", "BiPC", "MEC", "State Board"],
      description: "Rigorous focus on core subjects for Intermediate board examinations along with foundational problem solving for state and national entrance tests.",
      subjects: ["Mathematics", "Physics", "Chemistry", "Botany & Zoology", "Commerce & Economics"],
      features: ["Derivation & formula mastery", "Numerical problem solving workshops", "Mock board papers with detailed scoring keys", "Dedicated faculty consultations"],
      color: "from-[#FAF6EE] to-[#E6D3AC]/30",
      border: "border-[#C99A3D]/50"
    }
  ],

  whyChooseUs: [
    {
      title: "Personal Attention",
      description: "Intimate class sizes allowing educators to identify each learner's distinct pace, strengths, and doubts.",
      icon: "UserCheck",
      color: "bg-[#173F35] text-[#F7F3EA]"
    },
    {
      title: "Small Batch Learning",
      description: "Strictly limited student batches ensuring lively discussion without noise or overcrowding.",
      icon: "Users2",
      color: "bg-[#B85C45] text-[#FFFDF8]"
    },
    {
      title: "Regular Assessments",
      description: "Weekly diagnostic tests and chapter checkpoints that pinpoint misconceptions before they compound.",
      icon: "ClipboardCheck",
      color: "bg-[#C99A3D] text-[#FFFDF8]"
    },
    {
      title: "Concept-Based Teaching",
      description: "Focusing on the 'why' behind equations and theories so knowledge stays permanent rather than fleeting.",
      icon: "Lightbulb",
      color: "bg-[#2E6B57] text-[#FFFDF8]"
    },
    {
      title: "Doubt Support Clinics",
      description: "Dedicated daily doubt-clearing windows where students can sit with faculty until concepts are 100% clear.",
      icon: "HelpCircle",
      color: "bg-[#173F35] text-[#F7F3EA]"
    },
    {
      title: "Transparent Parent Communication",
      description: "Seamless parent portal with instant attendance alerts, test score breakdowns, and proactive teacher feedback.",
      icon: "MessageSquareHeart",
      color: "bg-[#B85C45] text-[#FFFDF8]"
    },
    {
      title: "Curated Study Materials",
      description: "Comprehensive notes, concise mind maps, formula handbooks, and curated question banks designed in-house.",
      icon: "FileText",
      color: "bg-[#C99A3D] text-[#FFFDF8]"
    },
    {
      title: "Granular Progress Tracking",
      description: "Visual performance analytics that help students and parents witness measurable growth semester over semester.",
      icon: "TrendingUp",
      color: "bg-[#2E6B57] text-[#FFFDF8]"
    }
  ],

  learningJourney: [
    {
      step: "01",
      title: "Learn",
      subtitle: "Intuitive First Principles",
      description: "Engaging classroom instruction breaking down complex curriculum topics into crystal-clear mental models."
    },
    {
      step: "02",
      title: "Practice",
      subtitle: "Guided Application",
      description: "Structured daily workbooks and graded problem sets to convert comprehension into instinctive execution."
    },
    {
      step: "03",
      title: "Test",
      subtitle: "Frequent Low-Stakes & Full Exams",
      description: "Standardized weekly and unit tests designed to build examination stamina and eliminate test anxiety."
    },
    {
      step: "04",
      title: "Analyse",
      subtitle: "Diagnostic Performance Breakdown",
      description: "In-depth review of errors, question types, time taken, and precision to uncover specific growth opportunities."
    },
    {
      step: "05",
      title: "Improve",
      subtitle: "Targeted Remedial Guidance",
      description: "Personalised doubt resolution sessions and focused re-practice until every conceptual blind spot is erased."
    },
    {
      step: "06",
      title: "Achieve",
      subtitle: "Academic Excellence & Confidence",
      description: "Consistent academic mastery leading to top marks in school exams, boards, and lifelong intellectual confidence."
    }
  ],

  socialLinks: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    whatsapp: "https://wa.me/916301293925"
  },

  founder: {
    name: "Mrs. Telu Dhana Lakshmi",
    qualifications: "M.Sc, B.Ed",
    role: "Founder & Head Mathematics Faculty",
    phone: "+91 63012 93925",
    experience: "10+ Years in Premier Institutions",
    institutions: ["Narayana Educational Institutions", "Chaithanya Educational Institutions", "Corporate Colleges, AP"],
    awards: ["Exceptional Teacher Award"],
    bio: "An exceptionally accomplished Mathematics educator with over a decade of teaching experience at Andhra Pradesh's most prestigious institutions. Her deep subject mastery, rigorous methodology, and genuine passion for every learner's success have made SRI SAI a centre of academic excellence in Vijayawada."
  },

  disclaimer: "Note: In Phase 1 demonstration mode, all academic statistics, test scores, student profiles, and testimonials are illustrative sample data for platform design and evaluation."
};
