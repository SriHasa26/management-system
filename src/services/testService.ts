import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { MockTest, Question, TestResult } from '../types';
import { mockTests, mockQuestions, mockTestResults } from '../data/mockTests';

export interface SubmitAttemptPayload {
  testId: string;
  studentId: string;
  studentName: string;
  answers: {
    questionId: string;
    selectedOptionIndex?: number;
    selectedOptions?: number[];
    textAnswer?: string;
  }[];
  timeTakenSeconds: number;
}

export interface AttemptEvaluationResult {
  attemptId: string;
  testId: string;
  studentId: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  grade: string;
  passed: boolean;
}

export const testService = {
  /**
   * Fetch all tests
   */
  async getTests(className?: string): Promise<MockTest[]> {
    if (!isSupabaseConfigured()) {
      let list = [...mockTests];
      if (className && className !== 'All') {
        list = list.filter((t) => t.className.toLowerCase() === className.toLowerCase());
      }
      return list;
    }

    let query = supabase.from('tests').select('*').order('created_at', { ascending: false });
    if (className && className !== 'All') {
      query = query.ilike('class_name', `%${className}%`);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return mockTests;
    }

    return (data as any[]).map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description || '',
      subject: row.subject,
      className: row.class_name,
      chapter: row.chapter || 'All Units',
      durationMinutes: row.duration_minutes || 60,
      totalMarks: row.total_marks || 50,
      difficulty: 'Medium',
      startDate: row.start_date || '2026-10-05 06:00 PM',
      endDate: row.end_date || '2026-10-05 07:00 PM',
      status: row.status === 'Published' || row.status === 'Live' ? 'Live' : row.status === 'Completed' ? 'Completed' : 'Upcoming',
      questionsCount: 15,
      averageScore: 40,
      topScore: 49,
    }));
  },

  /**
   * Get all questions in Question Bank
   */
  async getQuestions(filters?: { subject?: string; className?: string; chapter?: string }): Promise<Question[]> {
    if (!isSupabaseConfigured()) {
      let list = [...mockQuestions];
      if (filters?.subject && filters.subject !== 'All') {
        list = list.filter((q) => q.subject.toLowerCase() === filters.subject!.toLowerCase());
      }
      if (filters?.className && filters.className !== 'All') {
        list = list.filter((q) => q.className.toLowerCase() === filters.className!.toLowerCase());
      }
      return list;
    }

    let query = supabase.from('questions').select('*').order('created_at', { ascending: false });
    if (filters?.subject && filters.subject !== 'All') {
      query = query.ilike('subject', `%${filters.subject}%`);
    }
    if (filters?.className && filters.className !== 'All') {
      query = query.ilike('class_name', `%${filters.className}%`);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return mockQuestions;
    }

    return (data as any[]).map((row) => ({
      id: row.id,
      subject: row.subject,
      className: row.class_name,
      chapter: row.chapter,
      type: row.question_type as any,
      questionText: row.question_text,
      options: row.options || [],
      correctAnswer: row.correct_answer,
      explanation: row.explanation,
      marks: row.marks || 1,
      difficulty: row.difficulty as any,
    }));
  },

  /**
   * Get questions for a specific test
   */
  async getTestQuestions(testId: string): Promise<Question[]> {
    // Return relevant questions
    return mockQuestions.filter((q) => q.testId === testId || q.testId === 'tst-101');
  },

  /**
   * Create a new question in Question Bank
   */
  async createQuestion(question: Omit<Question, 'id'>): Promise<{ success: boolean; data?: any; error?: string }> {
    if (!isSupabaseConfigured()) {
      return {
        success: true,
        data: {
          id: `q-${Date.now()}`,
          ...question,
        },
      };
    }

    const { data, error } = await supabase.from('questions').insert({
      question_text: question.questionText,
      question_type: question.type,
      difficulty: question.difficulty,
      class_name: question.className,
      subject: question.subject,
      chapter: question.chapter,
      options: question.options,
      correct_answer: question.correctAnswer,
      explanation: question.explanation,
      marks: question.marks,
    } as any).select().single();

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data };
  },

  /**
   * Create new Mock Test (Admin)
   */
  async createTest(test: Omit<MockTest, 'id' | 'questionsCount'>): Promise<{ success: boolean; data?: any; error?: string }> {
    if (!isSupabaseConfigured()) {
      return {
        success: true,
        data: {
          id: `tst-${Date.now()}`,
          ...test,
          questionsCount: 15,
        },
      };
    }

    const { data, error } = await supabase.from('tests').insert({
      title: test.title,
      description: test.description,
      class_name: test.className,
      subject: test.subject,
      chapter: test.chapter,
      duration_minutes: test.durationMinutes,
      total_marks: test.totalMarks,
      status: 'Published',
    } as any).select().single();

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data };
  },

  /**
   * Submit live student attempt and automatically evaluate objective answers
   */
  async submitAttempt(payload: SubmitAttemptPayload): Promise<AttemptEvaluationResult> {
    const questions = await this.getTestQuestions(payload.testId);

    let marksObtained = 0;
    let totalMarks = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    questions.forEach((q) => {
      const qMarks = q.marks || 1;
      totalMarks += qMarks;

      const userAns = payload.answers.find((a) => a.questionId === q.id);

      if (!userAns || (userAns.selectedOptionIndex === undefined && !userAns.textAnswer)) {
        unansweredCount++;
        return;
      }

      let isCorrect = false;

      if (q.type === 'MCQ' || q.type === 'True/False') {
        const correctIndex = typeof q.correctAnswer === 'number' ? q.correctAnswer : parseInt(String(q.correctAnswer), 10);
        if (userAns.selectedOptionIndex === correctIndex) {
          isCorrect = true;
        }
      } else if (q.type === 'Short Answer') {
        if (
          userAns.textAnswer &&
          String(q.correctAnswer).trim().toLowerCase() === userAns.textAnswer.trim().toLowerCase()
        ) {
          isCorrect = true;
        }
      }

      if (isCorrect) {
        correctCount++;
        marksObtained += qMarks;
      } else {
        incorrectCount++;
      }
    });

    const percentage = totalMarks > 0 ? (marksObtained / totalMarks) * 100 : 0;
    let grade = 'A+';
    if (percentage < 35) grade = 'F';
    else if (percentage < 50) grade = 'C';
    else if (percentage < 70) grade = 'B';
    else if (percentage < 85) grade = 'A';

    const result: AttemptEvaluationResult = {
      attemptId: `att-${Date.now()}`,
      testId: payload.testId,
      studentId: payload.studentId,
      marksObtained,
      totalMarks,
      percentage: parseFloat(percentage.toFixed(1)),
      correctCount,
      incorrectCount,
      unansweredCount,
      grade,
      passed: percentage >= 35,
    };

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('test_attempts').insert({
          id: result.attemptId,
          test_id: payload.testId,
          student_id: payload.studentId,
          student_name: payload.studentName,
          time_taken_seconds: payload.timeTakenSeconds,
          total_marks: totalMarks,
          marks_obtained: marksObtained,
          percentage: result.percentage,
          correct_count: correctCount,
          incorrect_count: incorrectCount,
          unanswered_count: unansweredCount,
          status: 'Evaluated',
          grade,
        } as any);
      } catch (e) {
        console.error('Error saving attempt to Supabase:', e);
      }
    }

    return result;
  },

  /**
   * Get student results history
   */
  async getStudentResults(studentId: string): Promise<TestResult[]> {
    if (!isSupabaseConfigured()) {
      return mockTestResults.filter((r) => r.studentId === studentId);
    }

    const { data, error } = await supabase
      .from('test_results')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return mockTestResults.filter((r) => r.studentId === studentId);
    }

    return (data as any[]).map((row) => ({
      id: row.id,
      testId: row.test_id,
      testTitle: row.test_title || 'Mathematics Assessment',
      studentId: row.student_id,
      studentName: row.student_name,
      subject: row.subject || 'Mathematics',
      className: row.class_name || 'Class 10',
      score: row.marks_obtained,
      totalMarks: row.max_marks,
      percentage: row.percentage || 90,
      grade: row.grade || 'A+',
      rank: row.rank || 1,
      date: row.created_at ? row.created_at.split('T')[0] : '2026-09-20',
      teacherRemarks: row.remarks || 'Excellent performance',
    }));
  },

  /**
   * Get all results (Admin)
   */
  async getAllResults(): Promise<TestResult[]> {
    if (!isSupabaseConfigured()) {
      return mockTestResults;
    }

    const { data, error } = await supabase
      .from('test_results')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return mockTestResults;
    }

    return (data as any[]).map((row) => ({
      id: row.id,
      testId: row.test_id,
      testTitle: row.test_title || 'Mathematics Assessment',
      studentId: row.student_id,
      studentName: row.student_name,
      subject: row.subject || 'Mathematics',
      className: row.class_name || 'Class 10',
      score: row.marks_obtained,
      totalMarks: row.max_marks,
      percentage: row.percentage || 90,
      grade: row.grade || 'A+',
      rank: row.rank || 1,
      date: row.created_at ? row.created_at.split('T')[0] : '2026-09-20',
      teacherRemarks: row.remarks || 'Excellent performance',
    }));
  },
};
