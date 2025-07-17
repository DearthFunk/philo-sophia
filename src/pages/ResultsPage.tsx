import React from 'react';
import { useAppContext } from '../context/AppContext';
import TermResult from '../components/TermResult';

const ResultsPage: React.FC = () => {
  const { searchResults } = useAppContext();

  return (
    <div className="results-page">
      {searchResults.map((term, index) => (
        <TermResult
          key={`${term.word}-${index}`}
          term={term}
        />
      ))}
    </div>
  );
};

export default ResultsPage;
