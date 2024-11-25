import React from 'react';
import { Plus, X } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizSectionProps {
  questions: Question[];
  onChange: (questions: Question[]) => void;
}

const QuizSection: React.FC<QuizSectionProps> = ({ questions, onChange }) => {
  const addQuestion = () => {
    onChange([...questions, { question: '', options: ['', ''], correctAnswer: '' }]);
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], ...updates };
    onChange(newQuestions);
  };

  const addOption = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push('');
    onChange(newQuestions);
  };

  const removeQuestion = (index: number) => {
    onChange(questions.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {questions.map((question, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-4">
          <div className="flex justify-between">
            <h4 className="text-sm font-medium text-gray-900">Question {index + 1}</h4>
            <button
              type="button"
              onClick={() => removeQuestion(index)}
              className="text-gray-400 hover:text-red-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div>
            <input
              type="text"
              value={question.question}
              onChange={(e) => updateQuestion(index, { question: e.target.value })}
              placeholder="Enter question"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Options</label>
            {question.options.map((option, optionIndex) => (
              <input
                key={optionIndex}
                type="text"
                value={option}
                onChange={(e) => {
                  const newOptions = [...question.options];
                  newOptions[optionIndex] = e.target.value;
                  updateQuestion(index, { options: newOptions });
                }}
                placeholder={`Option ${optionIndex + 1}`}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            ))}
            <button
              type="button"
              onClick={() => addOption(index)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Add Option
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Correct Answer
            </label>
            <select
              value={question.correctAnswer}
              onChange={(e) => updateQuestion(index, { correctAnswer: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Select correct answer</option>
              {question.options.map((option, i) => (
                <option key={i} value={option}>
                  {option || `Option ${i + 1}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addQuestion}
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
      >
        <Plus className="h-5 w-5" />
        <span>Add Question</span>
      </button>
    </div>
  );
};

export default QuizSection;