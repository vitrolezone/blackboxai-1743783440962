import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Recommendation } from '../types';
import { getRecommendations } from '../services/api';

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = React.useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const { testResultId } = location.state || {};

  React.useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        if (testResultId) {
          const data = await getRecommendations(testResultId);
          setRecommendations(data);
        }
      } catch (err) {
        setError('Failed to load recommendations. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecommendations();
  }, [testResultId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Your Career Recommendations</h1>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Home
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>{error}</p>
            <button
              onClick={() => navigate('/test')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Retry Test
            </button>
          </div>
        ) : recommendations?.length > 0 ? (
          <div className="space-y-6">
            {recommendations.map((rec, index) => (
              <div key={index} className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-blue-600">{rec.career.title}</h2>
                    <div className="mt-2 flex items-center">
                      <span className="text-lg font-medium">Match: </span>
                      <span className="ml-2 text-lg font-bold text-green-600">
                        {rec.match_score.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    #{index + 1} Recommendation
                  </div>
                </div>
                
                <div className="mt-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">Description:</h3>
                    <p className="text-gray-600">{rec.career.description}</p>
                  </div>
                  
                  {rec.career.required_skills && (
                    <div>
                      <h3 className="font-semibold text-gray-800">Required Skills:</h3>
                      <p className="text-gray-600">{rec.career.required_skills}</p>
                    </div>
                  )}
                  
                  {rec.career.education_path && (
                    <div>
                      <h3 className="font-semibold text-gray-800">Education Path:</h3>
                      <p className="text-gray-600">{rec.career.education_path}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-gray-600">No recommendations available</h2>
            <button
              onClick={() => navigate('/test')}
              className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Take the Test Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
