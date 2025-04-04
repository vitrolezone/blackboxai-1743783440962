import React from 'react';
import { useNavigate } from 'react-router-dom';
import Question from '../components/Question';
import { Question as QuestionType } from '../types';

export default function TestPage() {
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<number, number>>({});
  const navigate = useNavigate();

  // TODO: Fetch questions from API
  const questions: QuestionType[] = [];

  const handleAnswer = (questionId: number, optionId: number) => {
    setAnswers(prev => ({...prev, [questionId]: optionId}));
  };

  const handleSubmit = () => {
    // TODO: Submit answers to API
    navigate('/results', { 
      state: { recommendations: [] } // Will be populated from API response
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-8">Career Aptitude Test</h1>
      
      {questions.length > 0 && (
        <Question 
          question={questions[currentQuestion]} 
          onSelect={(optionId) => handleAnswer(questions[currentQuestion].id, optionId)}
          currentAnswer={answers[questions[currentQuestion].id]}
        />
      )}

      <div className="mt-8 flex justify-between">
        <button 
          className="px-4 py-2 bg-gray-200 rounded-lg"
          disabled={currentQuestion === 0}
          onClick={() => setCurrentQuestion(prev => prev - 1)}
        >
          Previous
        </button>
        
        {currentQuestion < questions.length - 1 ? (
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={() => setCurrentQuestion(prev => prev + 1)}
          >
            Next
          </button>
        ) : (
          <button 
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
            onClick={handleSubmit}
          >
            Submit Test
          </button>
        )}
      </div>
    </div>
  );
}