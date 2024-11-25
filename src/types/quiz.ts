export type QuestionType = 'multiple-choice' | 'true-false' | 'open-ended';

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
  correctAnswer?: string | boolean;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  passingScore: number;
  timeLimit?: number; // in minutes
}

export interface QuizAttempt {
  quizId: string;
  userId: string;
  answers: Record<string, string | boolean>;
  score?: number;
  completed: boolean;
  startedAt: string;
  completedAt?: string;
}