import React from 'react';
import { MockTest } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Clock, HelpCircle, Award, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export const TestCard: React.FC<{ test: MockTest; onStart?: () => void }> = ({ test, onStart }) => {
  const { info } = useToast();

  const handleStart = () => {
    if (onStart) {
      onStart();
    } else {
      info(`Test Simulation`, `Starting ${test.title} (Duration: ${test.durationMinutes} mins)`);
    }
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'easy':
        return <Badge variant="sage" size="sm">Easy</Badge>;
      case 'medium':
        return <Badge variant="gold" size="sm">Medium</Badge>;
      case 'hard':
        return <Badge variant="terracotta" size="sm">Hard</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card variant="paper" hoverEffect className="flex flex-col justify-between p-6 border-[#EDE6D8] h-full text-left">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant="forest" size="sm" className="font-bold">
            {test.subject}
          </Badge>
          <div className="flex items-center gap-1.5">
            {getDifficultyBadge(test.difficulty)}
            <Badge
              variant={test.status === 'Live' ? 'terracotta' : test.status === 'Completed' ? 'sage' : 'neutral'}
              size="sm"
            >
              {test.status}
            </Badge>
          </div>
        </div>

        <h4 className="text-base font-bold text-[#173F35] leading-snug">{test.title}</h4>
        <p className="text-xs text-[#B85C45] font-semibold mt-1">{test.chapter}</p>
        <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">{test.description}</p>

        <div className="grid grid-cols-3 gap-2 mt-5 p-3 rounded-xl bg-[#F7F3EA] border border-[#E6DDCF] text-center">
          <div>
            <div className="flex items-center justify-center gap-1 text-[10px] text-stone-500">
              <Clock className="w-3 h-3 text-[#2E6B57]" /> Duration
            </div>
            <p className="text-xs font-bold text-[#173F35] mt-0.5">{test.durationMinutes}m</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-[10px] text-stone-500">
              <Award className="w-3 h-3 text-[#C99A3D]" /> Marks
            </div>
            <p className="text-xs font-bold text-[#173F35] mt-0.5">{test.totalMarks}</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-[10px] text-stone-500">
              <HelpCircle className="w-3 h-3 text-[#B85C45]" /> Qs
            </div>
            <p className="text-xs font-bold text-[#173F35] mt-0.5">{test.questionsCount}</p>
          </div>
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-[#EDE6D8] flex items-center justify-between">
        <span className="text-[11px] text-stone-500">
          Scheduled: <span className="font-semibold text-stone-700">{test.startDate.split(' ')[0]}</span>
        </span>

        {test.status === 'Completed' ? (
          <Button size="sm" variant="outline" icon={<CheckCircle2 className="w-3.5 h-3.5 text-[#2E6B57]" />}>
            View Analysis
          </Button>
        ) : (
          <Button size="sm" variant="primary" iconRight={<ArrowRight className="w-3.5 h-3.5" />} onClick={handleStart}>
            Attempt Test
          </Button>
        )}
      </div>
    </Card>
  );
};
