'use client';

interface DebateResultsProps {
  result: any;
  isLoading: boolean;
}

export default function DebateResults({ result, isLoading }: DebateResultsProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Debate in Progress</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-pulse text-gray-600">
            Multiple AI models are debating your topic...
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Debate Results</h2>
      
      {result.error ? (
        <div className="text-red-600 bg-red-50 p-4 rounded-md">
          <strong>Error:</strong> {result.error}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Display the debate results from FastAPI */}
          <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
