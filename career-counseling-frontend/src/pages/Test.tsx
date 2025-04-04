import React from 'react';
import { useNavigate } from 'react-router-dom';
import Question from '../components/Question';
import { Question as QuestionType } from '../types';
import { getQuestions, submitTest } from '../services/api';

export default function TestPage() {
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<number, number>>({});
  const [questions, setQuestions] = React.useState<QuestionType[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getQuestions();
        setQuestions(data);
      } catch (err) {
        setError('Failed to load questions. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleAnswer = (questionId: number, optionId: number) => {
    setAnswers(prev => ({...prev, [questionId]: optionId}));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      // TODO: Submit answers to API
      navigate('/results', { 
        state: { recommendations: [] } // Will be populated from API response
      });
    } catch (err) {
      setError('Failed to submit test. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const progress = questions.length > 0 
    ? Math.round(((currentQuestion + 1) / questions.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Career Aptitude Test</h1>
          <div className="text-gray-600 font-medium">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>{error}</p>
          </div>
        ) : questions.length > 0 ? (
          <>
            <Question 
              question={questions[currentQuestion]} 
              onSelect={(optionId) => handleAnswer(questions[currentQuestion].id, optionId)}
              currentAnswer={answers[questions[currentQuestion].id]}
            />

            <div className="mt-8 flex justify-between">
              <button 
                className={`px-6 py-3 rounded-lg font-medium transition-all ${currentQuestion === 0 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                disabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion(prev => prev - 1)}
              >
                ← Previous
              </button>
              
              {currentQuestion < questions.length - 1 ? (
                <button 
                  className={`px-6 py-3 rounded-lg font-medium text-white transition-all ${answers[questions[currentQuestion].id] 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-blue-400 cursor-not-allowed'}`}
                  disabled={!answers[questions[currentQuestion].id]}
                  onClick={() => setCurrentQuestion(prev => prev + 1)}
                >
                  Next →
                </button>
              ) : (
                <button 
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all"
                  onClick={handleSubmit}
                >
                  {isLoading ? 'Submitting...' : 'Submit Test'}
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No questions available
          </div>
        )}
      </div>
    </div>
  );
}
