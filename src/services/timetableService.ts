import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { TimetableSlot } from '../types';
import { mockTimetable } from '../data/mockTimetable';

export const timetableService = {
  /**
   * Fetch timetable slots filtered optionally by class, batch or day
   */
  async getTimetable(filters?: { className?: string; batchName?: string; dayOfWeek?: string }): Promise<TimetableSlot[]> {
    if (!isSupabaseConfigured()) {
      let list = [...mockTimetable];
      if (filters?.className && filters.className !== 'All') {
        list = list.filter((t) => t.className.toLowerCase().includes(filters.className!.toLowerCase()));
      }
      if (filters?.dayOfWeek && filters.dayOfWeek !== 'All') {
        list = list.filter((t) => t.dayOfWeek.toLowerCase() === filters.dayOfWeek!.toLowerCase());
      }
      return list;
    }

    let query = supabase.from('timetables').select('*').order('created_at', { ascending: true });
    if (filters?.className && filters.className !== 'All') {
      query = query.ilike('class_name', `%${filters.className}%`);
    }
    if (filters?.dayOfWeek && filters.dayOfWeek !== 'All') {
      query = query.eq('day_of_week', filters.dayOfWeek);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return mockTimetable;
    }

    return (data as any[]).map((row) => ({
      id: row.id,
      dayOfWeek: row.day_of_week as any,
      timeSlot: row.time_slot,
      subject: row.subject,
      teacherName: row.teacher_name || 'Mrs. Telu Dhana Lakshmi',
      room: row.room || 'Room 1',
      className: row.class_name,
      batchName: row.batch_name || 'Morning Star',
    }));
  },

  /**
   * Add a new timetable slot
   */
  async addSlot(slot: Omit<TimetableSlot, 'id'>): Promise<{ success: boolean; data?: any; error?: string }> {
    if (!isSupabaseConfigured()) {
      return {
        success: true,
        data: {
          id: `tt-${Date.now()}`,
          ...slot,
        },
      };
    }

    const { data, error } = await supabase.from('timetables').insert({
      day_of_week: slot.dayOfWeek,
      time_slot: slot.timeSlot,
      class_name: slot.className,
      batch_name: slot.batchName,
      subject: slot.subject,
      teacher_name: slot.teacherName,
      room: slot.room,
    } as any).select().single();

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data };
  },

  /**
   * Delete a timetable slot
   */
  async deleteSlot(id: string): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) {
      return { success: true };
    }
    const { error } = await supabase.from('timetables').delete().eq('id', id);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  },
};
