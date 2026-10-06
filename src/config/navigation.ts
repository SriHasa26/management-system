export interface NavItem {
  title: string;
  href: string;
  icon?: string;
  badge?: string | number;
  exact?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const publicNavItems: NavItem[] = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Programs", href: "/programs" },
  { title: "Admissions", href: "/admissions" },
  { title: "Contact", href: "/contact" },
];

export const studentNavItems: NavItem[] = [
  { title: "Dashboard", href: "/student", icon: "LayoutDashboard", exact: true },
  { title: "✨ Doubt Buddy", href: "/student/doubt-buddy", icon: "Sparkles", badge: "AI" },
  { title: "Study Materials", href: "/student/materials", icon: "BookOpen" },
  { title: "Assignments", href: "/student/assignments", icon: "FileText", badge: 2 },
  { title: "Mock Tests", href: "/student/tests", icon: "ClipboardList", badge: "Upcoming" },
  { title: "Attendance", href: "/student/attendance", icon: "CalendarCheck" },
  { title: "Results & Analytics", href: "/student/results", icon: "TrendingUp" },
  { title: "Fees & Receipts", href: "/student/fees", icon: "CreditCard" },
  { title: "Timetable", href: "/student/timetable", icon: "Clock" },
  { title: "Announcements", href: "/student/announcements", icon: "Bell" },
  { title: "Ask a Doubt", href: "/student/doubts", icon: "HelpCircle" },
  { title: "My Profile", href: "/student/profile", icon: "User" },
];

export const parentNavItems: NavItem[] = [
  { title: "Overview", href: "/parent", icon: "LayoutDashboard", exact: true },
  { title: "Attendance", href: "/parent/attendance", icon: "CalendarCheck" },
  { title: "Academic Performance", href: "/parent/performance", icon: "TrendingUp" },
  { title: "Tests & Scores", href: "/parent/tests", icon: "Award" },
  { title: "Assignments", href: "/parent/assignments", icon: "FileText" },
  { title: "Fee Management", href: "/parent/fees", icon: "CreditCard" },
  { title: "Class Timetable", href: "/parent/timetable", icon: "Clock" },
  { title: "Announcements", href: "/parent/announcements", icon: "Bell" },
  { title: "My Profile", href: "/parent/profile", icon: "User" },
];

export const adminNavSections: NavSection[] = [
  {
    title: "Core Operations",
    items: [
      { title: "Dashboard", href: "/admin", icon: "LayoutDashboard", exact: true },
      { title: "Students", href: "/admin/students", icon: "Users" },
      { title: "Classes", href: "/admin/classes", icon: "Layers" },
      { title: "Batches", href: "/admin/batches", icon: "Boxes" },
      { title: "Subjects", href: "/admin/subjects", icon: "BookOpen" },
    ],
  },
  {
    title: "Academic & Attendance",
    items: [
      { title: "Attendance", href: "/admin/attendance", icon: "CalendarCheck" },
      { title: "Study Materials", href: "/admin/materials", icon: "FolderArchive" },
      { title: "Assignments", href: "/admin/assignments", icon: "FileCheck" },
      { title: "Mock Tests", href: "/admin/tests", icon: "ClipboardList" },
      { title: "Question Bank", href: "/admin/questions", icon: "HelpCircle" },
      { title: "Result Management", href: "/admin/results", icon: "Award" },
    ],
  },
  {
    title: "Finance & Communication",
    items: [
      { title: "Fee Management", href: "/admin/fees", icon: "CreditCard" },
      { title: "Payment History", href: "/admin/payments", icon: "Receipt" },
      { title: "Announcements", href: "/admin/announcements", icon: "Bell" },
      { title: "Notifications", href: "/admin/notifications", icon: "MessageSquare" },
      { title: "Timetable", href: "/admin/timetable", icon: "Clock" },
      { title: "Academic Calendar", href: "/admin/calendar", icon: "Calendar" },
    ],
  },
  {
    title: "Insights & Administration",
    items: [
      { title: "Admission Enquiries", href: "/admin/admissions", icon: "Inbox", badge: 4 },
      { title: "Reports", href: "/admin/reports", icon: "FileSpreadsheet" },
      { title: "Analytics", href: "/admin/analytics", icon: "BarChart3" },
      { title: "Media Gallery", href: "/admin/gallery", icon: "Image" },
      { title: "Centre Settings", href: "/admin/settings", icon: "Settings" },
    ],
  },
  {
    title: "AI & Smart Tools",
    items: [
      { title: "AI Doubt Buddy Usage", href: "/admin/ai-usage", icon: "Sparkles", badge: "NEW" },
    ],
  },
];
