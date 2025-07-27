import React from 'react';
import { useAppContext } from '../context/AppContext';
import TermResult from '../components/TermResult';
import './ResultsPage.css';
import { useNavigate } from 'react-router-dom';

const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { searchResults, searchTerm} = useAppContext();

  const handleAddTerm = () => {
    navigate('/new');
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
