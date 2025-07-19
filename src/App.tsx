import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import ResultsPage from './pages/ResultsPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

import './themes/default.css';
import './themes/light.css';
import './themes/dark.css';
import './themes/rainbow.css';
import './App.css';
import { Layout } from './Layout';

const THEME_STORAGE_KEY = 'philosobabel-theme';
const availableThemes = ['default', 'light', 'dark', 'rainbow'];

// Theme manager component that handles theme application
const ThemeManager: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const applyTheme = () => {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      const theme = availableThemes.includes(savedTheme!) ? savedTheme : 'default';
      
      // Remove any existing theme classes
      const body = document.body;
      const existingThemeClasses = Array.from(body.classList).filter(className => 
        className.startsWith('theme-')
      );
      existingThemeClasses.forEach(className => body.classList.remove(className));
      
      // Add the theme class
      body.classList.add(`theme-${theme}`);
    };

    // Apply theme on location change (route navigation)
    applyTheme();
  }, [location]);

  useEffect(() => {
    const applyTheme = () => {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      const theme = availableThemes.includes(savedTheme!) ? savedTheme : 'default';
      
      // Remove any existing theme classes
      const body = document.body;
      const existingThemeClasses = Array.from(body.classList).filter(className => 
        className.startsWith('theme-')
      );
      existingThemeClasses.forEach(className => body.classList.remove(className));
      
      // Add the theme class
      body.classList.add(`theme-${theme}`);
    };

    // Apply theme immediately on mount
    applyTheme();

    // Listen for storage changes (theme updates from other components)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY) {
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
  return (
    <BrowserRouter>
      <ThemeManager />
      <Routes>
        <Route path="/" element={<Layout><ResultsPage /></Layout>} />
        <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
