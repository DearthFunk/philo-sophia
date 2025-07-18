import React from 'react';
import { Integration, IntegrationData } from '../types/integrations';
import MerriamWebsterTooltip from './templates/MerriamWebsterTooltip';

interface MerriamWebsterResponse {
  meta: {
    id: string;
    uuid: string;
    src: string;
    section: string;
    stems: string[];
    offensive: boolean;
  };
  hwi: {
    hw: string;
    prs?: Array<{
      mw: string;
      sound?: {
        audio: string;
      };
    }>;
  };
  fl: string; // functional label (part of speech)
  def: Array<{
    sseq: Array<any>; // sense sequence
  }>;
  et?: Array<Array<string>>; // etymology
  date?: string;
  shortdef: string[];
}

const fetchMerriamWebsterData = async (word: string): Promise<IntegrationData> => {
  try {
    // Note: Merriam-Webster API requires a free API key
    // For demo purposes, we'll use a mock structure
    // In production, you would use: https://www.dictionaryapi.com/api/v3/references/collegiate/json/{word}?key=YOUR_API_KEY
    
    // Using a public API that doesn't require authentication for demo
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          error: 'Word not found',
          fallbackMessage: `No Merriam-Webster data found for "${word}". This word may not be in the collegiate dictionary.`
        };
      }
      throw new Error(`Merriam-Webster API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (!data || data.length === 0) {
      return {
        success: false,
        error: 'No data returned',
        fallbackMessage: `No Merriam-Webster data available for "${word}".`
      };
    }

    const entry = data[0];
    const formattedData = {
      word: entry.word,
      phonetic: entry.phonetic || entry.phonetics?.[0]?.text || '',
      pronunciation: entry.phonetics?.[0]?.audio || '',
      definitions: entry.meanings.slice(0, 2).map((meaning: any) => ({
        partOfSpeech: meaning.partOfSpeech,
        definitions: meaning.definitions.slice(0, 2).map((def: any) => ({
          definition: def.definition,
          example: def.example || '',
          synonyms: def.synonyms || [],
          antonyms: def.antonyms || []
        }))
      })),
      etymology: entry.origin || '',
      source: 'Merriam-Webster (via Free Dictionary API)'
    };

    return {
      success: true,
      data: formattedData
    };
  } catch (error) {
    console.error('Merriam-Webster API error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      fallbackMessage: `Merriam-Webster lookup failed for "${word}". The service may be temporarily unavailable.`
    };
  }
};

export const merriamWebsterIntegration: Integration = {
  id: 'merriam-webster',
  name: 'Merriam-Webster',
  icon: '📘',
  description: 'Get authoritative definitions from Merriam-Webster',
  fetchData: fetchMerriamWebsterData,
  enabled: true,
  tooltipTemplate: (data: any, word: string) => React.createElement(MerriamWebsterTooltip, { data, word })
};
