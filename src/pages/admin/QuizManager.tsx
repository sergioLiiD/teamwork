import React from 'react';
import QuizManager from '../../components/admin/QuizManager';
import type { Quiz } from '../../types/quiz';

// Mock data - Replace with actual data from your backend
const mockQuizzes: Quiz[] = [
  {
    id: '1',
    title: 'Real Estate Basics',
    description: 'Test your knowledge of fundamental real estate concepts',
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        text: 'What is a mortgage?',
        options: [
          'A type of house',
          'A loan to purchase property',
          'A real estate agent',
          'A property tax'
        ],
        correctAnswer: 'A loan to purchase property',
        explanation: 'A mortgage is a loan used to purchase real estate property.',
      },
    ],
    passingScore: 70,
    timeLimit: 30,
  },
];

const QuizManagerPage: React.FC = () => {
  const handleQuizCreate = (quiz: Omit<Quiz, 'id'>) => {
    // Implement quiz creation logic
    console.log('Creating quiz:', quiz);
  };

  const handleQuizUpdate = (id: string, quiz: Partial<Quiz>) => {
    // Implement quiz update logic
    console.log('Updating quiz:', id, quiz);
  };

  const handleQuizDelete = (id: string) => {
    // Implement quiz deletion logic
    console.log('Deleting quiz:', id);
  };

  return (
    <QuizManager
      quizzes={mockQuizzes}
      onQuizCreate={handleQuizCreate}
      onQuizUpdate={handleQuizUpdate}
      onQuizDelete={handleQuizDelete}
    />
  );
};

export default QuizManagerPage;