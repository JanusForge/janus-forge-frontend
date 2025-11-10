'use client';

import { useState } from 'react';
import { submitDebateQuery, type DebateQuery } from '@/lib/api';

export default function DebatePage() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [debateResult, setDebateResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const result = await submitDebateQuery({ query: query.trim() });
      setDebateResult(result);
    } catch (error) {
      console.error('Debate API error:', error);
      alert('Error submitting debate query');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Janus Forge AI Debate</h1>
        
        {/* Query Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter a topic for AI debate..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Debating...' : 'Start Debate'}
            </button>
          </div>
        </form>

        {/* Results Display */}
        {debateResult && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Debate Results</h2>
            
            {/* For Arguments */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-green-600 mb-2">Arguments For</h3>
              <div className="space-y-2">
                {debateResult.arguments?.for?.map((arg: string, index: number) => (
                  <div key={index} className="p-3 bg-green-50 border border-green-200 rounded">
                    {arg}
                  </div>
                ))}
              </div>
            </div>

            {/* Against Arguments */}
            <div>
              <h3 className="text-lg font-medium text-red-600 mb-2">Arguments Against</h3>
              <div className="space-y-2">
                {debateResult.arguments?.against?.map((arg: string, index: number) => (
                  <div key={index} className="p-3 bg-red-50 border border-red-200 rounded">
                    {arg}
                  </div>
                ))}
              </div>
            </div>

            {/* Quality Metrics */}
            {debateResult.quality_metrics && (
              <div className="mt-6 pt-4 border-t">
                <h3 className="text-lg font-medium mb-2">Debate Quality</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {debateResult.quality_metrics.clarity}
                    </div>
                    <div className="text-sm text-gray-600">Clarity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {debateResult.quality_metrics.balance}
                    </div>
                    <div className="text-sm text-gray-600">Balance</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {debateResult.quality_metrics.evidence}
                    </div>
                    <div className="text-sm text-gray-600">Evidence</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
