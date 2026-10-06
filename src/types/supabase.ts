/**
 * Supabase Database Schema Types for SRI SAI Tuition & Learning Centre
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          role: 'student' | 'parent' | 'admin' | 'teacher';
          full_name: string;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: 'student' | 'parent' | 'admin' | 'teacher';
          full_name: string;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: 'student' | 'parent' | 'admin' | 'teacher';
          full_name?: string;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      students: {
        Row: {
          id: string;
          profile_id: string | null;
          parent_id: string | null;
          name: string;
          gender: string;
          dob: string | null;
          grade: string;
          board: 'CBSE' | 'State Board' | 'ICSE' | 'MPC' | 'BiPC' | 'MEC';
          batch_id: string | null;
          batch_name: string;
          roll_number: string;
          admission_date: string;
          photo_url: string | null;
          status: string;
          parent_name: string;
          parent_phone: string;
          parent_email: string;
          parent_relation: string;
          address: string;
          overall_attendance: number;
          fee_status: 'Paid' | 'Pending' | 'Overdue' | 'Partially Paid';
          monthly_fee: number;
          due_amount: number;
          last_test_score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          profile_id?: string | null;
          parent_id?: string | null;
          name: string;
          gender?: string;
          dob?: string | null;
          grade: string;
          board?: 'CBSE' | 'State Board' | 'ICSE' | 'MPC' | 'BiPC' | 'MEC';
          batch_id?: string | null;
          batch_name: string;
          roll_number: string;
          admission_date?: string;
          photo_url?: string | null;
          status?: string;
          parent_name: string;
          parent_phone: string;
          parent_email: string;
          parent_relation?: string;
          address: string;
          overall_attendance?: number;
          fee_status?: 'Paid' | 'Pending' | 'Overdue' | 'Partially Paid';
          monthly_fee?: number;
          due_amount?: number;
          last_test_score?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string | null;
          parent_id?: string | null;
          name?: string;
          gender?: string;
          dob?: string | null;
          grade?: string;
          board?: 'CBSE' | 'State Board' | 'ICSE' | 'MPC' | 'BiPC' | 'MEC';
          batch_id?: string | null;
          batch_name?: string;
          roll_number?: string;
          admission_date?: string;
          photo_url?: string | null;
          status?: string;
          parent_name?: string;
          parent_phone?: string;
          parent_email?: string;
          parent_relation?: string;
          address?: string;
          overall_attendance?: number;
          fee_status?: 'Paid' | 'Pending' | 'Overdue' | 'Partially Paid';
          monthly_fee?: number;
          due_amount?: number;
          last_test_score?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      attendance: {
        Row: {
          id: string;
          student_id: string;
          student_name: string;
          batch_id: string | null;
          date: string;
          status: 'Present' | 'Absent' | 'Late' | 'Excused';
          subject: string | null;
          remarks: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          student_name: string;
          batch_id?: string | null;
          date: string;
          status?: 'Present' | 'Absent' | 'Late' | 'Excused';
          subject?: string | null;
          remarks?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          student_name?: string;
          batch_id?: string | null;
          date?: string;
          status?: 'Present' | 'Absent' | 'Late' | 'Excused';
          subject?: string | null;
          remarks?: string | null;
          created_at?: string;
        };
      };
      fees: {
        Row: {
          id: string;
          student_id: string;
          student_name: string;
          month: string;
          year: number;
          amount: number;
          paid_amount: number;
          due_date: string;
          status: 'Paid' | 'Pending' | 'Overdue' | 'Partially Paid';
          paid_date: string | null;
          invoice_number: string;
          receipt_url: string | null;
          payment_method: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          student_name: string;
          month: string;
          year?: number;
          amount: number;
          paid_amount?: number;
          due_date: string;
          status?: 'Paid' | 'Pending' | 'Overdue' | 'Partially Paid';
          paid_date?: string | null;
          invoice_number: string;
          receipt_url?: string | null;
          payment_method?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          student_name?: string;
          month?: string;
          year?: number;
          amount?: number;
          paid_amount?: number;
          due_date?: string;
          status?: 'Paid' | 'Pending' | 'Overdue' | 'Partially Paid';
          paid_date?: string | null;
          invoice_number?: string;
          receipt_url?: string | null;
          payment_method?: string | null;
          created_at?: string;
        };
      };
      materials: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          class_name: string;
          subject: string;
          batch_id: string | null;
          file_type: string;
          file_size: string;
          file_url: string;
          uploaded_by: string;
          download_count: number;
          uploaded_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          class_name: string;
          subject: string;
          batch_id?: string | null;
          file_type?: string;
          file_size?: string;
          file_url: string;
          uploaded_by?: string;
          download_count?: number;
          uploaded_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          class_name?: string;
          subject?: string;
          batch_id?: string | null;
          file_type?: string;
          file_size?: string;
          file_url?: string;
          uploaded_by?: string;
          download_count?: number;
          uploaded_at?: string;
        };
      };
      announcements: {
        Row: {
          id: string;
          title: string;
          content: string;
          target_audience: string;
          priority: string;
          category: string;
          author_name: string;
          author_role: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          target_audience?: string;
          priority?: string;
          category?: string;
          author_name?: string;
          author_role?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          target_audience?: string;
          priority?: string;
          category?: string;
          author_name?: string;
          author_role?: string;
          created_at?: string;
        };
      };
      doubts: {
        Row: {
          id: string;
          student_id: string;
          student_name: string;
          subject: string;
          title: string;
          description: string;
          attachment_url: string | null;
          status: 'Open' | 'In Progress' | 'Answered' | 'Closed';
          answer: string | null;
          answered_by: string | null;
          answered_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          student_name: string;
          subject: string;
          title: string;
          description: string;
          attachment_url?: string | null;
          status?: 'Open' | 'In Progress' | 'Answered' | 'Closed';
          answer?: string | null;
          answered_by?: string | null;
          answered_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          student_name?: string;
          subject?: string;
          title?: string;
          description?: string;
          attachment_url?: string | null;
          status?: 'Open' | 'In Progress' | 'Answered' | 'Closed';
          answer?: string | null;
          answered_by?: string | null;
          answered_at?: string | null;
          created_at?: string;
        };
      };
      admissions: {
        Row: {
          id: string;
          student_name: string;
          parent_name: string;
          phone: string;
          email: string | null;
          grade: string;
          board: 'CBSE' | 'State Board' | 'ICSE' | 'MPC' | 'BiPC' | 'MEC';
          previous_school: string | null;
          marks_in_last_class: string | null;
          preferred_batch_timing: string | null;
          message: string | null;
          status: 'New Inquiry' | 'Contacted' | 'Assessment Scheduled' | 'Admitted' | 'Rejected';
          notes: string | null;
          submitted_at: string;
        };
        Insert: {
          id?: string;
          student_name: string;
          parent_name: string;
          phone: string;
          email?: string | null;
          grade: string;
          board?: 'CBSE' | 'State Board' | 'ICSE' | 'MPC' | 'BiPC' | 'MEC';
          previous_school?: string | null;
          marks_in_last_class?: string | null;
          preferred_batch_timing?: string | null;
          message?: string | null;
          status?: 'New Inquiry' | 'Contacted' | 'Assessment Scheduled' | 'Admitted' | 'Rejected';
          notes?: string | null;
          submitted_at?: string;
        };
        Update: {
          id?: string;
          student_name?: string;
          parent_name?: string;
          phone?: string;
          email?: string | null;
          grade?: string;
          board?: 'CBSE' | 'State Board' | 'ICSE' | 'MPC' | 'BiPC' | 'MEC';
          previous_school?: string | null;
          marks_in_last_class?: string | null;
          preferred_batch_timing?: string | null;
          message?: string | null;
          status?: 'New Inquiry' | 'Contacted' | 'Assessment Scheduled' | 'Admitted' | 'Rejected';
          notes?: string | null;
          submitted_at?: string;
        };
      };
    };
  };
}
