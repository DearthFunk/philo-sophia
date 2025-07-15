import React, { useCallback } from 'react';
import { Term } from '../types';
import TermResult from './TermResult';

interface SearchResultsProps {
  results: Term[];
  onWordClick: (word: string) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, onWordClick }) => {
  const getDefinition = useCallback((word: string): string => {
    const term = results.find((item) => item.word === word);
    return term ? term.definition : '';
  }, [results]);

  return (
    <section id="results">
      {results.map((term, index) => (
        <TermResult
          key={`${term.word}-${index}`}
          term={term}
          onWordClick={onWordClick}
          getDefinition={getDefinition}
        />
      ))}
    </section>
  );
};

export default SearchResults;
