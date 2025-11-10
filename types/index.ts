export interface AIPlatform {
  id: string;
  name: string;
  enabled: boolean;
}

export interface AIResponse {
  model: string;
  response?: string;
  error?: string;
}

export interface DebateResult {
  query: string;
  results: AIResponse[];
}
