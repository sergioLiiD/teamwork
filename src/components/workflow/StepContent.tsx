import React, { useState } from 'react';
import { FileText, Video, CheckSquare, AlertCircle } from 'lucide-react';

interface Step {
  content: {
    text?: string;
    documents?: string[];
    videoUrl?: string;
    quiz?: {
      questions: Array<{
        question: string;
        options: string[];
        correctAnswer: string;
      }>;
    };
    todos?: Array<{
      text: string;
      required: boolean;
      completed?: boolean;
    }>;
  };
}

interface StepContentProps {
  step: Step;
  onComplete: () => void;
}

const StepContent: React.FC<StepContentProps> = ({ step, onComplete }) => {
  const [todos, setTodos] = useState(step.content.todos || []);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  const handleTodoToggle = (index: number) => {
    const newTodos = [...todos];
    newTodos[index] = {
      ...newTodos[index],
      completed: !newTodos[index].completed
    };
    setTodos(newTodos);
  };

  const handleQuizSubmit = () => {
    const questions = step.content.quiz?.questions || [];
    const correctAnswers = questions.reduce((count, q, index) => {
      return quizAnswers[index] === q.correctAnswer ? count + 1 : count;
    }, 0);
    setShowQuizResults(true);
  };

  const isStepCompletable = () => {
    const allRequiredTodosCompleted = todos.every(
      todo => !todo.required || todo.completed
    );
    
    if (step.content.quiz) {
      return allRequiredTodosCompleted && showQuizResults;
    }
    
    return allRequiredTodosCompleted;
  };

  return (
    <div className="space-y-6">
      {step.content.text && (
        <div className="prose max-w-none">
          {step.content.text}
        </div>
      )}

      {step.content.documents && step.content.documents.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Documents</h4>
          <div className="space-y-2">
            {step.content.documents.map((doc, index) => (
              <a
                key={index}
                href="#"
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
              >
                <FileText className="w-4 h-4" />
                <span>{doc}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {step.content.videoUrl && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Video</h4>
          <div className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
            <Video className="w-4 h-4" />
            <a href={step.content.videoUrl} target="_blank" rel="noopener noreferrer">
              Watch Video
            </a>
          </div>
        </div>
      )}

      {todos.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Tasks</h4>
          <div className="space-y-2">
            {todos.map((todo, index) => (
              <label
                key={index}
                className="flex items-start space-x-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleTodoToggle(index)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">
                  {todo.text}
                  {todo.required && (
                    <span className="ml-2 text-xs text-red-500">*Required</span>
                  )}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {step.content.quiz && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Quiz</h4>
          {step.content.quiz.questions.map((q, qIndex) => (
            <div key={qIndex} className="space-y-2">
              <p className="text-gray-900">{q.question}</p>
              <div className="space-y-2">
                {q.options.map((option, oIndex) => (
                  <label
                    key={oIndex}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`question-${qIndex}`}
                      value={option}
                      checked={quizAnswers[qIndex] === option}
                      onChange={() => {
                        setQuizAnswers({
                          ...quizAnswers,
                          [qIndex]: option
                        });
                      }}
                      disabled={showQuizResults}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
              {showQuizResults && (
                <div className={`flex items-center space-x-2 text-sm ${
                  quizAnswers[qIndex] === q.correctAnswer
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {quizAnswers[qIndex] === q.correctAnswer ? (
                    <CheckSquare className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  <span>
                    {quizAnswers[qIndex] === q.correctAnswer
                      ? 'Correct!'
                      : `Incorrect. The correct answer is: ${q.correctAnswer}`}
                  </span>
                </div>
              )}
            </div>
          ))}
          {!showQuizResults && (
            <button
              onClick={handleQuizSubmit}
              disabled={Object.keys(quizAnswers).length !== step.content.quiz.questions.length}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Submit Quiz
            </button>
          )}
        </div>
      )}

      {isStepCompletable() && (
        <button
          onClick={onComplete}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Complete Step
        </button>
      )}
    </div>
  );
};

export default StepContent;