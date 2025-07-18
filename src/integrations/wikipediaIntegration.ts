import React from 'react';
import { Integration, IntegrationData } from '../types/integrations';
import WikipediaTooltip from './templates/WikipediaTooltip';

interface WikipediaSearchResponse {
  query: {
    search: Array<{
      title: string;
      snippet: string;
      size: number;
      timestamp: string;
    }>;
  };
}

const fetchWikipediaData = async (word: string): Promise<IntegrationData> => {
  try {
    const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(word)}`;
    
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          error: 'Page not found',
          fallbackMessage: `No Wikipedia article found for "${word}". Try searching for a more specific or common term.`
        };
      }
      throw new Error(`Wikipedia API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (!data || !data.extract) {
      return {
        success: false,
        error: 'No content available',
        fallbackMessage: `No Wikipedia content available for "${word}".`
      };
    }

    const formattedData = {
      title: data.title,
      extract: data.extract,
      url: data.content_urls?.desktop?.page || '',
      thumbnail: data.thumbnail?.source || null,
      lang: data.lang || 'en'
    };

    return {
      success: true,
      data: formattedData
    };
  } catch (error) {
    console.error('Wikipedia API error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      fallbackMessage: `Wikipedia lookup failed for "${word}". Please check your internet connection and try again.`
    };
  }
};

export const wikipediaIntegration: Integration = {
  id: 'wikipedia',
  name: 'Wikipedia',
  icon: '🌐',
  description: 'Get Wikipedia summary',
  fetchData: fetchWikipediaData,
  enabled: true, // Enabled for testing
  tooltipTemplate: (data: any, word: string) => React.createElement(WikipediaTooltip, { data, word })
};
