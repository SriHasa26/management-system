import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AdmissionEnquiry } from '../types';
import { mockAdmissionInquiries } from '../data/mockAdmissions';

export const admissionService = {
  async getAllAdmissions(): Promise<AdmissionEnquiry[]> {
    if (!isSupabaseConfigured()) {
      return mockAdmissionInquiries;
    }

    const { data, error } = await supabase
      .from('admissions')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return mockAdmissionInquiries;
    }

    return (data as any[]).map((row) => ({
      id: row.id,
      studentName: row.student_name,
      parentName: row.parent_name,
      phone: row.phone,
      email: row.email || undefined,
      gradeApplying: row.grade,
      board: row.board,
      message: row.message || undefined,
      status: row.status === 'New Inquiry' ? 'New' : row.status === 'Assessment Scheduled' ? 'Visit Scheduled' : 'Contacted',
      notes: row.notes || undefined,
      createdAt: row.submitted_at || new Date().toISOString(),
    }));
  },

  async submitInquiry(inquiry: Omit<AdmissionEnquiry, 'id' | 'createdAt' | 'status'>): Promise<{ success: boolean; data?: any; error?: string }> {
    if (!isSupabaseConfigured()) {
      return {
        success: true,
        data: {
          id: `adm-${Date.now()}`,
          ...inquiry,
          status: 'New',
          createdAt: new Date().toISOString(),
        },
      };
    }

    const { data, error } = await supabase.from('admissions').insert({
      student_name: inquiry.studentName,
      parent_name: inquiry.parentName,
      phone: inquiry.phone,
      email: inquiry.email || null,
      grade: inquiry.gradeApplying,
      board: inquiry.board,
      message: inquiry.message || null,
      status: 'New Inquiry',
    } as any).select().single();

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data };
  },

  async updateStatus(id: string, status: AdmissionEnquiry['status'], notes?: string): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) {
      return { success: true };
    }

    const { error } = await supabase
      .from('admissions')
      .update({
        status: status === 'New' ? 'New Inquiry' : status === 'Visit Scheduled' ? 'Assessment Scheduled' : 'Contacted',
        ...(notes ? { notes } : {}),
      } as any)
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  },
};
