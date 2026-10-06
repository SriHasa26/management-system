import { DoubtTicket } from '../types';

export const mockDoubts: DoubtTicket[] = [
  {
    id: 'dbt-001',
    studentId: 'SRI-2026-001',
    studentName: 'Rahul Sharma',
    subject: 'Mathematics',
    className: 'Class 10',
    title: 'Doubt in finding roots when discriminant D < 0 for real scenarios',
    question: 'Sir, in Question 7 of the worksheet, the discriminant comes out to be negative (-24). Does that mean the speed problem has no physical solution or did I make a sign error in formulating the equation (x+5)(x-3)?',
    status: 'Answered',
    createdAt: '2026-09-26 07:30 PM',
    answeredAt: '2026-09-27 10:15 AM',
    teacherName: 'Dr. K. Srinivas Rao',
    answer: 'Rahul, you set up the speed differential with the opposite sign. It should be (x - 5)(x + 3) = 180, which yields a positive discriminant D = 784 = 28². Great attempt checking the physical reality of the solution!',
  },
  {
    id: 'dbt-002',
    studentId: 'SRI-2026-001',
    studentName: 'Rahul Sharma',
    subject: 'Physics',
    className: 'Class 10',
    title: 'Sign convention for virtual focus in divergent concave lens',
    question: 'Why is the focal length of a concave lens always taken as negative in lens formula 1/f = 1/v - 1/u?',
    status: 'Answered',
    createdAt: '2026-09-24 08:45 PM',
    answeredAt: '2026-09-25 09:00 AM',
    teacherName: 'Mrs. Lakshmi Prasanna',
    answer: 'According to Cartesian sign convention, distances measured in the direction opposite to the incident light (to the left of optical centre) are negative. Since the principal focus of concave lens is on the left, f is negative.',
  },
  {
    id: 'dbt-003',
    studentId: 'SRI-2026-001',
    studentName: 'Rahul Sharma',
    subject: 'Chemistry',
    className: 'Class 10',
    title: 'Distinction between displacement and precipitation reactions',
    question: 'Can a single replacement reaction also be categorized as a precipitation reaction if an insoluble solid forms?',
    status: 'Pending',
    createdAt: '2026-09-28 04:10 PM',
  }
];
