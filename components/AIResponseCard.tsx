import { AIResponse } from '@/types';

interface AIResponseCardProps {
  response: AIResponse;
}

export default function AIResponseCard({ response }: AIResponseCardProps) {
  const getModelColor = (model: string) => {
    const colors = {
      openai: 'bg-green-50 border-green-200',
      anthropic: 'bg-purple-50 border-purple-200',
      deepseek: 'bg-blue-50 border-blue-200',
      groq: 'bg-orange-50 border-orange-200',
      gemini: 'bg-red-50 border-red-200',
    };
    return colors[model as keyof typeof colors] || 'bg-gray-50 border-gray-200';
  };

  const getModelName = (model: string) => {
    const names = {
      openai: 'OpenAI (ChatGPT)',
      anthropic: 'Anthropic (Claude)',
      deepseek: 'DeepSeek',
      groq: 'Groq',
      gemini: 'Google Gemini',
    };
    return names[model as keyof typeof names] || model;
  };

  const getModelIcon = (model: string) => {
    const icons = {
      openai: '🤖',
      anthropic: '🔮',
      deepseek: '⚡',
      groq: '🚀',
      gemini: '🔍',
    };
    return icons[model as keyof typeof icons] || '🤔';
  };

  return (
    <div className={`border-2 rounded-lg p-4 h-full transition-all hover:shadow-md ${getModelColor(response.model)}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getModelIcon(response.model)}</span>
          <h3 className="font-semibold text-gray-800">
            {getModelName(response.model)}
          </h3>
        </div>
        <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-600 border">
          AI
        </span>
      </div>
      
      <div className="text-gray-700">
        {response.error ? (
          <div className="text-red-600 text-sm">
            <strong>Error:</strong> {response.error}
          </div>
        ) : (
          <p className="text-sm leading-relaxed">{response.response}</p>
        )}
      </div>
    </div>
  );
}
