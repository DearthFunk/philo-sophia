import React, { useState, useEffect, useCallback, useRef } from 'react';
import termsData from './philosobabel';
import { Term } from './types';
import SearchResults from './components/SearchResults';
import './styles.css';

const App: React.FC = () => {
  const [terms, setTerms] = useState<Term[]>([]);
  const [results, setResults] = useState<Term[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadTerms();
    // Auto-focus the input on app load
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const loadTerms = useCallback(() => {
    // Map the terms to an array of objects
    const mappedTerms: Term[] = Object.keys(termsData).map((key) => ({
      word: key,
      definition: termsData[key],
      foundWords: [],
    }));

    // For each term, break up the definition into an array
    // and collect any words that also exist in the terms
    mappedTerms.forEach((item) => {
      const termsWords = Object.keys(termsData);
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
  }, []);

  const getDefinition = useCallback((word: string): string => {
    const term = terms.find((item) => item.word === word);
    return term ? term.definition : '';
  }, [terms]);

  const handleWordClick = useCallback((word: string) => {
    setSearchTerm(word);
    const filteredResults = terms.filter((definition) =>
      definition.word.includes(word)
    );
    setResults(filteredResults);
    // Refocus the input after clicking a word
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  }, [terms]);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    const filteredResults = terms.filter((definition) =>
      definition.word.includes(value)
    );
    setResults(filteredResults);
  }, [terms]);

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        id="search-input"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Search philosophy terms..."
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
