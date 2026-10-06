import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { testService, AttemptEvaluationResult } from '../../services/testService';
import { MockTest, Question } from '../../types';
import { mockTests, mockQuestions } from '../../data/mockTests';
import { TestCard } from '../../components/cards/TestCard';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../hooks/useToast';
import { Clock, HelpCircle, CheckCircle2, Award, AlertCircle, XCircle } from 'lucide-react';

export const StudentTestsPage: React.FC = () => {
  const { success, info } = useToast();
  const { currentStudent } = useAuth();
  const [tests, setTests] = useState<MockTest[]>(mockTests);
  const [activeTest, setActiveTest] = useState<MockTest | null>(null);
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, { selectedOptionIndex?: number; textAnswer?: string }>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [evaluationResult, setEvaluationResult] = useState<AttemptEvaluationResult | null>(null);
  const [testCompleted, setTestCompleted] = useState(false);

  useEffect(() => {
    async function loadTests() {
      try {
        const data = await testService.getTests(currentStudent.grade);
        if (data && data.length > 0) setTests(data);
      } catch (err) {
        console.error('Error loading tests:', err);
      }
    }
    loadTests();
  }, [currentStudent]);

  // Countdown timer effect
  useEffect(() => {
    if (!activeTest || testCompleted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTest, testCompleted, timeLeft]);

  const handleStartTest = async (test: MockTest) => {
    setActiveTest(test);
    setSelectedAnswers({});
    setTestCompleted(false);
    setEvaluationResult(null);
    setTimeLeft((test.durationMinutes || 45) * 60);

    const testQ = await testService.getTestQuestions(test.id);
    setQuestions(testQ.length > 0 ? testQ : mockQuestions);
  };

  const handleSelectOption = (qId: string, optIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [qId]: { ...prev[qId], selectedOptionIndex: optIdx },
    }));
  };

  const handleTextAnswer = (qId: string, text: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [qId]: { ...prev[qId], textAnswer: text },
    }));
  };

  const handleAutoSubmit = async () => {
    info('Time Expired', 'Test time reached zero. Submitting your examination automatically.');
    await handleSubmitTest();
  };

  const handleSubmitTest = async () => {
    if (!activeTest) return;

    const answersArray = Object.entries(selectedAnswers).map(([qId, ans]) => ({
      questionId: qId,
      selectedOptionIndex: ans.selectedOptionIndex,
      textAnswer: ans.textAnswer,
    }));

    const timeTaken = (activeTest.durationMinutes * 60) - timeLeft;

    const result = await testService.submitAttempt({
      testId: activeTest.id,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      answers: answersArray,
      timeTakenSeconds: Math.max(1, timeTaken),
    });

    setEvaluationResult(result);
    setTestCompleted(true);
    success('Examination Evaluated', `You scored ${result.marksObtained}/${result.totalMarks} (${result.percentage}%).`);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#173F35]">Mock Assessments & Unit Tests</h2>
        <p className="text-xs text-stone-500">
          Simulate board examinations, chapter review checkpoints, and track your time management.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((test) => (
          <TestCard key={test.id} test={test} onStart={() => handleStartTest(test)} />
        ))}
      </div>

      {/* Interactive Mock Test Simulator Modal */}
      <Modal
        isOpen={!!activeTest}
        onClose={() => setActiveTest(null)}
        title={activeTest?.title || 'Examination In Progress'}
        subtitle={`Total Duration: ${activeTest?.durationMinutes} mins • Subject: ${activeTest?.subject}`}
        maxWidth="2xl"
      >
        {testCompleted && evaluationResult ? (
          <div className="py-6 text-center space-y-6">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                evaluationResult.passed ? 'bg-[#F0F5F3] text-[#2E6B57]' : 'bg-[#FAF2F0] text-[#B85C45]'
              }`}
            >
              {evaluationResult.passed ? <CheckCircle2 className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
            </div>

            <div>
              <h4 className="text-2xl font-serif font-bold text-[#173F35]">
                {evaluationResult.passed ? 'Assessment Completed!' : 'Assessment Evaluated'}
              </h4>
              <p className="text-xs text-stone-600 mt-1">
                Your examination responses have been evaluated and recorded.
              </p>
            </div>

            {/* Score Summary Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
              <div className="p-3 rounded-2xl bg-[#FAF6EE] border border-[#E6D3AC] text-center">
                <span className="text-[11px] text-stone-500 font-bold block">Score</span>
                <span className="text-lg font-serif font-black text-[#7F5C1B]">
                  {evaluationResult.marksObtained} / {evaluationResult.totalMarks}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#F0F5F3] border border-[#2E6B57]/20 text-center">
                <span className="text-[11px] text-stone-500 font-bold block">Percentage</span>
                <span className="text-lg font-serif font-black text-[#2E6B57]">
                  {evaluationResult.percentage}%
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-[#EDE6D8] text-center">
                <span className="text-[11px] text-stone-500 font-bold block">Grade</span>
                <span className="text-lg font-serif font-black text-[#173F35]">
                  {evaluationResult.grade}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-[#EDE6D8] text-center">
                <span className="text-[11px] text-stone-500 font-bold block">Correct</span>
                <span className="text-lg font-serif font-black text-[#2E6B57]">
                  {evaluationResult.correctCount} / {questions.length}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Button variant="primary" onClick={() => setActiveTest(null)}>
                Return to Test Centre
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF6EE] border border-[#E6D3AC] text-xs">
              <span className={`font-bold flex items-center gap-1.5 ${timeLeft < 180 ? 'text-red-600 animate-pulse' : 'text-[#7F5C1B]'}`}>
                <Clock className="w-4 h-4 text-[#C99A3D]" /> Time Remaining: {formatTimer(timeLeft)}
              </span>
              <span className="text-stone-600 font-medium">
                Answered: {Object.keys(selectedAnswers).length} / {questions.length}
              </span>
            </div>

            {/* Questions list */}
            <div className="space-y-6 divide-y divide-stone-200 max-h-[50vh] overflow-y-auto pr-2">
              {questions.map((q, idx) => (
                <div key={q.id} className="pt-4 first:pt-0 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-[#B85C45] bg-[#FAF2F0] px-2 py-0.5 rounded">
                      Question {idx + 1} ({q.marks} Mark{q.marks > 1 ? 's' : ''})
                    </span>
                    <Badge variant="neutral" size="sm">
                      {q.type}
                    </Badge>
                  </div>

                  <p className="text-sm font-semibold text-[#173F35]">{q.questionText}</p>

                  {/* MCQ Options */}
                  {q.options && q.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = selectedAnswers[q.id]?.selectedOptionIndex === optIdx;
                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSelectOption(q.id, optIdx)}
                            className={`p-3 rounded-xl text-xs font-medium text-left border transition-all ${
                              isSelected
                                ? 'bg-[#173F35] text-white border-[#173F35] shadow-sm'
                                : 'bg-[#FFFDF8] text-stone-700 border-[#EDE6D8] hover:bg-[#F7F3EA]'
                            }`}
                          >
                            <span className="font-bold mr-2 font-mono">
                              {String.fromCharCode(65 + optIdx)}.
                            </span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Short answer input */}
                  {(!q.options || q.options.length === 0) && (
                    <input
                      type="text"
                      placeholder="Type your final calculated answer..."
                      value={selectedAnswers[q.id]?.textAnswer || ''}
                      onChange={(e) => handleTextAnswer(q.id, e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#E6DDCF] bg-[#FFFDF8] text-xs text-[#202522] focus:outline-none focus:border-[#173F35]"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-stone-200">
              <Button variant="outline" onClick={() => setActiveTest(null)}>
                Save Draft & Exit
              </Button>
              <Button variant="primary" onClick={handleSubmitTest}>
                Submit Final Test
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
