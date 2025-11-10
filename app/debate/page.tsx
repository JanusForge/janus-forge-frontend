'use client';

import { useState } from 'react';
import DebateInput from '../../components/DebateInput';
import DebateResults from '../../components/DebateResults';

export default function DebatePage() {
  const [debateResult, setDebateResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDebateSubmit = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/debate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Failed to get debate response');
      }

      const result = await response.json();
      setDebateResult(result);
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting debate query');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
          Janus Forge
        </h1>
        <p className="text-center text-gray-600 mb-8">
          AI-Powered Dialectic Moderation Platform
        </p>
        
        <DebateInput onSubmit={handleDebateSubmit} isLoading={isLoading} />
        <DebateResults result={debateResult} isLoading={isLoading} />
      </div>
    </div>
  );
}
