import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Student } from '../types';
import { mockStudents } from '../data/mockStudents';

export const studentService = {
  /**
   * Fetch all students (Admin view)
   */
  async getAllStudents(): Promise<Student[]> {
    if (!isSupabaseConfigured()) {
      return mockStudents;
    }
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('name', { ascending: true });

    if (error || !data || data.length === 0) {
      return mockStudents;
    }

    return (data as any[]).map((row) => ({
      id: row.id,
      name: row.name,
      gender: row.gender as 'Male' | 'Female' | 'Other',
      dob: row.dob || '2009-05-15',
      grade: row.grade as any,
      board: row.board,
      batchId: row.batch_id || 'batch-10-morning',
      batchName: row.batch_name,
      rollNumber: row.roll_number,
      admissionDate: row.admission_date,
      photoUrl: row.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
      status: row.status as 'Active' | 'Inactive' | 'Graduated',
      parentName: row.parent_name,
      parentPhone: row.parent_phone,
      parentEmail: row.parent_email,
      parentRelation: row.parent_relation || 'Father',
      address: row.address,
      overallAttendance: row.overall_attendance || 90,
      feeStatus: row.fee_status,
      monthlyFee: row.monthly_fee,
      dueAmount: row.due_amount,
      lastTestScore: row.last_test_score,
    }));
  },

  /**
   * Get single student by ID
   */
  async getStudentById(id: string): Promise<Student | null> {
    if (!isSupabaseConfigured()) {
      return mockStudents.find((s) => s.id === id) || mockStudents[0];
    }
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return mockStudents.find((s) => s.id === id) || null;
    }

    const d = data as any;
    return {
      id: d.id,
      name: d.name,
      gender: d.gender as 'Male' | 'Female' | 'Other',
      dob: d.dob || '2009-05-15',
      grade: d.grade as any,
      board: d.board,
      batchId: d.batch_id || '',
      batchName: d.batch_name,
      rollNumber: d.roll_number,
      admissionDate: d.admission_date,
      photoUrl: d.photo_url || '',
      status: d.status as 'Active' | 'Inactive' | 'Graduated',
      parentName: d.parent_name,
      parentPhone: d.parent_phone,
      parentEmail: d.parent_email,
      parentRelation: d.parent_relation || 'Father',
      address: d.address,
      overallAttendance: d.overall_attendance,
      feeStatus: d.fee_status,
      monthlyFee: d.monthly_fee,
      dueAmount: d.due_amount,
      lastTestScore: d.last_test_score,
    };
  },

  /**
   * Create new student record
   */
  async createStudent(student: Partial<Student>): Promise<{ success: boolean; data?: any; error?: string }> {
    if (!isSupabaseConfigured()) {
      return { success: true, data: student };
    }

    const { data, error } = await supabase.from('students').insert({
      id: student.id || `SRI-2026-${Math.floor(100 + Math.random() * 900)}`,
      name: student.name || 'New Student',
      gender: student.gender || 'Male',
      dob: student.dob,
      grade: student.grade || 'Class 10',
      board: student.board || 'State Board',
      batch_id: student.batchId || null,
      batch_name: student.batchName || 'General Batch',
      roll_number: student.rollNumber || '01',
      admission_date: student.admissionDate || new Date().toISOString().split('T')[0],
      photo_url: student.photoUrl,
      status: student.status || 'Active',
      parent_name: student.parentName || 'Parent Name',
      parent_phone: student.parentPhone || '+91 98765 43210',
      parent_email: student.parentEmail || 'parent@example.com',
      parent_relation: student.parentRelation || 'Father',
      address: student.address || 'Patamata, Vijayawada',
      monthly_fee: student.monthlyFee || 1800,
      due_amount: student.dueAmount || 0,
      overall_attendance: 100,
      fee_status: 'Paid',
      last_test_score: 0,
    } as any).select().single();

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data };
  },

  /**
   * Update student details
   */
  async updateStudent(id: string, updates: Partial<Student>): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) {
      return { success: true };
    }

    const updatePayload: Record<string, any> = {};
    if (updates.name) updatePayload.name = updates.name;
    if (updates.gender) updatePayload.gender = updates.gender;
    if (updates.grade) updatePayload.grade = updates.grade;
    if (updates.board) updatePayload.board = updates.board;
    if (updates.batchName) updatePayload.batch_name = updates.batchName;
    if (updates.status) updatePayload.status = updates.status;
    if (updates.parentPhone) updatePayload.parent_phone = updates.parentPhone;
    if (updates.parentEmail) updatePayload.parent_email = updates.parentEmail;
    if (updates.address) updatePayload.address = updates.address;
    if (updates.feeStatus) updatePayload.fee_status = updates.feeStatus;
    if (updates.dueAmount !== undefined) updatePayload.due_amount = updates.dueAmount;

    const { error } = await supabase
      .from('students')
      .update(updatePayload as any)
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  },

  /**
   * Delete student
   */
  async deleteStudent(id: string): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) {
      return { success: true };
    }
    const { error } = await supabase.from('students').delete().eq('id', id);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  },
};
