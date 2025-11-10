'use client';

import { useState } from 'react';
import DebateInput from '@/components/DebateInput';
import AIResponseCard from '@/components/AIResponseCard';
import PlatformSelector from '@/components/PlatformSelector';
import { DebateResult, AIResponse, AIPlatform } from '@/types';

const AVAILABLE_PLATFORMS: AIPlatform[] = [
  { id: 'openai', name: 'OpenAI (ChatGPT)', enabled: true },
  { id: 'anthropic', name: 'Anthropic (Claude)', enabled: true },
  { id: 'deepseek', name: 'DeepSeek', enabled: true },
  { id: 'groq', name: 'Groq', enabled: true },
  { id: 'gemini', name: 'Google Gemini', enabled: true },
];

export default function Home() {
  const [debateResult, setDebateResult] = useState<DebateResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<AIPlatform[]>(
    AVAILABLE_PLATFORMS.filter(p => p.enabled)
  );

  const handleDebate = async (query: string) => {
    if (selectedPlatforms.length === 0) {
      alert('Please select at least one AI platform');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/debate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query,
          platforms: selectedPlatforms.map(p => p.id)
        }),
      });
      
      if (!response.ok) throw new Error('Failed to fetch debate');
      const result: DebateResult = await response.json();
      setDebateResult(result);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to get debate responses');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Janus Forge
          </h1>
          <p className="text-xl text-gray-600">
            Multi-AI Debate Orchestrator
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <PlatformSelector
            platforms={AVAILABLE_PLATFORMS}
            selectedPlatforms={selectedPlatforms}
            onPlatformsChange={setSelectedPlatforms}
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <DebateInput 
            onDebate={handleDebate} 
            isLoading={isLoading}
            selectedPlatforms={selectedPlatforms}
          />
        </div>

        {debateResult && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Debate Results
              </h2>
              <p className="text-gray-600">"{debateResult.query}"</p>
              <div className="flex justify-center gap-2 mt-2 flex-wrap">
                {selectedPlatforms.map(platform => (
                  <span key={platform.id} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {platform.name}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {debateResult.results.map((response, index) => (
                <AIResponseCard key={index} response={response} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
