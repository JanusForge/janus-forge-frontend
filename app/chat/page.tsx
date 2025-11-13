'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  ai?: string;
  timestamp: Date;
  realAI?: boolean;
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

const SUGGESTED_TOPICS = [
  "How can AI and humans collaborate to solve climate change?",
  "What is the future of education with AI?",
  "How can we ensure ethical AI development?",
  "What role should governments play in regulating AI?",
  "How will AI transform healthcare in the next decade?"
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [topicInput, setTopicInput] = useState('');
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

  const callRealAI = async (topic: string): Promise<Message[]> => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch('/api/debate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ query: topic }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get AI responses');
    }

    const data = await response.json();
    
    // Transform the backend response into our message format
    return data.responses.map((aiResponse: any) => ({
      id: `ai-${Date.now()}-${aiResponse.ai}`,
      role: 'assistant' as const,
      content: aiResponse.real_ai_used && !aiResponse.response.includes('API Error') 
        ? aiResponse.response 
        : `[Simulated] ${getAIResponse(aiResponse.ai, topic)}`,
      ai: aiResponse.ai,
      timestamp: new Date(aiResponse.timestamp),
      realAI: aiResponse.real_ai_used && !aiResponse.response.includes('API Error')
    }));
  };

  const startConversation = async (topic: string) => {
    if (!topic.trim() || selectedAIs.length === 0) return;
    
    setIsLoading(true);
    setConversationStarted(true);
    setTopicInput('');
    
    // Add user's topic
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: topic,
      timestamp: new Date()
    };
    
    setMessages([userMessage]);

    try {
      // Try to call real AI backend first
      const aiResponses = await callRealAI(topic);
      setMessages(prev => [...prev, ...aiResponses]);
      
    } catch (error) {
      console.error('Real AI call failed, using simulated responses:', error);
      
      // Fallback to simulated responses if real API fails
      setTimeout(() => {
        const simulatedResponses: Message[] = selectedAIs.map((aiId, index) => {
          const ai = ALL_AI_PLATFORMS.find(a => a.id === aiId);
          return {
            id: `ai-${Date.now()}-${index}`,
            role: 'assistant',
            content: `[Simulated - API Unavailable] ${getAIResponse(aiId, topic)}`,
            ai: aiId,
            timestamp: new Date(),
            realAI: false
          };
        });

        setMessages(prev => [...prev, ...simulatedResponses]);
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const getAIResponse = (ai: string, topic: string): string => {
    const responses: { [key: string]: string } = {
      chatgpt: `I'd approach "${topic}" by considering the historical context and contemporary implications. This seems like a complex issue that requires careful analysis of multiple perspectives.`,
      claude: `Regarding "${topic}", I think it's important to examine this through both historical and modern lenses. The interplay between historical narratives and present-day understanding is crucial here.`,
      gemini: `When considering "${topic}", multiple dimensions come to mind - historical accuracy, cultural memory, and how societies reconcile with complex pasts.`,
      grok: `"${topic}" - now that's a topic with some real depth! Let's unpack the historical narratives and see what they reveal about current perspectives.`,
      deepseek: `Analyzing "${topic}" requires examining historical interpretations, their evolution over time, and how they shape contemporary understanding and commemorations.`
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

    try {
      // Try real AI for follow-up messages too
      const aiResponses = await callRealAI(content);
      setMessages(prev => [...prev, ...aiResponses]);
    } catch (error) {
      console.error('Real AI call failed for follow-up:', error);
      
      // Fallback to simulated responses
      setTimeout(() => {
        const simulatedResponses: Message[] = selectedAIs.map((aiId, index) => ({
          id: `ai-${Date.now()}-${index}`,
          role: 'assistant',
          content: `[Simulated - API Unavailable] ${getContinuingResponse(aiId, content)}`,
          ai: aiId,
          timestamp: new Date(),
          realAI: false
        }));

        setMessages(prev => [...prev, ...simulatedResponses]);
        setIsLoading(false);
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const getContinuingResponse = (ai: string, userMessage: string): string => {
    const responses: { [key: string]: string } = {
      chatgpt: `Following up on that point about "${userMessage}", I'd consider how this perspective interacts with other viewpoints in the discussion.`,
      claude: `Building on your observation about "${userMessage}", this seems to connect with several important themes we've been exploring.`,
      gemini: `Your point about "${userMessage}" raises interesting questions about how different approaches might complement each other in this analysis.`,
      grok: `Now that's an interesting angle on "${userMessage}"! Let me see how this fits with the broader context we're discussing.`,
      deepseek: `Your input about "${userMessage}" provides a valuable perspective that enhances our multi-faceted analysis of this topic.`
    };
    return responses[ai] || `Thanks for sharing that perspective about "${userMessage}".`;
  };

  const resetConversation = () => {
    setMessages([]);
    setConversationStarted(false);
    setInput('');
    setTopicInput('');
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

        {/* Conversation Area */}
        <div className="flex-1 p-6 space-y-6 pb-32">
          {!conversationStarted ? (
            <div className="text-center py-8">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
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
                
                {/* Custom Topic Input */}
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Start Your Own Conversation</h3>
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={topicInput}
                      onChange={(e) => setTopicInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && startConversation(topicInput)}
                      placeholder="Enter any topic you'd like to discuss with the AIs..."
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isLoading || selectedAIs.length === 0}
                    />
                    <button
                      onClick={() => startConversation(topicInput)}
                      disabled={!topicInput.trim() || isLoading || selectedAIs.length === 0}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
                    >
                      Start Conversation
                    </button>
                  </div>
                </div>

                {/* Suggested Topics */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Or try a suggested topic:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {SUGGESTED_TOPICS.map((topic, index) => (
                      <button
                        key={index}
                        onClick={() => startConversation(topic)}
                        disabled={selectedAIs.length === 0}
                        className="bg-white hover:bg-gray-50 disabled:bg-gray-100 border border-gray-200 rounded-lg p-4 text-left transition-colors"
                      >
                        <p className="text-gray-700">{topic}</p>
                      </button>
                    ))}
                  </div>
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
                    } ${!message.realAI && message.role === 'assistant' ? 'border-2 border-yellow-400' : ''}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">
                          {ALL_AI_PLATFORMS.find(f => f.id === message.ai)?.avatar}
                        </span>
                        <span className="font-medium text-sm">
                          {ALL_AI_PLATFORMS.find(f => f.id === message.ai)?.name}
                        </span>
                        {!message.realAI && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-1 rounded">Simulated</span>
                        )}
                        {message.realAI && (
                          <span className="text-xs bg-green-100 text-green-800 px-1 rounded">Live AI</span>
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

        {/* Input Area for ongoing conversations */}
        {conversationStarted && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)}
                  placeholder="Continue the conversation... (Press Enter to send)"
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
