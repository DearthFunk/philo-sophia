import React, { useState } from 'react';
import { Settings, TermsFile, TermsFileType } from '../types';
import { useAppContext } from '../context/AppContext';
import { integrationManager } from '../services/integrationManager';
import { storageService } from '../services/storage';

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

  const handleTermsFileChange = (selectedTermsFile: TermsFileType) => {
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string);
          const fileName = file.name;
          
          // Validate that the JSON contains key-value pairs (terms)
          if (typeof jsonData !== 'object' || jsonData === null) {
            alert('Invalid JSON file. Please upload a valid terms list with key-value pairs.');
            return;
          }
          
          if (settings.customTermsFiles?.includes(fileName)) {
            alert('A file with this name has already been added. Choose a different file or rename it.');
          } else {
            // Store the file data
            storageService.storeCustomTermsFile(fileName, jsonData);
            
            // Update settings to include this file
            const newTermsFiles = settings.customTermsFiles ? [...settings.customTermsFiles, fileName] : [fileName];
            updateSettings({
              ...settings,
              customTermsFiles: newTermsFiles,
            });
          }
        } catch (error) {
          alert('Invalid JSON file. Please upload a valid terms list.');
        }
      };
      reader.readAsText(file);
    }
    
    // Clear the input so the same file can be uploaded again
    event.target.value = '';
  };

  const handleFileDelete = (fileName: string) => {
    // Remove from storage
    storageService.removeCustomTermsFile(fileName);
    
    // Update settings to remove this file
    const updatedTermsFiles = settings.customTermsFiles?.filter(name => name !== fileName);
    
    // If the deleted file was the currently selected one, switch to default
    const newSelectedTermsFile = settings.selectedTermsFile === fileName ? TermsFile.PHILOSOPHY : settings.selectedTermsFile;
    
    updateSettings({
      ...settings,
      customTermsFiles: updatedTermsFiles,
      selectedTermsFile: newSelectedTermsFile,
    });
  };

  return (
    <div className={`settings-page ${!customizeEnabled ? 'customize-disabled' : ''}`}>
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
            <label>
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
            <label>
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
          {customizeEnabled && settings.customTermsFiles && settings.customTermsFiles.length > 0 && (
            settings.customTermsFiles.map(fileName => (
              <div key={fileName} className="item">
                <label>
                  <input
                    type="radio"
                    name="selectedTermsFile"
                    checked={settings.selectedTermsFile === fileName}
                    onChange={() => handleTermsFileChange(fileName)}
                    disabled={!customizeEnabled}
                  />
                  📄 {fileName}
                </label>
                <button 
                  className="delete-button"
                  onClick={() => handleFileDelete(fileName)}
                  title="Delete this file"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
          {customizeEnabled && (
            <div className="item">
              <div className="file-upload-section">
                <button 
                  className="file-upload-button"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                + Add Custom Terms File (.json)
                </button>
                <input
                  id="file-upload"
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                />
              </div>
            </div>
          )}
        </div>

        <div className="section">
          <div className="title">General Settings</div>
          <div className="item">
            <label>
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
            <label>
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
              <label>
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
