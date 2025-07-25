import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import ResultsPage from './pages/ResultsPage';
import SettingsPage from './pages/SettingsPage';
import InfoPage from './pages/InfoPage';
import NotFoundPage from './pages/NotFoundPage';

import './themes/default.css';
import './themes/light.css';
import './themes/dark.css';
import './themes/rainbow.css';
import './App.css';
import { Layout } from './Layout';

const THEME_STORAGE_KEY = 'philosobabel-theme';
const CUSTOMIZE_STORAGE_KEY = 'philosobabel-customize';
const availableThemes = ['default', 'light', 'dark', 'rainbow'];

// Theme manager component that handles theme application
const ThemeManager: React.FC = () => {
  const location = useLocation();

  // Get the effective theme based on customize setting from localStorage
  const getEffectiveTheme = () => {
    try {
      const customizeEnabledStr = localStorage.getItem(CUSTOMIZE_STORAGE_KEY);
      const customizeEnabled = customizeEnabledStr ? JSON.parse(customizeEnabledStr) : false;
      
      if (!customizeEnabled) {
        return 'default';
      }
      
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      return availableThemes.includes(savedTheme!) ? savedTheme : 'default';
    } catch (error) {
      console.error('Error reading theme settings:', error);
      return 'default';
    }
  };

  const applyTheme = () => {
    const theme = getEffectiveTheme();
    
    // Remove any existing theme classes
    const body = document.body;
    const existingThemeClasses = Array.from(body.classList).filter(className => 
      className.startsWith('theme-')
    );
    existingThemeClasses.forEach(className => body.classList.remove(className));
    
    // Add the theme class
    body.classList.add(`theme-${theme}`);
  };

  useEffect(() => {
    // Apply theme on location change (route navigation)
    applyTheme();
  }, [location]);

  useEffect(() => {
    // Apply theme immediately on mount
    applyTheme();

    // Listen for storage changes (theme and customize setting updates)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY || e.key === CUSTOMIZE_STORAGE_KEY) {
        applyTheme();
      }
    };

    // Listen for custom theme change events
    const handleThemeChange = () => {
      applyTheme();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('theme-changed', handleThemeChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('theme-changed', handleThemeChange);
    };
  }, []);

  return null;
};

const App: React.FC = () => {
  // Set basename for GitHub Pages deployment
  const basename = process.env.NODE_ENV === 'production' ? '/philosobabel' : '/';
  
  return (
    <BrowserRouter basename={basename}>
      <ThemeManager />
      <Routes>
        <Route path="/" element={<Layout><ResultsPage /></Layout>} />
        <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
        <Route path="/info" element={<Layout><InfoPage /></Layout>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
