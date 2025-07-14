import React, { useState, useEffect, useCallback } from 'react';
import philosophyTerms from './terms/philosobabel';
import scienceTerms from './terms/sciencebabel';
import { Term, Settings } from './types';
import SearchResults from './components/SearchResults';
import Header from './components/Header';
import { integrationManager } from './services/integrationManager';
import { useKeyboardInteractions } from './hooks/useKeyboardInteractions';
import { useSearch } from './hooks/useSearch';
import './styles.css';

const App: React.FC = () => {
  const [terms, setTerms] = useState<Term[]>([]);
  const [results, setResults] = useState<Term[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [settings, setSettings] = useState<Settings>({
    quickErase: false,
    saveSettings: true,
    termsFile: 'philosophy',
    integrations: integrationManager.getIntegrationSettings(),
  });

  // Custom hooks for interactions
  const { handleKeyDown } = useKeyboardInteractions({
    settings,
    terms,
    setSearchTerm,
    setResults
  });

  const { handleInputChange, handleWordClick } = useSearch({
    terms,
    setSearchTerm,
    setResults
  });

  const loadTerms = useCallback(() => {
    // Select the appropriate terms file based on settings
    const selectedTerms = settings.termsFile === 'science' ? scienceTerms : philosophyTerms;
    
    // Map the terms to an array of objects
    const mappedTerms: Term[] = Object.keys(selectedTerms).map((key) => ({
      word: key,
      definition: selectedTerms[key],
      foundWords: [],
    }));

    // For each term, break up the definition into an array
    // and collect any words that also exist in the terms
    mappedTerms.forEach((item) => {
      const termsWords = Object.keys(selectedTerms);
      const definitionWords = item.definition.split(' ');
      const foundWords = definitionWords.filter((word) =>
        termsWords.includes(word)
      );
      // Deduplicate foundWords using Set
      item.foundWords = Array.from(new Set(foundWords));
    });

    setTerms(mappedTerms);
    // Execute with no input results in full list results
    setResults(mappedTerms);
  }, [settings.termsFile]);

  const loadSettings = useCallback(() => {
    try {
      const savedSettings = localStorage.getItem('philosobabel-settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        // Merge with current integration settings to handle new integrations
        const mergedSettings = {
          ...parsedSettings,
          termsFile: parsedSettings.termsFile || 'philosophy', // Default to philosophy if not set
          integrations: {
            ...integrationManager.getIntegrationSettings(),
            ...parsedSettings.integrations,
          },
        };
        setSettings(mergedSettings);
        // Update integration manager with loaded settings
        integrationManager.updateIntegrationsFromSettings(mergedSettings.integrations);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);
  
  useEffect(() => {
    loadTerms();
    // Preload common terms for better performance
    const commonTerms = settings.termsFile === 'science' 
      ? ['astrophysics', 'cosmology', 'entropy', 'ATP', 'observation']
      : ['epistemology', 'metaphysics', 'ethics', 'ontology', 'logic'];
    setTimeout(() => {
      integrationManager.preloadCommonWords(commonTerms);
    }, 1000);
  }, [settings.termsFile, loadTerms]);

  const saveSettings = useCallback((newSettings: Settings) => {
    if (newSettings.saveSettings) {
      try {
        localStorage.setItem('philosobabel-settings', JSON.stringify(newSettings));
      } catch (error) {
        console.error('Error saving settings:', error);
      }
    } else {
      // If saveSettings is turned off, remove from localStorage
      localStorage.removeItem('philosobabel-settings');
    }
  }, []);

  const handleSettingsChange = useCallback((newSettings: Settings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
    // Update integration manager with new settings
    integrationManager.updateIntegrationsFromSettings(newSettings.integrations);
  }, [saveSettings]);

  const getDefinition = useCallback((word: string): string => {
    const term = terms.find((item) => item.word === word);
    return term ? term.definition : '';
  }, [terms]);

  return (
    <div>
      <Header
        settings={settings}
        onSettingsChange={handleSettingsChange}
        searchTerm={searchTerm}
        onSearchChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <SearchResults
        results={results}
        onWordClick={handleWordClick}
        getDefinition={getDefinition}
      />
    </div>
  );
};

export default App;
