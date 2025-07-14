import React, { useState, useRef } from 'react';
import { Settings } from '../types';
import { integrationManager } from '../services/integrationManager';
import Modal from './Modal';

interface MenuOptionsProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

const MenuOptions: React.FC<MenuOptionsProps> = ({ settings, onSettingsChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

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

  const handleTermsFileChange = (termsFile: 'philosophy' | 'science') => {
    const newSettings = {
      ...settings,
      termsFile,
    };
    onSettingsChange(newSettings);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMenu();
    }
  };

  return (
    <div className="menu-options">
      <button 
        ref={buttonRef}
        className="menu-toggle"
        onClick={toggleMenu}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-label="Menu options"
        tabIndex={1}
      >
        ⚙️ Menu
      </button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        triggerElement={buttonRef.current}
        className="menu-modal"
      >
        <div className="menu-dropdown">
          <div className="menu-section">
            <div className="menu-section-title">Terms Selection</div>
            <div className="menu-item">
              <label>
                <input
                  type="radio"
                  name="termsFile"
                  checked={settings.termsFile === 'philosophy'}
                  onChange={() => handleTermsFileChange('philosophy')}
                />
                📚 Philosophy Terms
              </label>
            </div>
            <div className="menu-item">
              <label>
                <input
                  type="radio"
                  name="termsFile"
                  checked={settings.termsFile === 'science'}
                  onChange={() => handleTermsFileChange('science')}
                />
                🔬 Science Terms
              </label>
            </div>
          </div>

          <div className="menu-section">
            <div className="menu-section-title">General Settings</div>
            <div className="menu-item">
              <label>
                <input
                  type="checkbox"
                  checked={settings.quickErase}
                  onChange={(e) => handleSettingChange('quickErase', e.target.checked)}
                />
                Quick Erase (Backspace clears all)
              </label>
            </div>
            
            <div className="menu-item">
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

          <div className="menu-section">
            <div className="menu-section-title">Integrations</div>
            {integrationManager.getAllIntegrations().map((integration) => (
              <div key={integration.id} className="menu-item">
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
      </Modal>
    </div>
  );
};

export default MenuOptions;
