import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSettings } from '../hooks/useSettings';
import { useSearchContext } from '../context/SearchContext';
import './Navigation.css';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useSettings();
  const { searchTerm, handleInputChange, handleKeyDown } = useSearchContext();

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const isOnSettingsPage = location.pathname === '/settings';

  return (
    <nav className="navigation">
      <div className="nav-content">
        <button 
          className="nav-logo"
          onClick={handleLogoClick}
          aria-label="Go to home"
        >
          🔍 Philosobabel
        </button>

        {!isOnSettingsPage && (
          <div className="nav-search">
            <input
              type="text"
              id="search-input"
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={`Search ${settings.termsFile} terms...`}
              tabIndex={2}
            />
          </div>
        )}

        <button 
          className="nav-settings"
          onClick={handleSettingsClick}
          aria-label="Open settings"
          tabIndex={1}
        >
          ⚙️ Settings
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
