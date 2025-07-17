import React from 'react';
import { Settings, TermsFile } from '../types';
import { useAppContext } from '../context/AppContext';
import { integrationManager } from '../services/integrationManager';

import './SettingsPage.css';

const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useAppContext();

  const handleSettingChange = (key: keyof Settings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    updateSettings(newSettings);
  };

  const handleIntegrationToggle = (integrationId: string, enabled: boolean) => {
    const newSettings = {
      ...settings,
      integrations: {
        ...settings.integrations,
        [integrationId]: enabled,
      },
    };
    updateSettings(newSettings);
  };

  const handleTermsFileChange = (selectedTermsFile: TermsFile) => {
    const newSettings = {
      ...settings,
      selectedTermsFile,
    };
    updateSettings(newSettings);
  };

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <div className="content">
        <div className="section">
          <div className="title">Terms Selection</div>
          <div className="item">
            <label>
              <input
                type="radio"
                name="selectedTermsFile"
                checked={settings.selectedTermsFile === TermsFile.PHILOSOPHY}
                onChange={() => handleTermsFileChange(TermsFile.PHILOSOPHY)}
              />
              📚 Philosophy Terms
            </label>
          </div>
          <div className="item">
            <label>
              <input
                type="radio"
                name="selectedTermsFile"
                checked={settings.selectedTermsFile === TermsFile.SCIENCE}
                onChange={() => handleTermsFileChange(TermsFile.SCIENCE)}
              />
              🔬 Science Terms
            </label>
          </div>
        </div>

        <div className="section">
          <div className="title">General Settings</div>
          <div className="item">
            <label>
              <input
                type="checkbox"
                checked={settings.quickErase}
                onChange={(e) => handleSettingChange('quickErase', e.target.checked)}
              />
              Quick Erase (Backspace clears all)
            </label>
          </div>
          
          <div className="item">
            <label>
              <input
                type="checkbox"
                checked={settings.selectOnClick}
                onChange={(e) => handleSettingChange('selectOnClick', e.target.checked)}
              />
              Select Text on Click (Click definition to select for copying)
            </label>
          </div>
          
          <div className="item">
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

        <div className="section">
          <div className="title">Integrations</div>
          {integrationManager.getAllIntegrations().map((integration) => (
            <div key={integration.id} className="item">
              <label>
                <input
                  type="checkbox"
                  checked={settings.integrations[integration.id] || false}
                  onChange={(e) => handleIntegrationToggle(integration.id, e.target.checked)}
                />
                <span>{integration.icon}</span>
                {integration.name}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
