import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Play, CheckCircle } from 'lucide-react';
import Quiz from '../components/Quiz';
import type { Quiz as QuizType, QuizAttempt } from '../types/quiz';

// Mock data - Replace with actual data from your backend
const MOCK_QUIZZES: QuizType[] = [
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

const Quizzes: React.FC = () => {
  const { t } = useTranslation();
  const [selectedQuiz, setSelectedQuiz] = useState<QuizType | null>(null);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);

  const handleQuizComplete = (attempt: QuizAttempt) => {
    setAttempts([...attempts, attempt]);
    setSelectedQuiz(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{t('quizzes.title')}</h1>

      {selectedQuiz ? (
        <Quiz quiz={selectedQuiz} onComplete={handleQuizComplete} />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {MOCK_QUIZZES.map((quiz) => {
            const attempt = attempts.find(a => a.quizId === quiz.id);
            const isPassed = attempt?.score && attempt.score >= quiz.passingScore;

            return (
              <div
                key={quiz.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {quiz.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {quiz.description}
                    </p>
                  </div>
                  {attempt && (
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                      isPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {attempt.score}%
                    </span>
                  )}
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    {quiz.questions.length} questions • {quiz.timeLimit} minutes
                  </p>
                  <p className="text-sm text-gray-600">
                    Passing score: {quiz.passingScore}%
                  </p>
                </div>

                <button
                  onClick={() => setSelectedQuiz(quiz)}
                  className={`mt-4 flex items-center justify-center w-full px-4 py-2 rounded-md text-sm font-medium ${
                    attempt
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {attempt ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {t('quizzes.completed')}
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      {t('quizzes.start')}
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Quizzes;