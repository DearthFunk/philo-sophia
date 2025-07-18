import React, { useState } from 'react';
import { Settings, TermsFile } from '../types';
import { useAppContext } from '../context/AppContext';
import { integrationManager } from '../services/integrationManager';

import './SettingsPage.css';

const SettingsPage: React.FC = () => {
  const { settings, updateSettings, customizeEnabled, setCustomizeEnabled } = useAppContext();
  const [cacheStats, setCacheStats] = useState(() => integrationManager.getSessionCacheStats());
  const [cacheCleared, setCacheCleared] = useState(false);

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

  const handleClearCache = () => {
    // Clear integration cache
    integrationManager.clearSessionCache();
    setCacheStats(integrationManager.getSessionCacheStats());
    
    // Reset all settings to defaults and disable customize
    setCustomizeEnabled(false);
    
    // Clear settings from localStorage
    localStorage.removeItem('philosobabel-settings');
    localStorage.removeItem('philosobabel-customize');
    
    setCacheCleared(true);
    
    // Reset the confirmation message after 3 seconds
    setTimeout(() => {
      setCacheCleared(false);
    }, 3000);
  };

  const refreshCacheStats = () => {
    setCacheStats(integrationManager.getSessionCacheStats());
  };

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <div className="content">
        <div className="section">
          <div className="title">Customize Settings</div>
          <div className="item">
            <label>
              <input
                type="checkbox"
                checked={customizeEnabled}
                onChange={(e) => setCustomizeEnabled(e.target.checked)}
              />
              Customize (Enable custom settings)
            </label>
          </div>
        </div>

        <div className="section">
          <div className="title">Terms Selection</div>
          <div className="item">
            <label style={{ opacity: customizeEnabled ? 1 : 0.5 }}>
              <input
                type="radio"
                name="selectedTermsFile"
                checked={settings.selectedTermsFile === TermsFile.PHILOSOPHY}
                onChange={() => handleTermsFileChange(TermsFile.PHILOSOPHY)}
                disabled={!customizeEnabled}
              />
              📚 Philosophy Terms
            </label>
          </div>
          <div className="item">
            <label style={{ opacity: customizeEnabled ? 1 : 0.5 }}>
              <input
                type="radio"
                name="selectedTermsFile"
                checked={settings.selectedTermsFile === TermsFile.SCIENCE}
                onChange={() => handleTermsFileChange(TermsFile.SCIENCE)}
                disabled={!customizeEnabled}
              />
              🔬 Science Terms
            </label>
          </div>
        </div>

        <div className="section">
          <div className="title">General Settings</div>
          <div className="item">
            <label style={{ opacity: customizeEnabled ? 1 : 0.5 }}>
              <input
                type="checkbox"
                checked={settings.quickErase}
                onChange={(e) => handleSettingChange('quickErase', e.target.checked)}
                disabled={!customizeEnabled}
              />
              Quick Erase (Backspace clears all)
            </label>
          </div>
          
          <div className="item">
            <label style={{ opacity: customizeEnabled ? 1 : 0.5 }}>
              <input
                type="checkbox"
                checked={settings.selectOnClick}
                onChange={(e) => handleSettingChange('selectOnClick', e.target.checked)}
                disabled={!customizeEnabled}
              />
              Select Text on Click (Click definition to select for copying)
            </label>
          </div>
        </div>

        <div className="section">
          <div className="title">Integrations</div>
          {integrationManager.getAllIntegrations().map((integration) => (
            <div key={integration.id} className="item">
              <label style={{ opacity: customizeEnabled ? 1 : 0.5 }}>
                <input
                  type="checkbox"
                  checked={settings.integrations[integration.id] || false}
                  onChange={(e) => handleIntegrationToggle(integration.id, e.target.checked)}
                  disabled={!customizeEnabled}
                />
                <span>{integration.icon}</span>
                {integration.name}
              </label>
            </div>
          ))}
        </div>

        <div className="section">
          <div className="title">Cache Management</div>
          <div className="item cache-stats">
            <div className="cache-info">
              <p><strong>Cache Statistics:</strong></p>
              <p>Integration items: {cacheStats.integrationItems}</p>
              <p>Total items: {cacheStats.totalItems}</p>
              <p>Storage used: {cacheStats.storageUsed}</p>
            </div>
            <div className="cache-actions">
              <button 
                className="refresh-button"
                onClick={refreshCacheStats}
              >
                🔄 Refresh Stats
              </button>
              <button 
                className="clear-cache-button"
                onClick={handleClearCache}
              >
                🗑️ Clear All Data
              </button>
              {cacheCleared && (
                <p className="cache-cleared-message">✅ Cache and settings cleared successfully!</p>
              )}
            </div>
          </div>
          <div className="item">
            <p className="cache-help">
              <strong>Tip:</strong> Right-click any integration button (📖 🌐 📝 📘) to clear cache for that specific term.
            </p>
            <p className="cache-help">
              <strong>Clear All Data:</strong> Clears integration cache, resets all settings to defaults, and disables customize mode.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
