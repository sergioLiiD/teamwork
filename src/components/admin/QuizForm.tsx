import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Quiz, Question } from '../../types/quiz';

interface QuizFormProps {
  quiz?: Quiz | null;
  onSubmit: (quiz: Omit<Quiz, 'id'>) => void;
  onCancel: () => void;
}

const QuizForm: React.FC<QuizFormProps> = ({ quiz, onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Omit<Quiz, 'id'>>({
    title: quiz?.title || '',
    description: quiz?.description || '',
    questions: quiz?.questions || [],
    passingScore: quiz?.passingScore || 70,
    timeLimit: quiz?.timeLimit || 30,
  });

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          id: `q${formData.questions.length + 1}`,
          type: 'multiple-choice',
          text: '',
          options: ['', ''],
          correctAnswer: '',
        },
      ],
    });
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    const newQuestions = [...formData.questions];
    newQuestions[index] = { ...newQuestions[index], ...updates };
    setFormData({ ...formData, questions: newQuestions });
  };

  const removeQuestion = (index: number) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-4xl rounded-lg bg-white shadow-xl">
          <div className="flex items-center justify-between border-b p-4">
            <h3 className="text-lg font-semibold">
              {quiz ? 'Edit Quiz' : 'Create New Quiz'}
            </h3>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Passing Score (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.passingScore}
                  onChange={(e) => setFormData({ ...formData, passingScore: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Time Limit (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.timeLimit}
                  onChange={(e) => setFormData({ ...formData, timeLimit: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-medium">Questions</h4>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="flex items-center space-x-2 px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Question</span>
                </button>
              </div>

              {formData.questions.map((question, index) => (
                <div key={question.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Question Text
                        </label>
                        <input
                          type="text"
                          value={question.text}
                          onChange={(e) => updateQuestion(index, { text: e.target.value })}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Question Type
                        </label>
                        <select
                          value={question.type}
                          onChange={(e) => updateQuestion(index, { type: e.target.value as Question['type'] })}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                        >
                          <option value="multiple-choice">Multiple Choice</option>
                          <option value="true-false">True/False</option>
                          <option value="open-ended">Open Ended</option>
                        </select>
                      </div>

                      {question.type === 'multiple-choice' && (
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Options
                          </label>
                          {question.options?.map((option, optionIndex) => (
                            <input
                              key={optionIndex}
                              type="text"
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...(question.options || [])];
                                newOptions[optionIndex] = e.target.value;
                                updateQuestion(index, { options: newOptions });
                              }}
                              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                              placeholder={`Option ${optionIndex + 1}`}
                              required
                            />
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const newOptions = [...(question.options || []), ''];
                              updateQuestion(index, { options: newOptions });
                            }}
                            className="text-sm text-blue-600 hover:text-blue-700"
                          >
                            Add Option
                          </button>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Correct Answer
                        </label>
                        {question.type === 'true-false' ? (
                          <select
                            value={String(question.correctAnswer)}
                            onChange={(e) => updateQuestion(index, { correctAnswer: e.target.value === 'true' })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                            required
                          >
                            <option value="true">True</option>
                            <option value="false">False</option>
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={question.correctAnswer as string}
                            onChange={(e) => updateQuestion(index, { correctAnswer: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                            required
                          />
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Explanation (Optional)
                        </label>
                        <textarea
                          value={question.explanation}
                          onChange={(e) => updateQuestion(index, { explanation: e.target.value })}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                          rows={2}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="ml-4 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                {quiz ? 'Update Quiz' : 'Create Quiz'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuizForm;