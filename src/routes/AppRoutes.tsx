import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../layouts/PublicLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { StudentLayout } from '../layouts/StudentLayout';
import { ParentLayout } from '../layouts/ParentLayout';
import { AdminLayout } from '../layouts/AdminLayout';

// Public Pages
import { HomePage } from '../pages/public/HomePage';
import { AboutPage } from '../pages/public/AboutPage';
import { ProgramsPage } from '../pages/public/ProgramsPage';
import { AdmissionsPage } from '../pages/public/AdmissionsPage';
import { ContactPage } from '../pages/public/ContactPage';

// Auth Pages
import { RoleSelectPage } from '../pages/auth/RoleSelectPage';
import { StudentLoginPage } from '../pages/auth/StudentLoginPage';
import { ParentLoginPage } from '../pages/auth/ParentLoginPage';
import { AdminLoginPage } from '../pages/auth/AdminLoginPage';

// Student Pages
import { StudentDashboardPage } from '../pages/student/StudentDashboardPage';
import { StudentDoubtBuddyPage } from '../pages/student/StudentDoubtBuddyPage';
import { StudentMaterialsPage } from '../pages/student/StudentMaterialsPage';
import { StudentAssignmentsPage } from '../pages/student/StudentAssignmentsPage';
import { StudentTestsPage } from '../pages/student/StudentTestsPage';
import { StudentAttendancePage } from '../pages/student/StudentAttendancePage';
import { StudentResultsPage } from '../pages/student/StudentResultsPage';
import { StudentFeesPage } from '../pages/student/StudentFeesPage';
import { StudentTimetablePage } from '../pages/student/StudentTimetablePage';
import { StudentAnnouncementsPage } from '../pages/student/StudentAnnouncementsPage';
import { StudentDoubtsPage } from '../pages/student/StudentDoubtsPage';
import { StudentProfilePage } from '../pages/student/StudentProfilePage';

// Parent Pages
import { ParentDashboardPage } from '../pages/parent/ParentDashboardPage';
import { ParentAttendancePage } from '../pages/parent/ParentAttendancePage';
import { ParentPerformancePage } from '../pages/parent/ParentPerformancePage';
import { ParentTestsPage } from '../pages/parent/ParentTestsPage';
import { ParentAssignmentsPage } from '../pages/parent/ParentAssignmentsPage';
import { ParentFeesPage } from '../pages/parent/ParentFeesPage';
import { ParentTimetablePage } from '../pages/parent/ParentTimetablePage';
import { ParentAnnouncementsPage } from '../pages/parent/ParentAnnouncementsPage';
import { ParentProfilePage } from '../pages/parent/ParentProfilePage';

// Admin Pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminStudentsPage } from '../pages/admin/AdminStudentsPage';
import { AdminTeachersPage } from '../pages/admin/AdminTeachersPage';
import { AdminClassesPage } from '../pages/admin/AdminClassesPage';
import { AdminBatchesPage } from '../pages/admin/AdminBatchesPage';
import { AdminSubjectsPage } from '../pages/admin/AdminSubjectsPage';
import { AdminAttendancePage } from '../pages/admin/AdminAttendancePage';
import { AdminMaterialsPage } from '../pages/admin/AdminMaterialsPage';
import { AdminAssignmentsPage } from '../pages/admin/AdminAssignmentsPage';
import { AdminTestsPage } from '../pages/admin/AdminTestsPage';
import { AdminQuestionsPage } from '../pages/admin/AdminQuestionsPage';
import { AdminResultsPage } from '../pages/admin/AdminResultsPage';
import { AdminFeesPage } from '../pages/admin/AdminFeesPage';
import { AdminPaymentsPage } from '../pages/admin/AdminPaymentsPage';
import { AdminAnnouncementsPage } from '../pages/admin/AdminAnnouncementsPage';
import { AdminNotificationsPage } from '../pages/admin/AdminNotificationsPage';
import { AdminTimetablePage } from '../pages/admin/AdminTimetablePage';
import { AdminCalendarPage } from '../pages/admin/AdminCalendarPage';
import { AdminAdmissionsPage } from '../pages/admin/AdminAdmissionsPage';
import { AdminReportsPage } from '../pages/admin/AdminReportsPage';
import { AdminAnalyticsPage } from '../pages/admin/AdminAnalyticsPage';
import { AdminGalleryPage } from '../pages/admin/AdminGalleryPage';
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage';
import { AdminAIUsagePage } from '../pages/admin/AdminAIUsagePage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/admissions" element={<AdmissionsPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* Authentication */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<RoleSelectPage />} />
        <Route path="/login/student" element={<StudentLoginPage />} />
        <Route path="/login/parent" element={<ParentLoginPage />} />
        <Route path="/login/admin" element={<AdminLoginPage />} />
      </Route>

      {/* Student Portal */}
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<StudentDashboardPage />} />
        <Route path="doubt-buddy" element={<StudentDoubtBuddyPage />} />
        <Route path="materials" element={<StudentMaterialsPage />} />
        <Route path="assignments" element={<StudentAssignmentsPage />} />
        <Route path="tests" element={<StudentTestsPage />} />
        <Route path="attendance" element={<StudentAttendancePage />} />
        <Route path="results" element={<StudentResultsPage />} />
        <Route path="fees" element={<StudentFeesPage />} />
        <Route path="timetable" element={<StudentTimetablePage />} />
        <Route path="announcements" element={<StudentAnnouncementsPage />} />
        <Route path="doubts" element={<StudentDoubtsPage />} />
        <Route path="profile" element={<StudentProfilePage />} />
      </Route>

      {/* Parent Portal */}
      <Route path="/parent" element={<ParentLayout />}>
        <Route index element={<ParentDashboardPage />} />
        <Route path="attendance" element={<ParentAttendancePage />} />
        <Route path="performance" element={<ParentPerformancePage />} />
        <Route path="tests" element={<ParentTestsPage />} />
        <Route path="assignments" element={<ParentAssignmentsPage />} />
        <Route path="fees" element={<ParentFeesPage />} />
        <Route path="timetable" element={<ParentTimetablePage />} />
        <Route path="announcements" element={<ParentAnnouncementsPage />} />
        <Route path="profile" element={<ParentProfilePage />} />
      </Route>

      {/* Admin Portal */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="students" element={<AdminStudentsPage />} />
        <Route path="teachers" element={<AdminTeachersPage />} />
        <Route path="classes" element={<AdminClassesPage />} />
        <Route path="batches" element={<AdminBatchesPage />} />
        <Route path="subjects" element={<AdminSubjectsPage />} />
        <Route path="attendance" element={<AdminAttendancePage />} />
        <Route path="materials" element={<AdminMaterialsPage />} />
        <Route path="assignments" element={<AdminAssignmentsPage />} />
        <Route path="tests" element={<AdminTestsPage />} />
        <Route path="questions" element={<AdminQuestionsPage />} />
        <Route path="results" element={<AdminResultsPage />} />
        <Route path="fees" element={<AdminFeesPage />} />
        <Route path="payments" element={<AdminPaymentsPage />} />
        <Route path="announcements" element={<AdminAnnouncementsPage />} />
        <Route path="notifications" element={<AdminNotificationsPage />} />
        <Route path="timetable" element={<AdminTimetablePage />} />
        <Route path="calendar" element={<AdminCalendarPage />} />
        <Route path="admissions" element={<AdminAdmissionsPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="gallery" element={<AdminGalleryPage />} />
        <Route path="ai-usage" element={<AdminAIUsagePage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
