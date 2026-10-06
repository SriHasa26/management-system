// src/services/aiDoubtBuddyService.ts
// Client-side service for SRI SAI AI Doubt Buddy
// Calls the server-side Edge Function — no private keys on the client.

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { doubtService } from './doubtService';

export type InputType = 'text' | 'image' | 'voice' | 'document';
export type ConversationMode =
  | 'normal'
  | 'explain_simply'
  | 'step_by_step'
  | 'hint'
  | 'summarize'
  | 'example'
  | 'quiz_me';
export type SourceType = 'SRI_SAI_MATERIAL' | 'CURRICULUM' | 'GENERAL_AI' | 'WEB';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  inputType: InputType;
  mode: ConversationMode;
  sourceType?: SourceType;
  sources?: AISource[];
  attachmentUrl?: string;
  attachmentType?: InputType;
  attachmentName?: string;
  createdAt: string;
}

export interface AISource {
  title: string;
  subject: string;
  chapter: string;
  materialId?: string;
}

export interface AIConversation {
  id: string;
  title: string;
  contextClass?: string;
  contextBoard?: string;
  contextSubject?: string;
  messages: AIMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface StudentAIContext {
  name?: string;
  className?: string;
  board?: string;
  subject?: string;
  chapter?: string;
}

// ─── Conversation CRUD ─────────────────────────────────────────────────────────

export const aiDoubtBuddyService = {
  /**
   * Fetch all conversations for the authenticated user.
   */
  async getConversations(): Promise<AIConversation[]> {
    if (!isSupabaseConfigured()) return [];
    const { data, error } = await supabase
      .from('ai_conversations')
      .select('*')
      .order('updated_at', { ascending: false });
    if (error || !data) return [];
    return (data as any[]).map(row => ({
      id: row.id,
      title: row.title,
      contextClass: row.context_class,
      contextBoard: row.context_board,
      contextSubject: row.context_subject,
      messages: [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  },

  /**
   * Create a new conversation.
   */
  async createConversation(ctx: StudentAIContext): Promise<{ id: string } | null> {
    if (!isSupabaseConfigured()) {
      return { id: `local-${Date.now()}` };
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('ai_conversations')
      .insert({
        user_id: user.id,
        title: 'New Conversation',
        context_class: ctx.className ?? null,
        context_board: ctx.board ?? null,
        context_subject: ctx.subject ?? null,
      } as any)
      .select('id')
      .single();

    if (error || !data) return null;
    return { id: (data as any).id };
  },

  /**
   * Rename a conversation.
   */
  async renameConversation(conversationId: string, title: string): Promise<void> {
    if (!isSupabaseConfigured()) return;
    await supabase
      .from('ai_conversations')
      .update({ title, updated_at: new Date().toISOString() } as any)
      .eq('id', conversationId);
  },

  /**
   * Delete a conversation.
   */
  async deleteConversation(conversationId: string): Promise<void> {
    if (!isSupabaseConfigured()) return;
    await supabase.from('ai_conversations').delete().eq('id', conversationId);
  },

  /**
   * Fetch all messages for a conversation.
   */
  async getMessages(conversationId: string): Promise<AIMessage[]> {
    if (!isSupabaseConfigured()) return [];
    const { data, error } = await supabase
      .from('ai_messages')
      .select('*, ai_sources(*), ai_attachments(*)')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error || !data) return [];

    return (data as any[]).map(row => ({
      id: row.id,
      role: row.role,
      content: row.content,
      inputType: row.input_type ?? 'text',
      mode: row.mode ?? 'normal',
      sourceType: row.source_type ?? 'GENERAL_AI',
      sources: (row.ai_sources ?? []).map((s: any) => ({
        title: s.material_title ?? s.title ?? 'Study Material',
        subject: s.subject ?? '',
        chapter: s.chapter ?? '',
        materialId: s.material_id,
      })),
      attachmentUrl: row.ai_attachments?.[0]?.file_url,
      attachmentType: row.ai_attachments?.[0]?.file_type,
      attachmentName: row.ai_attachments?.[0]?.file_name,
      createdAt: row.created_at,
    }));
  },

  /**
   * Save a user or assistant message to the database.
   */
  async saveMessage(
    conversationId: string,
    role: 'user' | 'assistant',
    content: string,
    inputType: InputType,
    mode: ConversationMode,
    sourceType: SourceType,
    sources: AISource[],
    model?: string
  ): Promise<string | null> {
    if (!isSupabaseConfigured()) return `local-msg-${Date.now()}`;

    const { data, error } = await supabase
      .from('ai_messages')
      .insert({
        conversation_id: conversationId,
        role,
        content,
        input_type: inputType,
        mode,
        source_type: sourceType,
        model_used: model ?? null,
      } as any)
      .select('id')
      .single();

    if (error || !data) return null;
    const messageId = (data as any).id;

    // Save sources
    if (sources.length > 0) {
      await supabase.from('ai_sources').insert(
        sources.map(src => ({
          message_id: messageId,
          material_id: src.materialId ?? null,
          material_title: src.title,
          subject: src.subject,
          chapter: src.chapter,
        }) as any)
      );
    }

    // Update conversation timestamp
    await supabase
      .from('ai_conversations')
      .update({ updated_at: new Date().toISOString() } as any)
      .eq('id', conversationId);

    return messageId;
  },

  /**
   * Auto-generate conversation title from first user message.
   */
  async autoTitleConversation(conversationId: string, userMessage: string): Promise<void> {
    if (!isSupabaseConfigured()) return;
    const title = userMessage.slice(0, 60) + (userMessage.length > 60 ? '…' : '');
    await supabase
      .from('ai_conversations')
      .update({ title } as any)
      .eq('id', conversationId);
  },

  // ─── Core AI Call ──────────────────────────────────────────────────────────

  /**
   * Send a message to the AI Doubt Buddy Edge Function.
   * Returns the AI reply and source metadata.
   */
  async askDoubtBuddy(params: {
    conversationId: string;
    userMessage: string;
    inputType: InputType;
    mode: ConversationMode;
    imageBase64?: string;
    imageMimeType?: string;
    studentContext: StudentAIContext;
    historyMessages: Array<{ role: 'user' | 'assistant'; content: string }>;
  }): Promise<{
    reply: string;
    sourceType: SourceType;
    sources: AISource[];
    model: string;
    providerConfigured: boolean;
    error?: string;
  }> {
    if (!isSupabaseConfigured()) {
      return {
        reply: '⚙️ **Demo Mode**: The AI Doubt Buddy requires Supabase to be configured to make real AI requests. Please configure your Supabase and AI provider credentials.',
        sourceType: 'GENERAL_AI',
        sources: [],
        model: 'demo',
        providerConfigured: false,
      };
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return {
        reply: 'You need to be logged in to use the AI Doubt Buddy.',
        sourceType: 'GENERAL_AI',
        sources: [],
        model: '',
        providerConfigured: false,
        error: 'NOT_AUTHENTICATED',
      };
    }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const functionUrl = `${supabaseUrl}/functions/v1/ai-doubt-buddy`;

    try {
      const resp = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          conversationId: params.conversationId,
          userMessage: params.userMessage,
          inputType: params.inputType,
          mode: params.mode,
          imageBase64: params.imageBase64,
          imageMimeType: params.imageMimeType,
          studentContext: params.studentContext,
          historyMessages: params.historyMessages.slice(-MAX_HISTORY_IN_CONTEXT),
        }),
      });

      const json = await resp.json();

      if (!resp.ok) {
        if (json.error === 'AI_PROVIDER_NOT_CONFIGURED' || json.providerConfigured === false) {
          return {
            reply: '⚙️ **AI Not Configured**: The AI provider credentials have not been set up yet. Please ask your administrator to configure the AI service.',
            sourceType: 'GENERAL_AI',
            sources: [],
            model: '',
            providerConfigured: false,
          };
        }
        if (json.error === 'USAGE_LIMIT') {
          return {
            reply: `⏱️ **Daily Limit Reached**: ${json.message ?? "You've reached your daily AI request limit."}`,
            sourceType: 'GENERAL_AI',
            sources: [],
            model: '',
            providerConfigured: true,
            error: 'USAGE_LIMIT',
          };
        }
        throw new Error(json.message ?? 'AI request failed');
      }

      return {
        reply: json.reply ?? 'Sorry, I could not generate a response. Please try again.',
        sourceType: json.sourceType ?? 'GENERAL_AI',
        sources: json.sources ?? [],
        model: json.model ?? '',
        providerConfigured: json.providerConfigured ?? true,
      };
    } catch (err: any) {
      return {
        reply: '😔 Sorry, I couldn\'t process your question right now. Please check your internet connection and try again.',
        sourceType: 'GENERAL_AI',
        sources: [],
        model: '',
        providerConfigured: true,
        error: err.message,
      };
    }
  },

  // ─── File Upload ───────────────────────────────────────────────────────────

  /**
   * Upload an AI attachment (image, audio, PDF) to Supabase Storage.
   * Files go to the ai-attachments bucket with user-scoped paths.
   */
  async uploadAttachment(
    file: File,
    conversationId: string,
    userId: string
  ): Promise<{ url: string | null; path: string | null; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { url: URL.createObjectURL(file), path: null, error: null };
    }

    const ext = file.name.split('.').pop() ?? 'bin';
    const fileName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const filePath = `${userId}/${conversationId}/${fileName}`;

    // Validate size (10 MB max)
    if (file.size > 10 * 1024 * 1024) {
      return { url: null, path: null, error: 'File too large. Maximum 10 MB allowed.' };
    }

    // Validate type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf', 'audio/webm', 'audio/ogg', 'audio/mp4', 'audio/wav'];
    if (!allowedTypes.includes(file.type)) {
      return { url: null, path: null, error: `File type "${file.type}" is not supported.` };
    }

    const { data, error } = await supabase.storage
      .from('ai-attachments')
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (error) return { url: null, path: null, error: error.message };

    const { data: urlData } = supabase.storage.from('ai-attachments').getPublicUrl(data.path);
    return { url: urlData.publicUrl, path: data.path, error: null };
  },

