import React, { useState } from 'react';
import { mockMaterials } from '../../data/mockMaterials';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../hooks/useToast';
import { Upload, Plus, FileText, Trash2, Download, Video, BookOpen } from 'lucide-react';

export const AdminMaterialsPage: React.FC = () => {
  const { success } = useToast();
  const [materials, setMaterials] = useState(mockMaterials);
  const [modalOpen, setModalOpen] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    title: '',
    chapter: '',
    subject: 'Mathematics',
    fileType: 'pdf',
    description: '',
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const created: any = {
      id: `mat-00${materials.length + 1}`,
      title: newMaterial.title,
      description: newMaterial.description || 'Uploaded via administrative content hub.',
      fileType: newMaterial.fileType,
      fileSize: '4.2 MB',
      downloadUrl: '#',
      classId: 'cls-10',
      className: 'Class 10',
      subject: newMaterial.subject,
      chapter: newMaterial.chapter,
      uploadedAt: new Date().toISOString().split('T')[0],
      uploadedBy: 'Admin Team',
      isImportant: true,
    };
    setMaterials([created, ...materials]);
    setModalOpen(false);
    success('Material Uploaded!', `"${created.title}" is now available in student study repos.`);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#173F35]">Study Material Hub</h2>
          <p className="text-xs text-stone-500">
            Upload notes, lecture videos, revision mindmaps, and board question banks.
          </p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
          Upload Material
        </Button>
      </div>

      {/* Upload Drag & Drop Banner */}
      <div
        onClick={() => setModalOpen(true)}
        className="border-2 border-dashed border-[#E6DDCF] bg-[#FFFDF8] rounded-3xl p-8 text-center hover:border-[#173F35] transition-colors cursor-pointer shadow-soft"
      >
        <Upload className="w-10 h-10 text-[#2E6B57] mx-auto mb-2" />
        <h4 className="text-base font-serif font-bold text-[#173F35]">Upload New Document, Video, or Question Paper</h4>
        <p className="text-xs text-stone-500 mt-1">Click to select files or drag documents directly into the portal</p>
      </div>

      {/* Library Table */}
      <Card variant="paper" className="p-0 border-[#EDE6D8] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F7F3EA] border-b border-[#EDE6D8] text-stone-500 uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Title & Chapter</th>
                <th className="py-3.5 px-4">Subject & Format</th>
                <th className="py-3.5 px-4">Class</th>
                <th className="py-3.5 px-4">Upload Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE6D8]">
              {materials.map((m) => (
                <tr key={m.id} className="hover:bg-[#F7F3EA]/40">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-[#173F35]">{m.title}</p>
                    <p className="text-[11px] text-[#B85C45] font-semibold">{m.chapter}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-stone-800">{m.subject}</span>
                    <Badge variant="neutral" size="sm" className="ml-2 uppercase text-[10px]">
                      {m.fileType}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 font-semibold">{m.className}</td>
                  <td className="py-3.5 px-4 text-stone-500">{m.uploadedAt}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => success('Deleted', `Removed material ${m.title}`)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Upload Academic Material"
        subtitle="Makes files accessible in student portals instantly"
      >
        <form onSubmit={handleUpload} className="space-y-4">
          <Input
            label="Material Title *"
            placeholder="e.g. Chapter 4 Quadratic Formula Derivations"
            value={newMaterial.title}
            onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Subject *"
              options={[
                { label: 'Mathematics', value: 'Mathematics' },
                { label: 'Physics', value: 'Physics' },
                { label: 'Chemistry', value: 'Chemistry' },
                { label: 'Biology', value: 'Biology' },
              ]}
              value={newMaterial.subject}
              onChange={(e) => setNewMaterial({ ...newMaterial, subject: e.target.value })}
            />
            <Select
              label="File Format *"
              options={[
                { label: 'PDF Document', value: 'pdf' },
                { label: 'Revision Notes', value: 'notes' },
                { label: 'Video Lecture URL', value: 'video' },
                { label: 'Question Bank', value: 'question_paper' },
              ]}
              value={newMaterial.fileType}
              onChange={(e) => setNewMaterial({ ...newMaterial, fileType: e.target.value })}
            />
          </div>
          <Input
            label="Chapter Name / Module *"
            placeholder="e.g. Chapter 4: Quadratic Equations"
            value={newMaterial.chapter}
            onChange={(e) => setNewMaterial({ ...newMaterial, chapter: e.target.value })}
            required
          />

          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Publish Material
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
