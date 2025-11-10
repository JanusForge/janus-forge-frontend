import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Janus Forge
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          AI-Powered Dialectic Moderation Platform
        </p>
        
        <Link 
          href="/debate"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors text-lg"
        >
          Start AI Debate
        </Link>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>Multiple AI models will debate any topic you choose</p>
        </div>
      </div>
    </div>
  );
}
