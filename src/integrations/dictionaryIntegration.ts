import React from 'react';
import { Integration, IntegrationData } from '../types/integrations';
import DictionaryTooltip from './templates/DictionaryTooltip';

interface DictionaryAPIResponse {
  word: string;
  phonetic?: string;
  phonetics?: Array<{
    text?: string;
    audio?: string;
  }>;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
      synonyms?: string[];
      antonyms?: string[];
    }>;
  }>;
}

const fetchDictionaryData = async (word: string): Promise<IntegrationData> => {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          error: 'Word not found',
          fallbackMessage: `No dictionary entry found for "${word}". This word may be a proper noun, specialized term, or not in the dictionary.`
        };
      }
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data: DictionaryAPIResponse[] = await response.json();
    
    if (!data || data.length === 0) {
      return {
        success: false,
        error: 'No data returned',
        fallbackMessage: `No dictionary data available for "${word}".`
      };
    }

    const entry = data[0];
    const formattedData = {
      word: entry.word,
      phonetic: entry.phonetic || entry.phonetics?.[0]?.text || '',
      definitions: entry.meanings.map(meaning => ({
        partOfSpeech: meaning.partOfSpeech,
        definition: meaning.definitions[0]?.definition || '',
        example: meaning.definitions[0]?.example || '',
        synonyms: meaning.definitions[0]?.synonyms || [],
        antonyms: meaning.definitions[0]?.antonyms || []
      }))
    };

    return {
      success: true,
      data: formattedData
    };
  } catch (error) {
    console.error('Dictionary API error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      fallbackMessage: `Dictionary lookup failed for "${word}". Please check your internet connection and try again.`
    };
  }
};

export const dictionaryIntegration: Integration = {
  id: 'dictionary',
  name: 'Dictionary',
  icon: '📖',
  description: 'Get definitions from Dictionary API',
  fetchData: fetchDictionaryData,
  enabled: true,
  tooltipTemplate: (data: any, word: string) => React.createElement(DictionaryTooltip, { data, word })
};
