import React, { useState } from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { Card } from '../common/Card';
import { Input, Select } from '../common/Input';
import { Button } from '../common/Button';
import { useToast } from '../../hooks/useToast';
import { Sparkles, Send, CheckCircle2, Shield } from 'lucide-react';

export const EnquirySection: React.FC = () => {
  const { success } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    phone: '',
    grade: 'Class 10',
    board: 'CBSE',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      success(
        'Enquiry Received!',
        'Thank you! Our academic counselor will reach out to you within 24 hours with the course brochure.'
      );
    }, 800);
  };

  const gradeOptions = [
    { label: 'Early Learning (LKG / UKG)', value: 'LKG/UKG' },
    { label: 'Primary (Classes 1 – 5)', value: 'Classes 1-5' },
    { label: 'Middle School (Classes 6 – 8)', value: 'Classes 6-8' },
    { label: 'Class 9', value: 'Class 9' },
    { label: 'Class 10 (Board Batch)', value: 'Class 10' },
    { label: 'Intermediate 1st Year (MPC / BiPC / MEC)', value: 'Intermediate 1st Year' },
    { label: 'Intermediate 2nd Year (MPC / BiPC / MEC)', value: 'Intermediate 2nd Year' },
  ];

  const boardOptions = [
    { label: 'CBSE Curriculum', value: 'CBSE' },
    { label: 'State Board (SSC / BIE)', value: 'State Board' },
    { label: 'ICSE Board', value: 'ICSE' },
  ];

  return (
    <section id="admissions" className="py-20 md:py-28 bg-[#FFFDF8] border-y border-[#EDE6D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Admissions 2026-27"
          badgeVariant="terracotta"
          title="Begin Your Academic Journey With Us"
          subtitle="Reserve a seat or schedule a free diagnostic consultation with our senior educators."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto text-left">
          {/* Form Card */}
          <Card variant="paper" className="lg:col-span-7 p-8 sm:p-10 border-[#EDE6D8] shadow-elevated">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F0F5F3] text-[#2E6B57] flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-serif font-bold text-[#173F35]">
                  Enquiry Submitted Successfully
                </h4>
                <p className="text-sm text-stone-600 max-w-md mx-auto">
                  Thank you, <strong>{formData.parentName || 'Parent'}</strong>. We have logged your enquiry for{' '}
                  <strong>{formData.studentName || 'your child'}</strong> ({formData.grade} - {formData.board}).
                </p>
                <div className="pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        studentName: '',
                        parentName: '',
                        phone: '',
                        grade: 'Class 10',
                        board: 'CBSE',
                        message: '',
                      });
                    }}
                  >
                    Submit Another Enquiry
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Student Full Name *"
                    placeholder="e.g. Rahul Sharma"
                    required
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  />
                  <Input
                    label="Parent / Guardian Name *"
                    placeholder="e.g. Sunita Sharma"
                    required
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Mobile / WhatsApp Number *"
                    placeholder="+91 98480 00000"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <Select
                    label="Curriculum Board *"
                    options={boardOptions}
                    value={formData.board}
                    onChange={(e) => setFormData({ ...formData, board: e.target.value })}
                  />
                </div>

                <Select
                  label="Grade / Class Applying For *"
                  options={gradeOptions}
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#202522] uppercase tracking-wider">
                    Specific Learning Goals / Focus Subjects (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Needs specialized guidance in Class 10 Math & Physics numericals..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-xl border border-[#E6DDCF] bg-[#FFFDF8] p-3 text-sm text-[#202522] focus:border-[#173F35] focus:outline-none focus:ring-2 focus:ring-[#173F35]/15"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    isLoading={isSubmitting}
                    iconRight={<Send className="w-4 h-4" />}
                  >
                    Request Admission Information
                  </Button>
                </div>
              </form>
            )}
          </Card>

          {/* Side Info Box */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#173F35] to-[#2E6B57] rounded-3xl p-8 text-[#FFFDF8] flex flex-col justify-between border-2 border-[#C99A3D]/40 shadow-card">
            <div className="space-y-5">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C99A3D] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Why Enrol Now?
              </span>

              <h3 className="text-2xl font-serif font-bold text-white leading-snug">
                Strict batch limits ensure personal attention.
              </h3>

              <div className="space-y-3 text-xs text-stone-200">
                <div className="p-3 rounded-xl bg-[#0E2822]/70 border border-[#2E6B57]">
                  <strong className="text-white block mb-0.5">1. Free Diagnostic Session</strong>
                  We identify specific foundational learning gaps before placing students in suitable cohorts.
                </div>

                <div className="p-3 rounded-xl bg-[#0E2822]/70 border border-[#2E6B57]">
                  <strong className="text-white block mb-0.5">2. Flexible Morning/Evening Slots</strong>
                  Aligned smoothly with school timings for uninterrupted study habits.
                </div>

                <div className="p-3 rounded-xl bg-[#0E2822]/70 border border-[#2E6B57]">
                  <strong className="text-white block mb-0.5">3. Complete Study Kit Included</strong>
                  Handcrafted chapter workbooks, formula cards, and mock papers provided on admission.
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#2E6B57] flex items-center gap-2 text-xs text-stone-300">
              <Shield className="w-4 h-4 text-[#C99A3D]" />
              <span>Zero-spam guarantee • Direct educator response</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
