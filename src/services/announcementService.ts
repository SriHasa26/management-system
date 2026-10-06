import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Announcement } from '../types';
import { mockAnnouncements } from '../data/mockAnnouncements';

export const announcementService = {
  async getAllAnnouncements(): Promise<Announcement[]> {
    if (!isSupabaseConfigured()) {
      return mockAnnouncements;
    }

    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return mockAnnouncements;
    }

    return (data as any[]).map((row) => ({
      id: row.id,
      title: row.title,
      content: row.content,
      audience: (row.target_audience === 'All' || row.target_audience === 'Students' || row.target_audience === 'Parents'
        ? row.target_audience
        : 'Specific Class') as any,
      priority: (row.priority === 'High' ? 'Important' : row.priority === 'Urgent' ? 'Urgent' : 'Normal') as any,
      publishedAt: row.created_at ? row.created_at.split('T')[0] : '2026-09-28',
      author: row.author_name || 'Mrs. Telu Dhana Lakshmi',
      pinned: row.priority === 'Urgent' || row.priority === 'High',
    }));
  },

  async createAnnouncement(announcement: Omit<Announcement, 'id' | 'publishedAt'>): Promise<{ success: boolean; data?: any; error?: string }> {
    if (!isSupabaseConfigured()) {
      return {
        success: true,
        data: {
          id: `ann-${Date.now()}`,
          ...announcement,
          publishedAt: new Date().toISOString().split('T')[0],
        },
      };
    }

    const { data, error } = await supabase.from('announcements').insert({
      title: announcement.title,
      content: announcement.content,
      target_audience: announcement.audience,
      priority: announcement.priority === 'Important' ? 'High' : announcement.priority,
      author_name: announcement.author || 'Mrs. Telu Dhana Lakshmi',
      author_role: 'Head Faculty & Admin',
    } as any).select().single();

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data };
  },

  async deleteAnnouncement(id: string): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) {
      return { success: true };
    }

    const { error } = await supabase.from('announcements').delete().eq('id', id);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  },
};
