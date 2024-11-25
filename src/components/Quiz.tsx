import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';
import type { Quiz, Question, QuizAttempt } from '../types/quiz';

interface QuizProps {
  quiz: Quiz;
  onComplete: (attempt: QuizAttempt) => void;
}

const Quiz: React.FC<QuizProps> = ({ quiz, onComplete }) => {
  const { t } = useTranslation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | boolean>>({});
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit ? quiz.timeLimit * 60 : 0);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    if (!quiz.timeLimit) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz.timeLimit]);

  const handleAnswer = (questionId: string, answer: string | boolean) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    const attempt: QuizAttempt = {
      quizId: quiz.id,
      userId: 'current-user', // TODO: Replace with actual user ID
      answers,
      completed: true,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    // Calculate score
    const correctAnswers = quiz.questions.reduce((count, question) => {
      return answers[question.id] === question.correctAnswer ? count + 1 : count;
    }, 0);

    attempt.score = (correctAnswers / quiz.questions.length) * 100;
    onComplete(attempt);
  };

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-4">
            {question.options?.map((option) => (
              <label
                key={option}
                className="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={answers[question.id] === option}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'true-false':
        return (
          <div className="flex space-x-4">
            {['true', 'false'].map((value) => (
              <label
                key={value}
                className="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="radio"
                  name={question.id}
                  value={value}
                  checked={answers[question.id] === (value === 'true')}
                  onChange={(e) => handleAnswer(question.id, e.target.value === 'true')}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-gray-700">{value}</span>
              </label>
            ))}
          </div>
        );

      case 'open-ended':
        return (
          <textarea
            value={answers[question.id] as string || ''}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder={t('quiz.typeAnswer')}
          />
        );

      default:
        return null;
    }
  };

  const question = quiz.questions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gray-50 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">{quiz.title}</h2>
          {quiz.timeLimit && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="w-5 h-5" />
              <span>
                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
              </span>
            </div>
          )}
        </div>
        <div className="mt-2 bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="p-6">
        <div className="space-y-6">
          <div className="text-lg font-medium text-gray-900">
            {currentQuestion + 1}. {question.text}
          </div>
          {renderQuestion(question)}
        </div>

        {showExplanation && question.explanation && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
              <p className="ml-2 text-blue-700">{question.explanation}</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 bg-gray-50 border-t">
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentQuestion((prev) => prev - 1)}
            disabled={currentQuestion === 0}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            {t('quiz.previous')}
          </button>
          
          {currentQuestion < quiz.questions.length - 1 ? (
            <button
              onClick={() => {
                setCurrentQuestion((prev) => prev + 1);
                setShowExplanation(false);
              }}
              disabled={!answers[question.id]}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {t('quiz.next')}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!answers[question.id]}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {t('quiz.submit')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;