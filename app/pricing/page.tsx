'use client';

import { useState } from 'react';
import Link from 'next/link';

const AI_PLATFORMS = {
  free: [
    { id: 'chatgpt', name: 'ChatGPT', description: 'OpenAI\'s versatile assistant', requiresPaid: false },
    { id: 'claude', name: 'Claude', description: 'Anthropic\'s thoughtful AI', requiresPaid: false },
    { id: 'gemini', name: 'Gemini', description: 'Google\'s multimodal AI', requiresPaid: false }
  ],
  paid: [
    { id: 'grok', name: 'Grok', description: 'xAI\'s real-time knowledge', requiresPaid: true },
    { id: 'deepseek', name: 'DeepSeek', description: 'Advanced reasoning specialist', requiresPaid: true },
    { id: 'claude-2', name: 'Claude 2', description: 'Enhanced context window', requiresPaid: true }
  ]
};

const tiers = [
  {
    name: 'Explorer',
    price: '$0',
    description: 'Chat with free AI platforms',
    features: [
      'Unlimited conversations',
      'ChatGPT, Claude, Gemini',
      'Group chats with 3 AI friends',
      'Basic moderation controls',
      'Community support'
    ],
    buttonText: 'Start Chatting',
    popular: false,
    aiAccess: AI_PLATFORMS.free
  },
  {
    name: 'Pioneer',
    price: '$19',
    description: 'Access all AI platforms',
    features: [
      'All free AI platforms',
      'Plus Grok, DeepSeek, Claude 2',
      'Advanced moderation tools',
      'Custom conversation flows',
      'Priority support',
      'Early access to new AIs'
    ],
    buttonText: 'Subscribe Now',
    popular: true,
    aiAccess: [...AI_PLATFORMS.free, ...AI_PLATFORMS.paid]
  },
  {
    name: 'Visionary',
    price: '$49',
    description: 'For power users & developers',
    features: [
      'All AI platforms included',
      'API access for integration',
      'Custom AI model training',
      'White-label solutions',
      'Dedicated account manager',
      'SLA guarantee'
    ],
    buttonText: 'Subscribe Now',
    popular: false,
    aiAccess: [...AI_PLATFORMS.free, ...AI_PLATFORMS.paid]
  }
];

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSubscribe = async (tier: string) => {
    setIsLoading(tier);
    
    try {
      if (tier === 'explorer') {
        // Free tier - go straight to chat
        window.location.href = '/chat';
      } else {
        // Paid tier - set selection and go to login
        localStorage.setItem('selectedTier', tier);
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Choose Your AI Companions</h1>
          <p className="mt-4 text-xl text-gray-600">
            Free access to platforms you already use, paid access to premium AI services
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl shadow-lg ${
                tier.popular
                  ? 'ring-2 ring-blue-600 bg-white transform scale-105'
                  : 'bg-white ring-1 ring-gray-200'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 text-sm font-medium rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900">{tier.name}</h3>
                <p className="mt-2 text-gray-600">{tier.description}</p>
                
                <div className="mt-6">
                  <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                  {tier.price !== '$0' && <span className="text-gray-600">/month</span>}
                </div>

                {/* AI Platform Access */}
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">AI Platforms:</h4>
                  <div className="space-y-2">
                    {tier.aiAccess.map((ai) => (
                      <div key={ai.id} className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          ai.requiresPaid ? 'bg-orange-500' : 'bg-green-500'
                        }`}></div>
                        <span className="text-sm text-gray-700">{ai.name}</span>
                        {ai.requiresPaid && tier.price === '$0' && (
                          <span className="text-xs text-orange-600 bg-orange-50 px-1 rounded">Paid</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <ul className="mt-6 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <svg
                        className="h-5 w-5 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="ml-3 text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(tier.name.toLowerCase())}
                  disabled={isLoading === tier.name.toLowerCase()}
                  className={`mt-8 w-full py-3 px-6 rounded-lg font-medium ${
                    tier.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : tier.price === '$0'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  } disabled:bg-gray-400 transition-colors`}
                >
                  {isLoading === tier.name.toLowerCase() ? 'Processing...' : tier.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center bg-white rounded-lg p-8 border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-600">
            <div>
              <div className="font-medium text-gray-900 mb-2">1. Free Access</div>
              <p>ChatGPT, Claude, and Gemini are free - you're already using them!</p>
            </div>
            <div>
              <div className="font-medium text-gray-900 mb-2">2. Paid Platforms</div>
              <p>Grok, DeepSeek, and premium models require a subscription (we cover API costs)</p>
            </div>
            <div>
              <div className="font-medium text-gray-900 mb-2">3. Mix & Match</div>
              <p>Choose which AIs to include in your conversations, pay only for what you use</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
