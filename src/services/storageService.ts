import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const storageService = {
  /**
   * Upload file to Supabase Storage bucket
   */
  async uploadFile(bucket: 'study-materials' | 'assignment-submissions' | 'doubt-attachments', path: string, file: File) {
    if (!isSupabaseConfigured()) {
      // In demo mode, generate an object URL or simulated path
      return {
        url: URL.createObjectURL(file),
        error: null,
      };
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { cacheControl: '3600', upsert: true });

    if (error) {
      return { url: null, error: error.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { url: publicUrlData.publicUrl, error: null };
  },
};
