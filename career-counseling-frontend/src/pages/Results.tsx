import React from 'react';
import { useLocation } from 'react-router-dom';
import { Recommendation } from '../types';

export default function ResultsPage() {
  const location = useLocation();
  const recommendations = location.state?.recommendations as Recommendation[];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-8">Your Career Recommendations</h1>
      
      {recommendations?.map((rec, index) => (
        <div key={index} className="mb-6 p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold text-blue-600">{rec.career.title}</h2>
          <p className="text-gray-600 mt-2">{rec.career.description}</p>
          <div className="mt-4">
            <span className="font-medium">Match Score: </span>
            <span className="text-green-600">{rec.match_score.toFixed(1)}%</span>
          </div>
        </div>
      ))}
    </div>
  );
}