'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  ai?: string;
  timestamp: Date;
}

const FREE_AI_PLATFORMS = [
  { id: 'chatgpt', name: 'ChatGPT', avatar: '🤖', color: 'bg-green-100', requiresPaid: false },
  { id: 'claude', name: 'Claude', avatar: '🧠', color: 'bg-orange-100', requiresPaid: false },
  { id: 'gemini', name: 'Gemini', avatar: '💎', color: 'bg-blue-100', requiresPaid: false }
];

const PAID_AI_PLATFORMS = [
  { id: 'grok', name: 'Grok', avatar: '🚀', color: 'bg-red-100', requiresPaid: true },
  { id: 'deepseek', name: 'DeepSeek', avatar: '🔍', color: 'bg-purple-100', requiresPaid: true }
];

const ALL_AI_PLATFORMS = [...FREE_AI_PLATFORMS, ...PAID_AI_PLATFORMS];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [selectedAIs, setSelectedAIs] = useState<string[]>(['chatgpt', 'claude', 'gemini']);
  const [showAISelection, setShowAISelection] = useState(false);
  const [showPaywall, setShowPaywall] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleAI = (aiId: string, requiresPaid: boolean) => {
    if (requiresPaid) {
      // Check if user has paid subscription
      const userTier = localStorage.getItem('userTier') || 'explorer';
      if (userTier === 'explorer') {
        setShowPaywall(aiId);
        return;
      }
    }

    setSelectedAIs(prev => 
      prev.includes(aiId) 
        ? prev.filter(id => id !== aiId)
        : [...prev, aiId]
    );
  };

  const startConversation = async (topic: string) => {
    if (!topic.trim() || selectedAIs.length === 0) return;
    
    setIsLoading(true);
    setConversationStarted(true);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: topic,
      timestamp: new Date()
    };
    
    setMessages([userMessage]);

    try {
      // Simulate AI responses
      setTimeout(() => {
        const aiResponses: Message[] = selectedAIs.map((aiId, index) => {
          const ai = ALL_AI_PLATFORMS.find(a => a.id === aiId);
          return {
            id: `ai-${Date.now()}-${index}`,
            role: 'assistant',
            content: getAIResponse(aiId, topic),
            ai: aiId,
            timestamp: new Date()
          };
        });

        setMessages(prev => [...prev, ...aiResponses]);
        setIsLoading(false);
      }, 2000);

    } catch (error) {
      console.error('Error starting conversation:', error);
      setIsLoading(false);
    }
  };

  const getAIResponse = (ai: string, topic: string): string => {
    const responses: { [key: string]: string } = {
      chatgpt: `That's a fascinating topic about "${topic}". From my perspective, this raises important questions about how we approach complex problems collaboratively. What do the others think?`,
      claude: `I appreciate you bringing up "${topic}". It reminds me that the most meaningful solutions often emerge from diverse perspectives working in harmony.`,
      gemini: `"${topic}" - what an engaging subject! It highlights how different AI systems can complement each other's strengths.`,
      grok: `Alright, "${topic}" - now we're talking! This is exactly the kind of complex, real-world problem I love digging into.`,
      deepseek: `Analyzing "${topic}" from multiple angles reveals several interesting patterns and potential solutions worth exploring.`
    };
    return responses[ai] || `I'd like to discuss "${topic}" with the group.`;
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading || selectedAIs.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const aiResponses: Message[] = selectedAIs.map((aiId, index) => ({
        id: `ai-${Date.now()}-${index}`,
        role: 'assistant',
        content: getContinuingResponse(aiId, content),
        ai: aiId,
        timestamp: new Date()
      }));

      setMessages(prev => [...prev, ...aiResponses]);
      setIsLoading(false);
    }, 2000);
  };

  const getContinuingResponse = (ai: string, userMessage: string): string => {
    const responses: { [key: string]: string } = {
      chatgpt: `Building on that point, I think ${userMessage} raises some interesting implications.`,
      claude: `You make a good observation. ${userMessage} This aligns with my thinking about collaborative problem-solving.`,
      gemini: `I like where you're going with ${userMessage}. It reminds me that our different perspectives can create a more complete picture.`,
      grok: `Ha! ${userMessage} - now that's a spicy take! Let me add some fuel to this discussion.`,
      deepseek: `Interesting perspective on ${userMessage}. Let me analyze this from a few different angles.`
    };
    return responses[ai] || `Thanks for sharing that perspective about ${userMessage}.`;
  };

  const resetConversation = () => {
    setMessages([]);
    setConversationStarted(false);
    setInput('');
  };

  const upgradeToPaid = () => {
    router.push('/pricing');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Conversation Hub</h1>
                <p className="text-gray-600">Choose your AI companions for group discussions</p>
              </div>
              
              <button
                onClick={() => setShowAISelection(!showAISelection)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {selectedAIs.length} AI Selected
              </button>
            </div>

            {showAISelection && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">Select AI Platforms:</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {ALL_AI_PLATFORMS.map(ai => (
                    <div
                      key={ai.id}
                      onClick={() => toggleAI(ai.id, ai.requiresPaid)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedAIs.includes(ai.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      } ${ai.requiresPaid ? 'relative' : ''}`}
                    >
                      <div className="text-2xl mb-1">{ai.avatar}</div>
                      <div className="text-sm font-medium">{ai.name}</div>
                      {ai.requiresPaid && (
                        <div className="text-xs text-orange-600 mt-1">Premium</div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  Free: ChatGPT, Claude, Gemini • Premium: Requires subscription
                </div>
              </div>
            )}

            {selectedAIs.length > 0 && (
              <div className="flex items-center space-x-4 mt-4 flex-wrap gap-2">
                {selectedAIs.map(aiId => {
                  const ai = ALL_AI_PLATFORMS.find(a => a.id === aiId);
                  return ai ? (
                    <div key={ai.id} className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${ai.color}`}></div>
                      <span className="text-sm text-gray-700">{ai.name}</span>
                      {ai.requiresPaid && (
                        <span className="text-xs bg-orange-100 text-orange-800 px-1 rounded">Pro</span>
                      )}
                    </div>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </div>

        {/* Paywall Modal */}
        {showPaywall && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Premium AI Required</h3>
              <p className="text-gray-600 mb-4">
                To use {ALL_AI_PLATFORMS.find(a => a.id === showPaywall)?.name}, you'll need a paid subscription. 
                This helps us cover the API costs for premium AI services.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPaywall(null)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded transition-colors"
                >
                  Maybe Later
                </button>
                <button
                  onClick={upgradeToPaid}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors"
                >
                  View Plans
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rest of the chat interface remains the same */}
        <div className="flex-1 p-6 space-y-6 pb-32">
          {!conversationStarted ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Start a Group Conversation
                </h2>
                <p className="text-gray-600 mb-8">
                  Select which AIs you want to chat with, then begin your moderated discussion.
                </p>
                
                {selectedAIs.length === 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-yellow-800">Please select at least one AI platform to continue.</p>
                  </div>
                )}
                
                <div className="space-y-4">
                  <button
                    onClick={() => startConversation('How can AI and humans collaborate to solve climate change?')}
                    disabled={selectedAIs.length === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg transition-colors"
                  >
                    Start Climate Change Discussion
                  </button>
                  <button
                    onClick={() => startConversation('What is the future of education with AI?')}
                    disabled={selectedAIs.length === 0}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg transition-colors"
                  >
                    Discuss AI in Education
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Messages display */}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">
                          {ALL_AI_PLATFORMS.find(f => f.id === message.ai)?.avatar}
                        </span>
                        <span className="font-medium text-sm">
                          {ALL_AI_PLATFORMS.find(f => f.id === message.ai)?.name}
                        </span>
                        {ALL_AI_PLATFORMS.find(f => f.id === message.ai)?.requiresPaid && (
                          <span className="text-xs bg-orange-100 text-orange-800 px-1 rounded">Pro</span>
                        )}
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-center">
                  <div className="bg-gray-100 rounded-lg p-4 max-w-[80%]">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span>
                        {selectedAIs.map(aiId => 
                          ALL_AI_PLATFORMS.find(a => a.id === aiId)?.name
                        ).join(', ')} are thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        {conversationStarted && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)}
                  placeholder="Guide the conversation... (Press Enter to send)"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Send
                </button>
                <button
                  onClick={resetConversation}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  New Topic
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
