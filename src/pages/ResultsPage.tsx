import React from 'react';
import { useAppContext } from '../context/AppContext';
import TermResult from '../components/TermResult';
import './ResultsPage.css';

const ResultsPage: React.FC = () => {
  const { searchResults } = useAppContext();

  return (
    <div className="results-page">
      {searchResults.length === 0 ? (
        <div className="no-results">
          <p>No results found :(</p>
        </div>
      ) : (
        searchResults.map((term, index) => (
          <TermResult
            key={`${term.word}-${index}`}
            term={term}
          />
        ))
      )}
    </div>
  );
};

export default ResultsPage;
