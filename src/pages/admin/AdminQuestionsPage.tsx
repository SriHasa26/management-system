import React, { useState } from 'react';
import { mockQuestions } from '../../data/mockTests';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Plus, HelpCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export const AdminQuestionsPage: React.FC = () => {
  const { success } = useToast();
  const [questions, setQuestions] = useState(mockQuestions);

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#173F35]">Central Question Bank</h2>
          <p className="text-xs text-stone-500">
            Categorized database of MCQs, short answers, and previous-year board questions.
          </p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => success('Question Bank', 'Question authoring tool ready.')}>
          Add Question to Bank
        </Button>
      </div>

      <div className="space-y-4">
        {questions.map((q, idx) => (
          <Card key={q.id} variant="paper" className="p-6 border-[#EDE6D8] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#B85C45] bg-[#FAF2F0] px-2 py-0.5 rounded">
                  Q-{idx + 1}
                </span>
                <Badge variant="forest" size="sm">{q.subject}</Badge>
                <Badge variant="neutral" size="sm">{q.type}</Badge>
                <span className="text-xs text-stone-500">Marks: {q.marks}</span>
              </div>
              <Badge variant={q.difficulty === 'Hard' ? 'terracotta' : 'gold'} size="sm">
                {q.difficulty}
              </Badge>
            </div>

            <p className="text-sm font-semibold text-[#173F35]">{q.questionText}</p>

            {q.options && q.options.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {q.options.map((opt, optIdx) => (
                  <div
                    key={optIdx}
                    className={`p-2.5 rounded-xl border ${
                      q.correctAnswer === optIdx
                        ? 'bg-[#F0F5F3] border-[#2E6B57] text-[#173F35] font-bold'
                        : 'bg-[#FFFDF8] border-[#EDE6D8] text-stone-700'
                    }`}
                  >
                    <span className="font-mono mr-1.5">{String.fromCharCode(65 + optIdx)}.</span>
                    <span>{opt}</span>
                    {q.correctAnswer === optIdx && (
                      <span className="ml-2 text-[#2E6B57] font-bold text-[10px]">(Correct Answer)</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {q.explanation && (
              <p className="text-xs text-stone-600 bg-[#F7F3EA] p-3 rounded-xl border border-[#E6DDCF]">
                <strong>Faculty Solution:</strong> {q.explanation}
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export const AdminResultsPage: React.FC = () => {
  const { success } = useToast();

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#173F35]">Result Management & Moderation</h2>
          <p className="text-xs text-stone-500">
            Publish assessment scorecards, assign ranks, and approve teacher remarks.
          </p>
        </div>
        <Button variant="primary" onClick={() => success('Results Published', 'Approved scores published to all student & parent portals.')}>
          Publish Pending Scores
        </Button>
      </div>

      <Card variant="paper" className="p-6 border-[#EDE6D8]">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#EDE6D8] text-stone-400 font-bold uppercase">
                <th className="pb-3">Student</th>
                <th className="pb-3">Test Title</th>
                <th className="pb-3">Score / Max</th>
                <th className="pb-3">Percentage</th>
                <th className="pb-3">Grade</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE6D8]">
              <tr className="hover:bg-[#F7F3EA]/50">
                <td className="py-3 font-bold text-[#173F35]">Rahul Sharma (SRI-2026-001)</td>
                <td className="py-3">Chemistry Periodic Test</td>
                <td className="py-3 font-bold">46 / 50</td>
                <td className="py-3 text-[#2E6B57] font-bold">92.0%</td>
                <td className="py-3"><Badge variant="forest" size="sm">A1</Badge></td>
                <td className="py-3 text-right">
                  <span className="text-emerald-700 font-bold">Published</span>
                </td>
              </tr>
              <tr className="hover:bg-[#F7F3EA]/50">
                <td className="py-3 font-bold text-[#173F35]">Ananya Reddy (SRI-2026-002)</td>
                <td className="py-3">Chemistry Periodic Test</td>
                <td className="py-3 font-bold">49 / 50</td>
                <td className="py-3 text-[#2E6B57] font-bold">98.0%</td>
                <td className="py-3"><Badge variant="gold" size="sm">A1 Rank #1</Badge></td>
                <td className="py-3 text-right">
                  <span className="text-emerald-700 font-bold">Published</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
