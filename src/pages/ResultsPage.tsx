import React from 'react';
import { useAppContext } from '../context/AppContext';
import TermResult from '../components/TermResult';
import './ResultsPage.css';

const ResultsPage: React.FC = () => {
  const { searchResults, searchTerm, addCustomTerm, setSearchTerm } = useAppContext();

  const handleAddTerm = () => {
    if (searchTerm.trim()) {
      const termToAdd = searchTerm.trim();
      addCustomTerm(termToAdd, '');
      // Keep the search term in the input to show the newly added term
      setSearchTerm(termToAdd);
    }
  };

  return (
    <div className="results-page">
      {searchResults.length === 0 ? (
        <div className="no-results">
          <p>No results found :(</p>
          {searchTerm.trim() && (
            <button onClick={handleAddTerm} className="add-term-button">
              Add "{searchTerm}" as a new term
            </button>
          )}
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
