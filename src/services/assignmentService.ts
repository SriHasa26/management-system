import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Assignment, AssignmentSubmission } from '../types';
import { mockAssignments } from '../data/mockAssignments';
import { storageService } from './storageService';

export const assignmentService = {
  /**
   * Fetch all assignments
   */
  async getAssignments(className?: string, batchName?: string): Promise<Assignment[]> {
    if (!isSupabaseConfigured()) {
      let list = [...mockAssignments];
      if (className && className !== 'All') {
        list = list.filter((a) => a.className.toLowerCase() === className.toLowerCase());
      }
      return list;
    }

    let query = supabase.from('assignments').select('*').order('due_date', { ascending: true });
    if (className && className !== 'All') {
      query = query.ilike('class_name', `%${className}%`);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return mockAssignments;
    }

    return (data as any[]).map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      subject: row.subject,
      className: row.class_name,
      batchName: row.batch_name || 'Class 10 - Morning Star (CBSE)',
      dueDate: row.due_date ? row.due_date.split('T')[0] : '2026-10-05',
      assignedDate: row.assigned_date || '2026-09-25',
      totalMarks: row.total_marks || 25,
      status: row.status as any,
      submissionCount: 14,
      totalSubmissionsExpected: 20,
      instructions: row.instructions || undefined,
      attachmentUrl: row.attachment_url || undefined,
    }));
  },

  /**
   * Create assignment (Admin / Teacher)
   */
  async createAssignment(
    assignment: Omit<Assignment, 'id' | 'submissionCount' | 'totalSubmissionsExpected'>,
    file?: File
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    let attachmentUrl = assignment.attachmentUrl || '';

    if (file) {
      const uploadRes = await storageService.uploadFile('study-materials', 'assignments', file);
      if (uploadRes.url) {
        attachmentUrl = uploadRes.url;
      }
    }

    if (!isSupabaseConfigured()) {
      return {
        success: true,
        data: {
          id: `asg-${Date.now()}`,
          ...assignment,
          attachmentUrl,
          submissionCount: 0,
          totalSubmissionsExpected: 20,
        },
      };
    }

    const { data, error } = await supabase.from('assignments').insert({
      title: assignment.title,
      description: assignment.description,
      class_name: assignment.className,
      batch_name: assignment.batchName,
      subject: assignment.subject,
      due_date: new Date(assignment.dueDate).toISOString(),
      assigned_date: assignment.assignedDate || new Date().toISOString().split('T')[0],
      total_marks: assignment.totalMarks,
      instructions: assignment.instructions,
      attachment_url: attachmentUrl,
      status: 'Active',
    } as any).select().single();

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data };
  },

  /**
   * Student submits an assignment file
   */
  async submitAssignment(
    assignmentId: string,
    studentId: string,
    studentName: string,
    file: File
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    const uploadRes = await storageService.uploadFile('assignment-submissions', studentId, file);
    const fileUrl = uploadRes.url || '#submitted-file';

    if (!isSupabaseConfigured()) {
      return {
        success: true,
        data: {
          id: `sub-${Date.now()}`,
          assignmentId,
          studentId,
          studentName,
          fileUrl,
          submittedAt: new Date().toISOString(),
          status: 'Submitted',
        },
      };
    }

    const { data, error } = await supabase.from('assignment_submissions').upsert({
      assignment_id: assignmentId,
      student_id: studentId,
      student_name: studentName,
      file_url: fileUrl,
      submitted_at: new Date().toISOString(),
      status: 'Submitted',
    } as any).select().single();

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data };
  },

  /**
   * Evaluate a student's submission (Teacher / Admin)
   */
  async evaluateSubmission(
    submissionId: string,
    marksObtained: number,
    feedback: string,
    gradedBy: string = 'Mrs. Telu Dhana Lakshmi'
  ): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) {
      return { success: true };
    }

    const { error } = await supabase
      .from('assignment_submissions')
      .update({
        marks_obtained: marksObtained,
        feedback,
        status: 'Evaluated',
        graded_at: new Date().toISOString(),
        graded_by: gradedBy,
      } as any)
      .eq('id', submissionId);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  },
};
