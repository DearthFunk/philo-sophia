import React from 'react';

export interface Integration {
  id: string;
  name: string;
  icon: string;
  description: string;
  fetchData: (word: string) => Promise<IntegrationData>;
  enabled: boolean;
  tooltipTemplate?: (data: any, word: string) => React.ReactElement;
}

export interface IntegrationData {
  success: boolean;
  data?: any;
  error?: string;
  fallbackMessage?: string;
}
