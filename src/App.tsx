import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import ResultsPage from './pages/ResultsPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import { SearchProvider } from './context/SearchContext';
import './styles.css';

const AppContent: React.FC = () => {
  return (
    <div>
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<ResultsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <SearchProvider>
        <AppContent />
      </SearchProvider>
    </Router>
  );
};

export default App;
