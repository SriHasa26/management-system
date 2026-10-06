/**
 * SRI SAI Tuition & Learning Centre - Comprehensive Domain Types
 * Prepared for clean Supabase & backend integration in Phase 2
 */

export type UserRole = 'student' | 'parent' | 'admin' | 'teacher';

export type BoardType = 'CBSE' | 'State Board' | 'ICSE' | 'MPC' | 'BiPC' | 'MEC';

export type ClassGrade = 
  | 'LKG' | 'UKG'
  | 'Class 1' | 'Class 2' | 'Class 3' | 'Class 4' | 'Class 5'
  | 'Class 6' | 'Class 7' | 'Class 8'
  | 'Class 9' | 'Class 10'
  | 'Intermediate 1st Year' | 'Intermediate 2nd Year';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  avatarUrl?: string;
  phone?: string;
  createdAt: string;
}

export interface Student {
  id: string; // e.g. "SRI-2026-001"
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  grade: ClassGrade;
  board: BoardType;
  batchId: string;
  batchName: string;
  rollNumber: string;
  admissionDate: string;
  photoUrl: string;
  status: 'Active' | 'Inactive' | 'Graduated';
  
  // Contact & Guardian Info
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  parentRelation: string;
  address: string;
  
  // Academic & Finance summary
  overallAttendance: number; // percentage
  feeStatus: 'Paid' | 'Pending' | 'Overdue' | 'Partially Paid';
  monthlyFee: number;
  dueAmount: number;
  lastTestScore: number;
}

export interface Parent {
  id: string;
  name: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  occupation?: string;
  address: string;
  childrenIds: string[]; // Support multiple children switching
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  qualification: string;
  subjects: string[];
  classesHandled: string[];
  batchesHandled: string[];
  joiningDate: string;
  photoUrl: string;
  status: 'Active' | 'On Leave';
  bio?: string;
}

export interface ClassItem {
  id: string;
  name: string; // e.g., "Class 10", "Intermediate 1st Year"
  category: 'Early Learning' | 'Primary' | 'Middle School' | 'High School' | 'Intermediate';
  boards: BoardType[];
  totalStudents: number;
  batchesCount: number;
  monthlyFee: number;
}

export interface Batch {
  id: string;
  name: string; // e.g., "Class 10 - Morning Star", "Class 9 - Focus A"
  classId: string;
  className: string;
  timing: string; // e.g., "05:00 PM - 07:00 PM"
  room: string;
  capacity: number;
  enrolledCount: number;
  teacherName: string;
  board: BoardType;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  category: 'Math' | 'Science' | 'Social' | 'Language' | 'Commerce';
  classesApplicable: string[];
  iconName?: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Half Day';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  classId: string;
  className: string;
  batchId: string;
  subject?: string;
  remarks?: string;
  markedBy?: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  fileType: 'pdf' | 'video' | 'notes' | 'question_paper';
  fileSize: string;
  downloadUrl: string;
  videoUrl?: string;
  classId: string;
  className: string;
  subject: string;
  chapter: string;
  uploadedAt: string;
  uploadedBy: string;
  isImportant?: boolean;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  className: string;
  batchName: string;
  dueDate: string;
  assignedDate: string;
  totalMarks: number;
  status: 'Pending' | 'Submitted' | 'Evaluated' | 'Overdue';
  submissionCount?: number;
  totalSubmissionsExpected?: number;
  attachmentUrl?: string;
  instructions?: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  status: 'Submitted' | 'Evaluated';
  obtainedMarks?: number;
  feedback?: string;
  attachmentUrl?: string;
}

export interface MockTest {
  id: string;
  title: string;
  description: string;
  subject: string;
  className: string;
  chapter: string;
  durationMinutes: number;
  totalMarks: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  startDate: string;
  endDate: string;
  status: 'Upcoming' | 'Live' | 'Completed';
  questionsCount: number;
  averageScore?: number;
  topScore?: number;
}

export interface Question {
  id: string;
  testId?: string;
  subject: string;
  className: string;
  chapter: string;
  type: 'MCQ' | 'True/False' | 'Short Answer' | 'Long Answer';
  questionText: string;
  options?: string[];
  correctAnswer?: string | number;
  explanation?: string;
  marks: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface TestResult {
  id: string;
  testId: string;
  testTitle: string;
  studentId: string;
  studentName: string;
  subject: string;
  className: string;
  score: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  rank?: number;
  date: string;
  teacherRemarks?: string;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  batchName: string;
  month: string; // e.g., "October 2026"
  monthlyFee: number;
  discount: number;
  netFee: number;
  paidAmount: number;
  pendingAmount: number;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue' | 'Partially Paid';
  lastPaymentDate?: string;
}

export interface PaymentTransaction {
  id: string;
  receiptNumber: string; // e.g., "REC-2026-104"
  studentId: string;
  studentName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque';
  feeMonth: string;
  recordedBy: string;
  notes?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'Normal' | 'Important' | 'Urgent';
  audience: 'All' | 'Students' | 'Parents' | 'Specific Class';
  targetClass?: string;
  targetBatch?: string;
  publishedAt: string;
  author: string;
  pinned?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'attendance' | 'fee' | 'test' | 'assignment' | 'general';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface TimetableSlot {
  id: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  timeSlot: string; // e.g., "05:00 PM - 06:00 PM"
  subject: string;
  teacherName: string;
  room: string;
  className: string;
  batchName: string;
}

export interface DoubtTicket {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  className: string;
  title: string;
  question: string;
  attachmentUrl?: string;
  status: 'Pending' | 'Answered' | 'In Review';
  createdAt: string;
  answeredAt?: string;
  teacherName?: string;
  answer?: string;
}

export interface AdmissionEnquiry {
  id: string;
  studentName: string;
  parentName: string;
  phone: string;
  email?: string;
  gradeApplying: ClassGrade;
  board: BoardType;
  message?: string;
  status: 'New' | 'Contacted' | 'Visit Scheduled' | 'Enrolled' | 'Closed';
  createdAt: string;
  notes?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Classroom' | 'Learning' | 'Events' | 'Activities' | 'Celebrations';
  imageUrl: string;
  caption: string;
  date: string;
}
