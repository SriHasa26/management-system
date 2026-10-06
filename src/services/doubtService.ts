import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DoubtTicket, UserRole } from '../types';
import { mockDoubts } from '../data/mockDoubts';

export interface DoubtMessage {
  id: string;
  doubtId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  message: string;
  attachmentUrl?: string;
  createdAt: string;
}

export const doubtService = {
  async getStudentDoubts(studentId: string): Promise<DoubtTicket[]> {
    if (!isSupabaseConfigured()) {
      return mockDoubts.filter((d) => d.studentId === studentId);
    }

    const { data, error } = await supabase
      .from('doubts')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return mockDoubts.filter((d) => d.studentId === studentId);
    }

    return (data as any[]).map((row) => ({
      id: row.id,
      studentId: row.student_id,
      studentName: row.student_name,
      subject: row.subject,
      className: row.class_name || 'Class 10',
      title: row.title,
      question: row.description || row.question || '',
      attachmentUrl: row.attachment_url || undefined,
      status: row.status === 'Answered' ? 'Answered' : row.status === 'In Progress' ? 'In Review' : 'Pending',
      answer: row.answer || undefined,
      teacherName: row.answered_by || undefined,
      answeredAt: row.answered_at || undefined,
      createdAt: row.created_at,
    }));
  },

  async getAllDoubts(): Promise<DoubtTicket[]> {
    if (!isSupabaseConfigured()) {
      return mockDoubts;
    }

    const { data, error } = await supabase
      .from('doubts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return mockDoubts;
    }

    return (data as any[]).map((row) => ({
      id: row.id,
      studentId: row.student_id,
      studentName: row.student_name,
      subject: row.subject,
      className: row.class_name || 'Class 10',
      title: row.title,
      question: row.description || row.question || '',
      attachmentUrl: row.attachment_url || undefined,
      status: row.status === 'Answered' ? 'Answered' : row.status === 'In Progress' ? 'In Review' : 'Pending',
      answer: row.answer || undefined,
      teacherName: row.answered_by || undefined,
      answeredAt: row.answered_at || undefined,
      createdAt: row.created_at,
    }));
  },

  async createDoubt(doubt: Omit<DoubtTicket, 'id' | 'createdAt' | 'status'>): Promise<{ success: boolean; data?: any; error?: string }> {
    if (!isSupabaseConfigured()) {
      return {
        success: true,
        data: {
          id: `dbt-${Date.now()}`,
          ...doubt,
          status: 'Pending',
          createdAt: new Date().toISOString(),
        },
      };
    }

    const { data, error } = await supabase.from('doubts').insert({
      student_id: doubt.studentId,
      student_name: doubt.studentName,
      subject: doubt.subject,
      title: doubt.title,
      description: doubt.question,
      attachment_url: doubt.attachmentUrl || null,
      status: 'Open',
    } as any).select().single();

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data };
  },

  async answerDoubt(doubtId: string, answer: string, answeredBy: string = 'Mrs. Telu Dhana Lakshmi'): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) {
      return { success: true };
    }

    const { error } = await supabase
      .from('doubts')
      .update({
        answer,
        answered_by: answeredBy,
        answered_at: new Date().toISOString(),
        status: 'Answered',
      } as any)
      .eq('id', doubtId);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  },

  async getDoubtMessages(doubtId: string): Promise<DoubtMessage[]> {
    if (!isSupabaseConfigured()) {
      const doubt = mockDoubts.find((d) => d.id === doubtId);
      if (!doubt) return [];
      const messages: DoubtMessage[] = [
        {
          id: `msg-1`,
          doubtId,
          senderId: doubt.studentId,
          senderName: doubt.studentName,
          senderRole: 'student',
          message: doubt.question,
          createdAt: doubt.createdAt,
        },
      ];
      if (doubt.answer) {
        messages.push({
          id: `msg-2`,
          doubtId,
          senderId: 'faculty-01',
          senderName: doubt.teacherName || 'Mrs. Telu Dhana Lakshmi',
          senderRole: 'admin',
          message: doubt.answer,
          createdAt: doubt.answeredAt || doubt.createdAt,
        });
      }
      return messages;
    }

    const { data, error } = await supabase
      .from('doubt_messages')
      .select('*')
      .eq('doubt_id', doubtId)
      .order('created_at', { ascending: true });

    if (error || !data) return [];

    return (data as any[]).map((row) => ({
      id: row.id,
      doubtId: row.doubt_id,
      senderId: row.sender_id,
      senderName: row.sender_name,
      senderRole: row.sender_role,
      message: row.message,
      attachmentUrl: row.attachment_url || undefined,
      createdAt: row.created_at,
    }));
  },

  async sendDoubtMessage(message: Omit<DoubtMessage, 'id' | 'createdAt'>): Promise<{ success: boolean; data?: any; error?: string }> {
    if (!isSupabaseConfigured()) {
      return {
        success: true,
        data: {
          id: `msg-${Date.now()}`,
          ...message,
          createdAt: new Date().toISOString(),
        },
      };
    }

    const { data, error } = await supabase.from('doubt_messages').insert({
      doubt_id: message.doubtId,
      sender_id: message.senderId,
      sender_name: message.senderName,
      sender_role: message.senderRole,
      message: message.message,
      attachment_url: message.attachmentUrl || null,
    } as any).select().single();

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data };
  },
};
