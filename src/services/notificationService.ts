import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { NotificationItem } from '../types';
import { mockNotifications } from '../data/mockAnnouncements';

export const notificationService = {
  /**
   * Fetch notifications
   */
  async getNotifications(userId?: string): Promise<NotificationItem[]> {
    if (!isSupabaseConfigured()) {
      return mockNotifications;
    }

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error || !data || data.length === 0) {
      return mockNotifications;
    }

    return (data as any[]).map((row) => ({
      id: row.id,
      title: row.title,
      message: row.message,
      type: row.type || 'general',
      timestamp: row.created_at ? new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
      read: row.read || false,
      link: row.link || undefined,
    }));
  },

  /**
   * Mark single notification as read
   */
  async markAsRead(id: string): Promise<void> {
    if (!isSupabaseConfigured()) return;
    await supabase.from('notifications').update({ read: true } as any).eq('id', id);
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    if (!isSupabaseConfigured()) return;
    await supabase.from('notifications').update({ read: true } as any).neq('read', true);
  },

  /**
   * Create a notification (triggered on announcements, results, assignments)
   */
  async createNotification(notification: { title: string; message: string; type: NotificationItem['type']; link?: string }): Promise<void> {
    if (!isSupabaseConfigured()) return;
    await supabase.from('notifications').insert({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      link: notification.link,
      read: false,
    } as any);
  },
};
