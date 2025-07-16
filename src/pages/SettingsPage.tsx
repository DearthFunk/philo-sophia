import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TermsFile } from '../types';
import Dropdown from '../components/Dropdown';
import { useSettings } from '../hooks/useSettings';
import './SettingsPage.css';

const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const navigate = useNavigate();

  const handleTermsFileChange = (termsFile: TermsFile) => {
    // Navigate back to results page when terms file changes
    navigate('/');
  };

  const handleBackToResults = () => {
    navigate('/');
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <button 
          className="back-button"
          onClick={handleBackToResults}
          aria-label="Back to results"
        >
          ← Back to Results
        </button>
        <h1>Settings</h1>
      </div>

      <div className="settings-content">
        <Dropdown
          settings={settings}
          onSettingsChange={updateSettings}
          onTermsFileChange={handleTermsFileChange}
        />
      </div>
    </div>
  );
};

export default SettingsPage;
