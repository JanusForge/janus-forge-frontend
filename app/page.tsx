import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Janus Forge
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          AI-Powered Dialectic Moderation Platform
        </p>
        <Link 
          href="/debate"
          className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Start AI Debate
        </Link>
      </div>
    </div>
  );
}
