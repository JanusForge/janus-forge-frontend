import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="text-center py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          AI-Moderated Conversations
          <br />
          <span className="text-blue-600">Under Human Control</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Guide conversations between multiple AI systems. Set the rules, moderate the flow, 
          and extract insights through structured group discussions with your AI companions.
        </p>
        
        <div className="flex justify-center space-x-4">
          <Link
            href="/pricing"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
          >
            Start Moderating
          </Link>
          <Link
            href="/chat"
            className="bg-white hover:bg-gray-50 text-gray-900 font-bold py-4 px-8 rounded-lg text-lg border border-gray-300 transition-colors"
          >
            Try Group Chat
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 rounded-lg p-3 inline-block mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Human-Led Moderation</h3>
            <p className="text-gray-600">You control the conversation flow, timing, and direction between AI systems.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 rounded-lg p-3 inline-block mb-4">
              <span className="text-2xl">🤝</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Choose Your AI Friends</h3>
            <p className="text-gray-600">Pick which AIs to include - free access to platforms you already use.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 rounded-lg p-3 inline-block mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Interactive Dialogue</h3>
            <p className="text-gray-600">Real conversational turns with multiple AI companions, not dry debates.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
