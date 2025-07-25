import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import './Navigation.css';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const { settings, searchTerm, handleInputChange, handleKeyDown, addCustomTerm, setSearchTerm, terms, searchResults } = useAppContext();

  const handleFocus = () => {
    navigate('/');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleInfoClick = () => {
    navigate('/info');
  };

  const addNewTerm = () => {
    if (searchTerm.trim() && !termExists(searchTerm.trim())) {
      const termToAdd = searchTerm.trim();
      addCustomTerm(termToAdd, '');
      // Keep the search term in the input to show the newly added term
      setSearchTerm(termToAdd);
    }
  };

  // Helper function to check if the term already exists
  const termExists = (term: string): boolean => {
    if (!term) return false;
    const exists = terms.some(existingTerm => 
      existingTerm.word.toLowerCase() === term.toLowerCase()
    );
    return exists;
  };
  
  // Determine button visibility and state
  const isButtonDisabled = termExists(searchTerm.trim());
  const shouldShowButton = !(searchResults.length === 0);
  return (
    <nav className="navigation">
      <div className="nav-content">
        <button 
          onClick={handleSettingsClick}
          aria-label="Open settings"
          tabIndex={1}
        >
          Settings
        </button>
        <input
          type="text"
          id="search-input"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder={`Search ${settings.selectedTermsFile} terms...`}
          tabIndex={2}
        />
        {shouldShowButton && (
          <button
            onClick={addNewTerm}
            disabled={isButtonDisabled}
            tabIndex={3}
            aria-label="Add new term">
            +
          </button>
        )}
        <button 
          onClick={handleInfoClick}
          aria-label="Open info"
          tabIndex={4}
          className="info-button"
        >
          ⓘ
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
