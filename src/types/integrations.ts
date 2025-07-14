export interface Integration {
  id: string;
  name: string;
  icon: string;
  description: string;
  fetchData: (word: string) => Promise<IntegrationData>;
  enabled: boolean;
}

export interface IntegrationData {
  success: boolean;
  data?: any;
  error?: string;
  fallbackMessage?: string;
}

export interface IntegrationResult {
  integrationId: string;
  word: string;
  data: IntegrationData;
  timestamp: number;
}
