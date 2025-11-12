import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janus-forge-production.up.railway.app';

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    // Test endpoint without auth first
    const testResponse = await fetch(`${API_BASE_URL}/v1/status`);
    if (!testResponse.ok) {
      return NextResponse.json(
        { error: 'Backend not reachable' },
        { status: 502 }
      );
    }

    // For now, return mock data until auth is implemented
    const mockData = {
      debate_topic: query,
      responses: [
        { model: "chatgpt", response: "Mock ChatGPT response for: " + query },
        { model: "gemini", response: "Mock Gemini response for: " + query }
      ],
      note: "Authentication required for real AI responses"
    };

    return NextResponse.json(mockData);

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Failed to process debate request' },
      { status: 500 }
    );
  }
}
