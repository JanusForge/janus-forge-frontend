'use client';

import { useState } from 'react';
import { AIPlatform } from '@/types';

interface DebateInputProps {
  onDebate: (query: string) => void;
  isLoading: boolean;
  selectedPlatforms: AIPlatform[];
}

const SUGGESTED_TOPICS = [
  "Should AI be regulated by governments?",
  "Is remote work better than office work?",
  "What's the future of renewable energy?",
  "Are social media platforms good for society?",
  "Should college education be free for everyone?",
];

export default function DebateInput({ onDebate, isLoading, selectedPlatforms }: DebateInputProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading && selectedPlatforms.length > 0) {
      onDebate(query.trim());
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
            Enter a debate topic for {selectedPlatforms.length} AI platform(s):
          </label>
          <textarea
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Should artificial intelligence be regulated?"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24 resize-none"
            required
            disabled={isLoading}
          />
        </div>

        {/* Suggested Topics */}
        <div>
          <p className="text-sm text-gray-600 mb-2">Or try a suggested topic:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_TOPICS.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => setQuery(topic)}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                disabled={isLoading}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!query.trim() || isLoading || selectedPlatforms.length === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Debating with {selectedPlatforms.length} AI platform(s)...
            </>
          ) : (
            `Start Debate with ${selectedPlatforms.length} AI Platform(s)`
          )}
        </button>
      </form>
    </div>
  );
}
