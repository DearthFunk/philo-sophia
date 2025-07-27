import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import './Navigation.css';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const { settings, searchResults, searchTerm, handleInputChange, handleKeyDown } = useAppContext();
  const showAddNewButton = searchResults.length > 0;

  const handleFocus = () => {
    navigate('/');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleInfoClick = () => {
    navigate('/info');
  };

  const handleAddNewTerm = () => {
    navigate('/new');
  };
  
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
        {showAddNewButton && (
          <button
            onClick={handleAddNewTerm}
            tabIndex={3}
            aria-label="Add new term">
            +
          </button>
        )}
        <button 
          onClick={handleInfoClick}
          aria-label="Open info"
          tabIndex={99}
          className="info-button"
        >
          ⓘ
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
