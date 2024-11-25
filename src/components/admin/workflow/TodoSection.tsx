import React from 'react';
import { Plus, X } from 'lucide-react';

interface Todo {
  text: string;
  required: boolean;
}

interface TodoSectionProps {
  todos: Todo[];
  onChange: (todos: Todo[]) => void;
}

const TodoSection: React.FC<TodoSectionProps> = ({ todos, onChange }) => {
  const addTodo = () => {
    onChange([...todos, { text: '', required: false }]);
  };

  const updateTodo = (index: number, updates: Partial<Todo>) => {
    const newTodos = [...todos];
    newTodos[index] = { ...newTodos[index], ...updates };
    onChange(newTodos);
  };

  const removeTodo = (index: number) => {
    onChange(todos.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {todos.map((todo, index) => (
        <div key={index} className="flex items-center space-x-4">
          <input
            type="text"
            value={todo.text}
            onChange={(e) => updateTodo(index, { text: e.target.value })}
            placeholder="Enter todo item"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={todo.required}
              onChange={(e) => updateTodo(index, { required: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">Required</span>
          </label>
          <button
            type="button"
            onClick={() => removeTodo(index)}
            className="text-gray-400 hover:text-red-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addTodo}
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
      >
        <Plus className="h-5 w-5" />
        <span>Add Todo Item</span>
      </button>
    </div>
  );
};

export default TodoSection;