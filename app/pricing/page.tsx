'use client';

import { useState } from 'react';

const tiers = [
  {
    name: 'Explorer',
    price: '$0',
    description: 'Try basic AI debates',
    features: [
      '3 debates per month',
      'ChatGPT access only',
      'Basic debate format',
      'Email support'
    ],
    buttonText: 'Get Started',
    popular: false
  },
  {
    name: 'Pioneer',
    price: '$19',
    description: 'Most popular for enthusiasts',
    features: [
      '100 debates per month',
      'ChatGPT + Gemini + Claude',
      'Interactive moderation',
      'Debate history',
      'Priority support'
    ],
    buttonText: 'Subscribe Now',
    popular: true
  },
  {
    name: 'Visionary',
    price: '$49',
    description: 'For power users & professionals',
    features: [
      'Unlimited debates',
      'All AI models (including Grok)',
      'Advanced moderation controls',
      'Custom debate formats',
      'API access',
      'Dedicated support'
    ],
    buttonText: 'Subscribe Now',
    popular: false
  }
];

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSubscribe = async (tier: string) => {
    setIsLoading(tier);
    
    try {
      // TODO: Integrate with Stripe checkout
      // For now, redirect to login with tier selection
      localStorage.setItem('selectedTier', tier);
      window.location.href = '/login';
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
          <h1 className="text-4xl font-bold text-gray-900">Choose Your Plan</h1>
          <p className="mt-4 text-xl text-gray-600">
            Join the future of AI-moderated debates
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl shadow-lg ${
                tier.popular
                  ? 'ring-2 ring-blue-600 bg-white'
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
                <p className="mt-4 text-gray-600">{tier.description}</p>
                
                <div className="mt-6">
                  <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                  {tier.price !== '$0' && <span className="text-gray-600">/month</span>}
                </div>

                <ul className="mt-8 space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <svg
                        className="h-6 w-6 text-green-500"
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
                      <span className="ml-3 text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(tier.name.toLowerCase())}
                  disabled={isLoading === tier.name.toLowerCase()}
                  className={`mt-8 w-full py-3 px-6 rounded-lg font-medium ${
                    tier.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  } disabled:bg-gray-400 transition-colors`}
                >
                  {isLoading === tier.name.toLowerCase() ? 'Processing...' : tier.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600">
            All plans include our interactive AI moderation platform
          </p>
        </div>
      </div>
    </div>
  );
}
