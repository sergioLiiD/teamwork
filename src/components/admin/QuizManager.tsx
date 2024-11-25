import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Quiz } from '../../types/quiz';
import QuizForm from './QuizForm';

interface QuizManagerProps {
  quizzes: Quiz[];
  onQuizCreate: (quiz: Omit<Quiz, 'id'>) => void;
  onQuizUpdate: (id: string, quiz: Partial<Quiz>) => void;
  onQuizDelete: (id: string) => void;
}

const QuizManager: React.FC<QuizManagerProps> = ({
  quizzes,
  onQuizCreate,
  onQuizUpdate,
  onQuizDelete,
}) => {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  const handleSubmit = (quizData: Omit<Quiz, 'id'>) => {
    if (editingQuiz) {
      onQuizUpdate(editingQuiz.id, quizData);
    } else {
      onQuizCreate(quizData);
    }
    setShowForm(false);
    setEditingQuiz(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Quiz Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          <span>Add Quiz</span>
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-md">
        <ul className="divide-y divide-gray-200">
          {quizzes.map((quiz) => (
            <li key={quiz.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {quiz.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {quiz.questions.length} questions • {quiz.passingScore}% to pass
                    {quiz.timeLimit && ` • ${quiz.timeLimit} minutes`}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => {
                      setEditingQuiz(quiz);
                      setShowForm(true);
                    }}
                    className="text-gray-400 hover:text-blue-600"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onQuizDelete(quiz.id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {showForm && (
        <QuizForm
          quiz={editingQuiz}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingQuiz(null);
          }}
        />
      )}
    </div>
  );
};

export default QuizManager;