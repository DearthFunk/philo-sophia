import React, { createContext, useContext, useState, useEffect } from 'react';
import { Term, TermsFile } from '../types';
import { useSettings } from '../hooks/useSettings';
import { useTerms } from '../hooks/useTerms';
import { useKeyboardInteractions } from '../hooks/useKeyboardInteractions';
import { useSearch } from '../hooks/useSearch';

interface SearchContextType {
  results: Term[];
  searchTerm: string;
  setResults: (results: Term[]) => void;
  setSearchTerm: (term: string) => void;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleWordClick: (word: string) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [results, setResults] = useState<Term[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { settings } = useSettings();
  const { terms } = useTerms(settings.termsFile);

  // Custom hooks for interactions
  const { handleKeyDown } = useKeyboardInteractions({
    terms,
    setSearchTerm,
    setResults
  });

  const { handleInputChange, handleWordClick } = useSearch({
    terms,
    setSearchTerm,
    setResults
  });

  // Set initial results when terms change
  useEffect(() => {
    setResults(terms);
  }, [terms]);

  // Reset search when terms file changes
  useEffect(() => {
    setSearchTerm('');
    setResults(terms);
  }, [settings.termsFile, terms]);

  const contextValue: SearchContextType = {
    results,
    searchTerm,
    setResults,
    setSearchTerm,
    handleInputChange,
    handleWordClick,
    handleKeyDown,
  };

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
};
