import React, { useState, useEffect } from 'react';
import { Term, TermsFile } from './types';
import SearchResults from './components/SearchResults';
import Header from './components/Header';
import { useSettings } from './hooks/useSettings';
import { useTerms } from './hooks/useTerms';
import { useKeyboardInteractions } from './hooks/useKeyboardInteractions';
import { useSearch } from './hooks/useSearch';
import './styles.css';

const App: React.FC = () => {
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

  const handleTermsFileChange = (termsFile: TermsFile) => {
    // Reset search when terms file changes
    setSearchTerm('');
    setResults([]);
  };

  // Set initial results when terms change
  useEffect(() => {
    setResults(terms);
  }, [terms]);

  return (
    <div>
      <Header
        searchTerm={searchTerm}
        onSearchChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onTermsFileChange={handleTermsFileChange}
      />
      <SearchResults
        results={results}
        onWordClick={handleWordClick}
      />
    </div>
  );
};

export default App;
