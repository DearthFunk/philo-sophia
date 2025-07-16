import React from 'react';
import SearchResults from '../components/SearchResults';
import { useSearchContext } from '../context/SearchContext';

const ResultsPage: React.FC = () => {
  const { results, handleWordClick } = useSearchContext();

  return (
    <div className="results-page">
      <SearchResults
        results={results}
        onWordClick={handleWordClick}
      />
    </div>
  );
};

export default ResultsPage;
