import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { StudyMaterial } from '../types';
import { mockMaterials } from '../data/mockMaterials';
import { storageService } from './storageService';

export const materialService = {
  /**
   * Fetch all study materials, optionally filtered by class/subject/search
   */
  async getMaterials(filters?: { className?: string; subject?: string; search?: string }): Promise<StudyMaterial[]> {
    if (!isSupabaseConfigured()) {
      let list = [...mockMaterials];
      if (filters?.className && filters.className !== 'All') {
        list = list.filter((m) => m.className.toLowerCase() === filters.className!.toLowerCase());
      }
      if (filters?.subject && filters.subject !== 'All') {
        list = list.filter((m) => m.subject.toLowerCase() === filters.subject!.toLowerCase());
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        list = list.filter((m) => m.title.toLowerCase().includes(q) || m.chapter.toLowerCase().includes(q));
      }
      return list;
    }

    let query = supabase.from('study_materials').select('*').order('created_at', { ascending: false });

    if (filters?.className && filters.className !== 'All') {
      query = query.ilike('class_name', `%${filters.className}%`);
    }
    if (filters?.subject && filters.subject !== 'All') {
      query = query.ilike('subject', `%${filters.subject}%`);
    }
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,chapter.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return mockMaterials;
    }

    return (data as any[]).map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description || '',
      fileType: row.file_type || 'pdf',
      fileSize: row.file_size || '1.5 MB',
      downloadUrl: row.download_url || row.file_url || '#',
      videoUrl: row.video_url || undefined,
      classId: row.class_id || 'class-10',
      className: row.class_name,
      subject: row.subject,
      chapter: row.chapter,
      uploadedAt: row.created_at ? row.created_at.split('T')[0] : '2026-09-28',
      uploadedBy: row.uploaded_by || 'Mrs. Telu Dhana Lakshmi',
      isImportant: row.is_important || false,
    }));
  },

  /**
   * Upload and create new study material
   */
  async createMaterial(
    material: Omit<StudyMaterial, 'id' | 'uploadedAt'>,
    file?: File
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    let fileUrl = material.downloadUrl || '';

    if (file) {
      const uploadRes = await storageService.uploadFile('study-materials', 'materials', file);
      if (uploadRes.url) {
        fileUrl = uploadRes.url;
      }
    }

    if (!isSupabaseConfigured()) {
      return {
        success: true,
        data: {
          id: `mat-${Date.now()}`,
          ...material,
          downloadUrl: fileUrl || '#download',
          uploadedAt: new Date().toISOString().split('T')[0],
        },
      };
    }

    const { data, error } = await supabase.from('study_materials').insert({
      title: material.title,
      description: material.description,
      class_id: material.classId,
      class_name: material.className,
      subject: material.subject,
      chapter: material.chapter,
      file_type: material.fileType,
      file_size: material.fileSize,
      file_url: fileUrl,
      download_url: fileUrl,
      video_url: material.videoUrl || null,
      uploaded_by: material.uploadedBy || 'Mrs. Telu Dhana Lakshmi',
      is_important: material.isImportant || false,
    } as any).select().single();

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data };
  },

  /**
   * Delete study material
   */
  async deleteMaterial(id: string): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) {
      return { success: true };
    }
    const { error } = await supabase.from('study_materials').delete().eq('id', id);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  },
};
