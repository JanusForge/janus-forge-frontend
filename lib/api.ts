const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface DebateQuery {
  query: string;
  context?: string;
}

export interface DebateResponse {
  arguments: {
    for: string[];
    against: string[];
  };
  quality_metrics?: {
    clarity: number;
    balance: number;
    evidence: number;
  };
}

export async function submitDebateQuery(query: DebateQuery): Promise<DebateResponse> {
  const response = await fetch(`${API_BASE_URL}/debate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(query),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}
