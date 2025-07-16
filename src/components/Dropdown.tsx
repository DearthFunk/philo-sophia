import React from 'react';
import { Settings, TermsFile } from '../types';
import { integrationManager } from '../services/integrationManager';
import './Dropdown.css';

interface DropdownProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  onTermsFileChange: (termsFile: TermsFile) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  settings,
  onSettingsChange,
  onTermsFileChange
}) => {
  const handleSettingChange = (key: keyof Settings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    onSettingsChange(newSettings);
  };

  const handleIntegrationToggle = (integrationId: string, enabled: boolean) => {
    const newSettings = {
      ...settings,
      integrations: {
        ...settings.integrations,
        [integrationId]: enabled,
      },
    };
    onSettingsChange(newSettings);
  };

  const handleTermsFileChange = (termsFile: TermsFile) => {
    const newSettings = {
      ...settings,
      termsFile,
    };
    onSettingsChange(newSettings);
    onTermsFileChange(termsFile);
  };

  return (
    <div className="dropdown">
      <div className="dropdown-section">
        <div className="dropdown-section-title">Terms Selection</div>
        <div className="dropdown-item">
          <label>
            <input
              type="radio"
              name="termsFile"
              checked={settings.termsFile === TermsFile.PHILOSOPHY}
              onChange={() => handleTermsFileChange(TermsFile.PHILOSOPHY)}
            />
            📚 Philosophy Terms
          </label>
        </div>
        <div className="dropdown-item">
          <label>
            <input
              type="radio"
              name="termsFile"
              checked={settings.termsFile === TermsFile.SCIENCE}
              onChange={() => handleTermsFileChange(TermsFile.SCIENCE)}
            />
            🔬 Science Terms
          </label>
        </div>
      </div>

      <div className="dropdown-section">
        <div className="dropdown-section-title">General Settings</div>
        <div className="dropdown-item">
          <label>
            <input
              type="checkbox"
              checked={settings.quickErase}
              onChange={(e) => handleSettingChange('quickErase', e.target.checked)}
            />
            Quick Erase (Backspace clears all)
          </label>
        </div>
        
        <div className="dropdown-item">
          <label>
            <input
              type="checkbox"
              checked={settings.saveSettings}
              onChange={(e) => handleSettingChange('saveSettings', e.target.checked)}
            />
            Save Settings
          </label>
        </div>
      </div>

      <div className="dropdown-section">
        <div className="dropdown-section-title">Integrations</div>
        {integrationManager.getAllIntegrations().map((integration) => (
          <div key={integration.id} className="dropdown-item">
            <label>
              <input
                type="checkbox"
                checked={settings.integrations[integration.id] || false}
                onChange={(e) => handleIntegrationToggle(integration.id, e.target.checked)}
              />
              <span className="integration-menu-icon">{integration.icon}</span>
              {integration.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dropdown;
