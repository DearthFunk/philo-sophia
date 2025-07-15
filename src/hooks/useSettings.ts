import { useState, useEffect, useCallback } from 'react';
import { Settings, TermsFile } from '../types';
import { integrationManager } from '../services/integrationManager';

const STORAGE_KEY = 'philosobabel-settings';

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>({
    quickErase: false,
    saveSettings: true,
    termsFile: TermsFile.PHILOSOPHY,
    integrations: integrationManager.getIntegrationSettings(),
  });

  const saveSettings = useCallback((newSettings: Settings) => {
    if (newSettings.saveSettings) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      } catch (error) {
        console.error('Error saving settings:', error);
      }
    } else {
      // If saveSettings is turned off, remove from localStorage
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const updateSettings = useCallback((newSettings: Settings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
    // Update integration manager with new settings
    integrationManager.updateIntegrationsFromSettings(newSettings.integrations);
  }, [saveSettings]);

  const loadSettings = useCallback(() => {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        // Merge with current integration settings to handle new integrations
        const mergedSettings = {
          ...parsedSettings,
          termsFile: parsedSettings.termsFile || TermsFile.PHILOSOPHY, // Default to philosophy if not set
          integrations: {
            ...integrationManager.getIntegrationSettings(),
            ...parsedSettings.integrations,
          },
        };
        setSettings(mergedSettings);
        // Update integration manager with loaded settings
        integrationManager.updateIntegrationsFromSettings(mergedSettings.integrations);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    settings,
    updateSettings,
  };
};
