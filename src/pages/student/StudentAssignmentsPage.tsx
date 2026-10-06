import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { assignmentService } from '../../services/assignmentService';
import { Assignment } from '../../types';
import { mockAssignments } from '../../data/mockAssignments';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Tabs } from '../../components/common/Tabs';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../hooks/useToast';
import { formatDate } from '../../lib/utils';
import { FileText, Calendar, Upload, CheckCircle2, Clock, FileCheck } from 'lucide-react';

export const StudentAssignmentsPage: React.FC = () => {
  const { success, error } = useToast();
  const { currentStudent } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [activeTab, setActiveTab] = useState<'Pending' | 'Submitted' | 'Evaluated' | 'All'>('Pending');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchAssignments() {
      try {
        const data = await assignmentService.getAssignments(currentStudent.grade);
        if (data && data.length > 0) setAssignments(data);
      } catch (err) {
        console.error('Error fetching assignments:', err);
      }
    }
    fetchAssignments();
  }, [currentStudent]);

  const tabs = [
    { id: 'Pending', label: 'Pending Submission', count: assignments.filter((a) => a.status === 'Pending').length },
    { id: 'Submitted', label: 'Under Review', count: assignments.filter((a) => a.status === 'Submitted').length },
    { id: 'Evaluated', label: 'Graded', count: assignments.filter((a) => a.status === 'Evaluated').length },
    { id: 'All', label: 'All Homework' },
  ];

  const filtered = activeTab === 'All'
    ? assignments
    : assignments.filter((a) => a.status === activeTab);

  const handleSubmitHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;

    if (!selectedFile) {
      error('File Required', 'Please choose a worksheet PDF or image to submit.');
      return;
    }

    setIsSubmitting(true);
    const res = await assignmentService.submitAssignment(
      selectedAssignment.id,
      currentStudent.id,
      currentStudent.name,
      selectedFile
    );
    setIsSubmitting(false);

    if (res.success) {
      success('Assignment Uploaded', `Your homework submission for "${selectedAssignment.title}" has been saved.`);
      setAssignments((prev) =>
        prev.map((a) => (a.id === selectedAssignment.id ? { ...a, status: 'Submitted' } : a))
      );
      setSelectedAssignment(null);
      setSelectedFile(null);
    } else {
      error('Submission Failed', res.error || 'Could not upload file');
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#173F35]">Daily Homework & Assignments</h2>
        <p className="text-xs text-stone-500">
          Complete daily concept problem sheets and submit handwritten worksheets for mentor review.
        </p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={(id) => setActiveTab(id as any)} variant="pills" />

      <div className="space-y-4">
        {filtered.map((item) => (
          <Card key={item.id} variant="paper" className="p-6 border-[#EDE6D8] flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <Badge variant="forest" size="sm" className="font-bold">
                  {item.subject}
                </Badge>
                <Badge
                  variant={item.status === 'Pending' ? 'terracotta' : item.status === 'Evaluated' ? 'sage' : 'neutral'}
                  size="sm"
                >
                  {item.status}
                </Badge>
                <span className="text-[11px] text-stone-400">Total Marks: {item.totalMarks}</span>
              </div>

              <h4 className="text-base font-bold text-[#173F35]">{item.title}</h4>
              <p className="text-xs text-stone-600 leading-relaxed">{item.description}</p>

              {item.instructions && (
                <p className="text-[11px] text-[#B85C45] font-semibold bg-[#FAF2F0] p-2 rounded-lg inline-block">
                  Note: {item.instructions}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-stone-200">
              <div className="text-left md:text-right text-xs text-stone-500">
                <div className="flex items-center md:justify-end gap-1 text-[#B85C45] font-bold">
                  <Clock className="w-3.5 h-3.5" /> Due: {formatDate(item.dueDate)}
                </div>
                <span className="text-[11px] text-stone-400">Assigned on: {formatDate(item.assignedDate)}</span>
              </div>

              {item.status === 'Pending' ? (
                <Button
                  size="sm"
                  variant="primary"
                  icon={<Upload className="w-3.5 h-3.5" />}
                  onClick={() => setSelectedAssignment(item)}
                >
                  Submit Homework
                </Button>
              ) : item.status === 'Evaluated' ? (
                <Button size="sm" variant="outline" icon={<CheckCircle2 className="w-3.5 h-3.5 text-[#2E6B57]" />}>
                  View Marks & Feedback
                </Button>
              ) : (
                <Badge variant="neutral" size="md">
                  Submitted • Pending Review
                </Badge>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Submit Assignment Modal */}
      <Modal
        isOpen={!!selectedAssignment}
        onClose={() => setSelectedAssignment(null)}
        title="Upload Homework Submission"
        subtitle={selectedAssignment?.title}
      >
        <form onSubmit={handleSubmitHomework} className="space-y-4">
          <div className="p-4 rounded-xl bg-[#F7F3EA] border border-[#E6DDCF] space-y-1 text-xs">
            <span className="font-bold text-[#173F35]">Instructions:</span>
            <p className="text-stone-600">{selectedAssignment?.instructions || 'Ensure scans/photos of your handwritten solutions are clear and legible.'}</p>
          </div>

          <div className="border-2 border-dashed border-[#E6DDCF] rounded-2xl p-8 text-center bg-[#FFFDF8] hover:border-[#173F35] transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-[#2E6B57] mx-auto mb-2" />
            <p className="text-xs font-bold text-[#173F35]">Drag & Drop PDF or Scanned Images here</p>
            <p className="text-[11px] text-stone-400 mt-1">Supports PDF, JPG, PNG (Max 15MB)</p>
            <input
              type="file"
              className="mt-3 text-xs"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedFile(e.target.files[0]);
                }
              }}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="outline" onClick={() => setSelectedAssignment(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Uploading...' : 'Confirm & Submit'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
