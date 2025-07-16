import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../hooks/useSettings';
import { useSearchContext } from '../context/SearchContext';
import './Navigation.css';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { searchTerm, handleInputChange, handleKeyDown } = useSearchContext();

  const handleFocus = () => {
    navigate('/');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  return (
    <nav className="navigation">
      <div className="nav-content">
        <button 
          onClick={handleSettingsClick}
          aria-label="Open settings"
          tabIndex={1}
        >
          ⚙️ Settings
        </button>
        <input
          type="text"
          id="search-input"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder={`Search ${settings.termsFile} terms...`}
          tabIndex={2}
        />
      </div>
    </nav>
  );
};

export default Navigation;
