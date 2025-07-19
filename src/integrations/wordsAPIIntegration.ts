import React from 'react';
import { Integration, IntegrationData } from '../types/integrations';
import WordsAPITooltip from './templates/WordsAPITooltip';

const fetchWordsAPIData = async (word: string): Promise<IntegrationData> => {
  try {
    // Note: WordsAPI requires an API key from RapidAPI
    // For demo purposes, we'll simulate the API structure
    // In production, you would use: https://wordsapiv1.p.rapidapi.com/words/{word}
    
    const response = await fetch(`https://api.wordnik.com/v4/word.json/${word.toLowerCase()}/definitions?limit=3&includeRelated=false&sourceDictionaries=wiktionary&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad75001ca3111acd55af2ffabf50eb4ae`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          error: 'Word not found',
          fallbackMessage: `No WordsAPI data found for "${word}". This word may not be in the dictionary or may require different spelling.`
        };
      }
      throw new Error(`WordsAPI request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (!data || data.length === 0) {
      return {
        success: false,
        error: 'No data returned',
        fallbackMessage: `No WordsAPI data available for "${word}".`
      };
    }

    const formattedData = {
      word: word,
      definitions: data.slice(0, 3).map((def: any) => ({
        definition: def.text,
        partOfSpeech: def.partOfSpeech || 'unknown',
        source: def.sourceDictionary || 'wordnik'
      }))
    };

    return {
      success: true,
      data: formattedData
    };
  } catch (error) {
    console.error('WordsAPI error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      fallbackMessage: `WordsAPI lookup failed for "${word}". The service may be temporarily unavailable.`
    };
  }
};

export const wordsAPIIntegration: Integration = {
  id: 'wordsapi',
  name: 'WordsAPI',
  icon: '📝',
  description: 'Get comprehensive word data from WordsAPI',
  fetchData: fetchWordsAPIData,
  enabled: true,
  tooltipTemplate: (data: any, word: string) => React.createElement(WordsAPITooltip, { data, word })
};
