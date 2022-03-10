import React from 'react';
import { Term } from '../types';
import TermResult from './TermResult';

interface SearchResultsProps {
  results: Term[];
  onWordClick: (word: string) => void;
  getDefinition: (word: string) => string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, onWordClick, getDefinition }) => {
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
