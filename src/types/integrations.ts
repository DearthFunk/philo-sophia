import React from 'react';

export interface Integration {
  id: string;
  name: string;
  icon: string;
  description: string;
  enabled: boolean;
  fetchData: (word: string) => Promise<IntegrationData>;
  tooltipTemplate?: (data: any, word: string) => React.ReactElement;
}

export interface IntegrationData {
  success: boolean;
  data?: any;
  error?: string;
  fallbackMessage?: string;
}
