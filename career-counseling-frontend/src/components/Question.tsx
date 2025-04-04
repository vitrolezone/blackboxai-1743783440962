import React from 'react';
import { Question as QuestionType } from '../types';

interface QuestionProps {
  question: QuestionType;
  onSelect: (optionId: number) => void;
  currentAnswer?: number;
}

export default function Question({ 
  question, 
  onSelect,
  currentAnswer 
}: QuestionProps) {
  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-800 mb-4">{question.text}</h3>
      <div className="space-y-3">
        {question.options.map(option => (
          <div 
            key={option.id} 
            className={`p-3 border rounded-lg cursor-pointer transition
              ${currentAnswer === option.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'}`}
            onClick={() => onSelect(option.id)}
          >
            {option.text}
          </div>
        ))}
      </div>
    </div>
  );
}