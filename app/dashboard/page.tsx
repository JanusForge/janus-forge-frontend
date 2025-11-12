'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  email: string;
  tier: string;
  features: {
    available_models: string[];
    max_queries: number;
  };
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-red-600">No user data found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Janus Forge Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Subscription Info */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Subscription Plan
                </h3>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-blue-600 capitalize">{user.tier}</p>
                  <p className="mt-2 text-gray-600">
                    Access to {user.features.available_models.length} AI models
                  </p>
                </div>
              </div>
            </div>

            {/* Available Models */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Available AI Models
                </h3>
                <div className="mt-4">
                  <ul className="list-disc list-inside space-y-1">
                    {user.features.available_models.map((model) => (
                      <li key={model} className="text-gray-600 capitalize">
                        {model}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white overflow-hidden shadow rounded-lg md:col-span-2">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Quick Actions
                </h3>
                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={() => router.push('/debate')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
                  >
                    Start New Debate
                  </button>
                  <button
                    onClick={() => router.push('/pricing')}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium"
                  >
                    Upgrade Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
