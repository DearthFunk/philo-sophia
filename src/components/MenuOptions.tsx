import React, { useState, useRef } from 'react';
import { Settings, TermsFile } from '../types';
import { integrationManager } from '../services/integrationManager';
import { useSettings } from '../hooks/useSettings';
import Modal from './Modal';

interface MenuOptionsProps {
  onTermsFileChange: (termsFile: TermsFile) => void;
}

const MenuOptions: React.FC<MenuOptionsProps> = ({ onTermsFileChange }) => {
  const { settings, updateSettings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

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

  const handleTermsFileChange = (termsFile: TermsFile) => {
    const newSettings = {
      ...settings,
      termsFile,
    };
    updateSettings(newSettings);
    onTermsFileChange(termsFile);
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
                  checked={settings.termsFile === TermsFile.PHILOSOPHY}
                  onChange={() => handleTermsFileChange(TermsFile.PHILOSOPHY)}
                />
                📚 Philosophy Terms
              </label>
            </div>
            <div className="menu-item">
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
