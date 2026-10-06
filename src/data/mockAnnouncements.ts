import { Announcement, NotificationItem } from '../types';

export const mockAnnouncements: Announcement[] = [
  {
    id: 'ann-001',
    title: 'Special Sunday Doubt Clearing & Formula Revision Workshop',
    content: 'All Class 10 and Intermediate students are invited to a specialized 2-hour problem-solving clinic this Sunday from 9:30 AM to 11:30 AM. Dr. Srinivas Rao will cover tricky quadratic word problems and ray diagram conventions.',
    priority: 'Important',
    audience: 'All',
    publishedAt: '2026-09-27',
    author: 'Centre Academic Coordinator',
    pinned: true,
  },
  {
    id: 'ann-002',
    title: 'Monthly Term Assessment Schedule for October 2026',
    content: 'The date sheet for the October Unit Reviews is now published on the portal. Students are advised to complete chapter revision sheets before Friday.',
    priority: 'Important',
    audience: 'All',
    publishedAt: '2026-09-24',
    author: 'Examination Cell',
    pinned: true,
  },
  {
    id: 'ann-003',
    title: 'Parent-Educator Collaborative Meet (Q3 Academic Progress)',
    content: 'Individual 10-minute feedback slots will be hosted on Saturday, 10th October. Parents can review answer sheets, attendance trends, and board roadmap.',
    priority: 'Normal',
    audience: 'Parents',
    publishedAt: '2026-09-20',
    author: 'Principal / Admin',
    pinned: false,
  },
  {
    id: 'ann-004',
    title: 'New Chapter Workbooks Available at the Centre Library',
    content: 'Class 9 and Class 10 science workbooks containing 15-year blueprint questions are ready for collection at the front desk.',
    priority: 'Normal',
    audience: 'Students',
    publishedAt: '2026-09-15',
    author: 'Materials In-charge',
    pinned: false,
  }
];

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Mathematics Test Score Published',
    message: 'Your score for Chemistry Periodic Test has been recorded: 46/50 (92.0%)',
    type: 'test',
    timestamp: '2 hours ago',
    read: false,
    link: '/student/results',
  },
  {
    id: 'notif-2',
    title: 'New Assignment Assigned',
    message: 'Physics: Numerical Problems on Convex Lens Magnification is due Oct 4',
    type: 'assignment',
    timestamp: 'Yesterday',
    read: false,
    link: '/student/assignments',
  },
  {
    id: 'notif-3',
    title: 'Attendance Marked',
    message: 'Present recorded for Mathematics & Physics sessions on 28 Sep 2026',
    type: 'attendance',
    timestamp: 'Today, 06:15 PM',
    read: true,
    link: '/student/attendance',
  },
  {
    id: 'notif-4',
    title: 'Fee Payment Receipt Generated',
    message: 'Tuition receipt REC-2026-09-042 for September 2026 is available for download',
    type: 'fee',
    timestamp: '3 days ago',
    read: true,
    link: '/student/fees',
  }
];
