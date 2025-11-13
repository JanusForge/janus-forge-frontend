'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DebateInput from '../../components/DebateInput';
import DebateResults from '../../components/DebateResults';

export default function DebatePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const router = useRouter();

  const handleSubmit = async (query: string) => {
    setIsLoading(true);
    setResult(null);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/debate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit debate');
      }

      setResult(data);
    } catch (error: any) {
      setResult({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Debate Platform</h1>
          <p className="mt-2 text-gray-600">Multiple AI models will debate any topic you choose</p>
        </div>

        <DebateInput onSubmit={handleSubmit} isLoading={isLoading} />
        <DebateResults result={result} isLoading={isLoading} />
      </div>
    </div>
  );
}