  /**
   * Convert File to base64 string for image vision.
   */
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Strip the data URL prefix
        resolve(result.split(',')[1] ?? result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  // ─── "Ask My Teacher" escalation ──────────────────────────────────────────

  /**
   * Escalate an AI conversation to the teacher via the existing doubts system.
   */
  async escalateToTeacher(params: {
    studentId: string;
    studentName: string;
    subject: string;
    className: string;
    userQuestion: string;
    aiReply: string;
    attachmentUrl?: string;
    conversationId?: string;
  }): Promise<{ success: boolean; error?: string }> {
    const aiContext = `**Student Question:**\n${params.userQuestion}\n\n**AI Explanation Provided:**\n${params.aiReply.slice(0, 800)}${params.aiReply.length > 800 ? '…' : ''}\n\n*(This doubt was escalated from SRI SAI AI Doubt Buddy after the student needed further clarification.)*`;

    const result = await doubtService.createDoubt({
      studentId: params.studentId,
      studentName: params.studentName,
      subject: params.subject,
      className: params.className,
      title: params.userQuestion.slice(0, 80),
      question: aiContext,
      attachmentUrl: params.attachmentUrl,
    });

    return result;
  },
};

/** Maximum history messages sent to the AI for context */
const MAX_HISTORY_IN_CONTEXT = 16;
