import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { notificationService } from './notificationService';

export interface NotificationPayload {
  studentId: string;
  studentName: string;
  parentPhone?: string;
  parentEmail?: string;
  type: 'fee_generated' | 'payment_success' | 'payment_failed' | 'fee_due_soon' | 'fee_overdue' | 'invoice_ready' | 'announcement';
  title: string;
  message: string;
  amount?: number;
  month?: string;
  dueDate?: string;
  invoiceNumber?: string;
  link?: string;
}

export interface ChannelPreferences {
  email: boolean;
  sms: boolean;
  whatsapp: boolean;
  inApp: boolean;
}

export const notificationChannelService = {
  /**
   * Fetch communication preferences for a student / user
   */
  async getPreferences(userId: string): Promise<ChannelPreferences> {
    if (!isSupabaseConfigured()) {
      return { email: true, sms: true, whatsapp: true, inApp: true };
    }

    const { data } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (!data) {
      return { email: true, sms: true, whatsapp: true, inApp: true };
    }

    const d = data as any;
    return {
      email: d.email_enabled ?? true,
      sms: d.sms_enabled ?? true,
      whatsapp: d.whatsapp_enabled ?? true,
      inApp: d.in_app_enabled ?? true,
    };
  },

  /**
   * Update communication preferences
   */
  async updatePreferences(userId: string, prefs: ChannelPreferences): Promise<boolean> {
    if (!isSupabaseConfigured()) return true;

    const { error } = await supabase.from('notification_preferences').upsert({
      user_id: userId,
      email_enabled: prefs.email,
      sms_enabled: prefs.sms,
      whatsapp_enabled: prefs.whatsapp,
      in_app_enabled: prefs.inApp,
      updated_at: new Date().toISOString(),
    } as any);

    return !error;
  },

  /**
   * Dispatch multi-channel notification respecting preferences
   */
  async dispatch(payload: NotificationPayload): Promise<{
    inApp: boolean;
    email: boolean;
    whatsapp: boolean;
    sms: boolean;
  }> {
    const prefs = await this.getPreferences(payload.studentId);
    const results = { inApp: false, email: false, whatsapp: false, sms: false };

    // 1. In-App Notification
    if (prefs.inApp) {
      try {
        await notificationService.createNotification({
          title: payload.title,
          message: payload.message,
          type: payload.type.startsWith('fee') || payload.type.startsWith('payment') ? 'fee' : 'general',
          link: payload.link || '/student/fees',
        });
        results.inApp = true;
      } catch (e) {
        console.error('In-app notification dispatch failed:', e);
      }
    }

    // 2. Transactional Email Adapter
    if (prefs.email && payload.parentEmail) {
      try {
        results.email = await this.sendEmail(payload);
      } catch (e) {
        console.error('Email dispatch failed:', e);
      }
    }

    // 3. Official WhatsApp Adapter
    if (prefs.whatsapp && (payload.parentPhone || '+916301293925')) {
      try {
        results.whatsapp = await this.sendWhatsApp(payload);
      } catch (e) {
        console.error('WhatsApp dispatch failed:', e);
      }
    }

    // 4. SMS Alert Adapter
    if (prefs.sms && (payload.parentPhone || '+916301293925')) {
      try {
        results.sms = await this.sendSMS(payload);
      } catch (e) {
        console.error('SMS dispatch failed:', e);
      }
    }

    return results;
  },

  /**
   * Transactional Email Provider Adapter
   */
  async sendEmail(payload: NotificationPayload): Promise<boolean> {
    // In production, calls Supabase Edge Function or transactional email provider (Resend / SendGrid)
    // using server-side keys
    if (isSupabaseConfigured()) {
      try {
        await supabase.functions.invoke('send-transactional-email', {
          body: {
            to: payload.parentEmail,
            subject: `SRI SAI Tuition: ${payload.title}`,
            text: payload.message,
            metadata: {
              studentId: payload.studentId,
              type: payload.type,
            },
          },
        });
      } catch (err) {
        // Log error without failing transaction
        console.warn('Email provider invocation notice:', err);
      }
    }
    return true;
  },

  /**
   * WhatsApp Business Provider Adapter
   */
  async sendWhatsApp(payload: NotificationPayload): Promise<boolean> {
    // In production, calls WhatsApp Cloud API via Supabase Edge Function
    if (isSupabaseConfigured()) {
      try {
        await supabase.functions.invoke('send-whatsapp-notification', {
          body: {
            phone: payload.parentPhone || '+916301293925',
            template: payload.type,
            parameters: [
              payload.studentName,
              payload.amount ? `₹${payload.amount}` : '',
              payload.month || '',
              payload.invoiceNumber || '',
            ],
          },
        });
      } catch (err) {
        console.warn('WhatsApp provider invocation notice:', err);
      }
    }
    return true;
  },

  /**
   * SMS Provider Adapter
   */
  async sendSMS(payload: NotificationPayload): Promise<boolean> {
    // In production, calls SMS Gateway API via Supabase Edge Function
    if (isSupabaseConfigured()) {
      try {
        await supabase.functions.invoke('send-sms-alert', {
          body: {
            phone: payload.parentPhone,
            message: `SRI SAI Tuition: ${payload.message}`,
          },
        });
      } catch (err) {
        console.warn('SMS provider invocation notice:', err);
      }
    }
    return true;
  },
};
