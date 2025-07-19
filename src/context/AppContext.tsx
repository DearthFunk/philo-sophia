import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Term, TermsFile, Settings, TermsFileType } from '../types';
import { integrationManager } from '../services/integrationManager';
import philosophyTerms from '../terms/philosobabel.json';
import scienceTerms from '../terms/sciencebabel.json';
import { storageService } from '../services/storage';

// LocalStorage keys for persisting user settings
const STORAGE_KEY = 'philosobabel-settings';
const CUSTOMIZE_KEY = 'philosobabel-customize';

/**
 * Interface defining the shape of the App Context
 * This centralizes all app state and provides a single source of truth for:
 * - Search functionality (searchTerm, searchResults)
 * - User settings (settings)
 * - Terms data (terms)
 * - Event handlers for input interactions
 */
interface AppContextType {
  // Core data - the main pieces of app state
  searchTerm: string;           // Current search input value
  settings: Settings;           // User preferences and configuration
  searchResults: Term[];        // Filtered subset of terms based on searchTerm
  terms: Term[];               // All loaded terms from selected file
  customizeEnabled: boolean;    // Whether custom settings are enabled
  
  // Actions - functions to modify state
  setSearchTerm: (term: string) => void;                    // Update search term
  updateSettings: (newSettings: Settings) => void;          // Update and persist settings
  setCustomizeEnabled: (enabled: boolean) => void;         // Toggle customize mode
  addCustomTerm: (word: string, definition: string) => void; // Add a new custom term
  updateCustomTerm: (word: string, definition: string) => void; // Update existing custom term
  
  // Handlers - event handlers for UI interactions
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;  // Search input typing
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;    // Keyboard shortcuts
}

// Create the context with undefined default (forces provider usage)
const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * Custom hook to access the App Context
 * Throws an error if used outside of AppProvider to catch development mistakes
 */
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

/**
 * Main App Context Provider Component
 * Manages all centralized state and provides it to child components
 * Handles settings persistence, terms loading, and search functionality
 */
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // === STATE MANAGEMENT ===
  
  // Current search input value - updated as user types
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Default settings - used when customize is disabled
  const getDefaultSettings = useCallback((): Settings => {
    // Get all integrations but only enable dictionary by default
    const allIntegrations = integrationManager.getIntegrationSettings();
    const defaultIntegrations: { [integrationId: string]: boolean } = {};
    
    // Set all integrations to false except dictionary
    Object.keys(allIntegrations).forEach(integrationId => {
      defaultIntegrations[integrationId] = integrationId === 'dictionary';
    });
    
    return {
      quickErase: false,                                    // Backspace clears entire search
      selectedTermsFile: TermsFile.PHILOSOPHY,             // Default to philosophy terms
      selectOnClick: true,                                 // Select text on definition click
      integrations: defaultIntegrations,                    // Only dictionary enabled by default
    };
  }, []);
  
  // Whether customize mode is enabled
  const [customizeEnabled, setCustomizeEnabledState] = useState<boolean>(false);
  
  // User settings - defaults or customized based on customize mode
  const [settings, setSettings] = useState<Settings>(getDefaultSettings);
  
  // All terms loaded from the selected terms file
  const [terms, setTerms] = useState<Term[]>([]);
  
  // Filtered terms based on current search - displayed in results
  const [searchResults, setSearchResults] = useState<Term[]>([]);

  // === SETTINGS MANAGEMENT ===
  
  /**
   * Loads settings from localStorage when customize is enabled
   * Merges saved settings with defaults to handle new settings added over time
   */
  const loadSettings = useCallback(() => {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        const mergedSettings = {
          ...parsedSettings,
          // Provide fallbacks for settings that might not exist in saved data
selectedTermsFile: parsedSettings.selectedTermsFile || TermsFile.PHILOSOPHY,
          customTermsFiles: parsedSettings.customTermsFiles || [],
          selectOnClick: parsedSettings.selectOnClick !== undefined ? parsedSettings.selectOnClick : true,
          integrations: {
            // Start with current integrations (handles new integrations)
            ...integrationManager.getIntegrationSettings(),
            // Override with user's saved preferences
            ...parsedSettings.integrations,
          },
        };
        setSettings(mergedSettings);
        integrationManager.updateIntegrationsFromSettings(mergedSettings.integrations);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, []);

  /**
   * Saves settings to localStorage if customize is enabled
   * Otherwise removes settings from localStorage
   */
  const saveSettings = useCallback((newSettings: Settings) => {
    if (customizeEnabled) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      } catch (error) {
        console.error('Error saving settings:', error);
      }
    } else {
      // If customize is disabled, remove from localStorage
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [customizeEnabled]);

  /**
   * Updates settings in state, persists them, and updates integrations
   * This is the main function components use to change settings
   */
  const updateSettings = useCallback((newSettings: Settings) => {
    setSettings(newSettings);                           // Update React state
    saveSettings(newSettings);                          // Persist to localStorage
    integrationManager.updateIntegrationsFromSettings(newSettings.integrations); // Update integrations
  }, [saveSettings]);

  /**
   * Toggles customize mode on/off
   * When enabled, loads settings from localStorage
   * When disabled, saves current settings first, then resets to defaults
   */
  const setCustomizeEnabled = useCallback((enabled: boolean) => {
    setCustomizeEnabledState(enabled);
    
    // Save customize preference
    try {
      localStorage.setItem(CUSTOMIZE_KEY, JSON.stringify(enabled));
    } catch (error) {
      console.error('Error saving customize preference:', error);
    }
    
    if (enabled) {
      // Load settings from localStorage
      loadSettings();
    } else {
      // Save current settings before switching to defaults
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch (error) {
        console.error('Error saving settings before disabling customize:', error);
      }
      
      // Reset to defaults (but keep settings saved in localStorage)
      const defaultSettings = getDefaultSettings();
      setSettings(defaultSettings);
      integrationManager.updateIntegrationsFromSettings(defaultSettings.integrations);
    }
  }, [getDefaultSettings, loadSettings, settings]);

  // === TERMS MANAGEMENT ===
  
  /**
   * Loads and processes terms from the selected terms file
   * Converts from object format to array and calculates foundWords for each term
   */
  const loadTerms = useCallback(() => {
    // Select the appropriate terms file based on user setting
    let selectedTerms: { [key: string]: string };
    
    if (settings.selectedTermsFile === TermsFile.SCIENCE) {
      selectedTerms = scienceTerms as { [key: string]: string };
    } else if (settings.selectedTermsFile === TermsFile.PHILOSOPHY) {
      selectedTerms = philosophyTerms as { [key: string]: string };
    } else {
      // Handle custom files
      const customTerms = storageService.getCustomTermsFile(settings.selectedTermsFile);
      if (customTerms) {
        selectedTerms = customTerms;
      } else {
        // Fallback to philosophy terms if custom file not found
        selectedTerms = philosophyTerms as { [key: string]: string };
      }
    }
    
    // Convert from object format {word: definition} to array format
    const mappedTerms: Term[] = Object.keys(selectedTerms).map((key) => ({
      word: key,
      definition: selectedTerms[key],
      foundWords: [], // Will be populated below
    }));

    // Process foundWords for each term - words in definition that are also terms
    mappedTerms.forEach((item) => {
      const termsWords = Object.keys(selectedTerms);      // All available term words
      const definitionWords = item.definition.split(' '); // Words in this definition
      const foundWords = definitionWords.filter((word) =>
        termsWords.includes(word)                         // Keep words that are also terms
      );
      item.foundWords = Array.from(new Set(foundWords));  // Remove duplicates
    });

    setTerms(mappedTerms);
  }, [settings.selectedTermsFile]);

  // === SEARCH FUNCTIONALITY ===
  
  /**
   * Filters terms based on search input
   * Searches both term words and definitions (case-insensitive)
   */
  const performSearch = useCallback((term: string) => {
    // Empty search shows all terms
    if (!term.trim()) {
      setSearchResults(terms);
      return;
    }

    // Filter terms that match search in word or definition
    const filtered = terms.filter(termObj =>
      termObj.word.toLowerCase().includes(term.toLowerCase()) ||
      termObj.definition.toLowerCase().includes(term.toLowerCase())
    );
    setSearchResults(filtered);
  }, [terms]);

  // === EVENT HANDLERS ===
  
  /**
   * Handles typing in the search input
   * Updates searchTerm state - search is performed via useEffect
   */
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    // performSearch is now handled by useEffect when searchTerm changes
  }, []);

  /**
   * Handles keyboard shortcuts in the search input
   * Currently supports: Backspace to clear search (if quickErase is enabled)
   */
  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && settings.quickErase) {
      event.preventDefault();  // Prevent default backspace behavior
      setSearchTerm('');      // Clear the search term
      // searchResults will be updated by useEffect when searchTerm changes
    }
  }, [settings.quickErase]);

  // === CUSTOM TERMS MANAGEMENT ===
  
  /**
   * Adds a new custom term to the current terms list
   */
  const addCustomTerm = useCallback((word: string, definition: string = '') => {
    const newTerm: Term = {
      word: word.trim(),
      definition: definition.trim(),
      foundWords: [],
      isCustom: true
    };
    
    setTerms(prevTerms => {
      // Check if term already exists
      const existingIndex = prevTerms.findIndex(t => t.word.toLowerCase() === word.toLowerCase());
      if (existingIndex !== -1) {
        // Update existing term
        const updatedTerms = [...prevTerms];
        updatedTerms[existingIndex] = { ...updatedTerms[existingIndex], ...newTerm };
        return updatedTerms;
      } else {
        // Add new term
        return [...prevTerms, newTerm];
      }
    });
  }, []);
  
  /**
   * Updates an existing custom term's definition and recalculates foundWords
   */
  const updateCustomTerm = useCallback((word: string, definition: string) => {
    setTerms(prevTerms => {
      const updatedTerms = prevTerms.map(term => {
        if (term.word === word && term.isCustom) {
          // Get all available term words for cross-reference detection
          const allTermWords = prevTerms.map(t => t.word);
          
          // Find words in the new definition that are also terms
          const definitionWords = definition.trim().split(' ');
          const foundWords = definitionWords.filter(defWord =>
            allTermWords.includes(defWord) && defWord !== word // Exclude self-reference
          );
          
          return {
            ...term,
            definition: definition.trim(),
            foundWords: Array.from(new Set(foundWords)) // Remove duplicates
          };
        }
        return term;
      });
      
      return updatedTerms;
    });
  }, []);

  // === EFFECTS ===
  
  // Load customize preference and settings on app startup
  useEffect(() => {
    try {
      const savedCustomize = localStorage.getItem(CUSTOMIZE_KEY);
      if (savedCustomize) {
        const customizeEnabled = JSON.parse(savedCustomize);
        setCustomizeEnabledState(customizeEnabled);
        if (customizeEnabled) {
          loadSettings();
        }
      }
    } catch (error) {
      console.error('Error loading customize preference:', error);
    }
  }, [loadSettings]);

  // Load terms when settings change (specifically selectedTermsFile)
  useEffect(() => {
    loadTerms();
  }, [loadTerms]);

  // Initialize search results with all terms when terms are loaded
  useEffect(() => {
    setSearchResults(terms);
  }, [terms]);

  // Perform search automatically when searchTerm changes
  // This ensures search happens whether term is set via typing or programmatically
  useEffect(() => {
    performSearch(searchTerm);
  }, [searchTerm, performSearch]);

  // Reset search when user changes terms file (but not when adding custom terms)
  // Clear search input and show all terms from the new file
  useEffect(() => {
    setSearchTerm('');
  }, [settings.selectedTermsFile]); // Only reset on terms file change, not when terms array changes

  // === CONTEXT VALUE ===
  // Package all state and functions into the context value
  const contextValue: AppContextType = {
    // State
    searchTerm,        // Current search input
    settings,          // User preferences
    searchResults,     // Filtered terms for display
    terms,            // All loaded terms
    customizeEnabled,  // Whether customize mode is enabled
    // Actions
    setSearchTerm,     // Update search term (triggers search via useEffect)
    updateSettings,    // Update and persist settings
    setCustomizeEnabled, // Toggle customize mode
    addCustomTerm,     // Add new custom term
    updateCustomTerm,  // Update existing custom term
    // Event handlers
    handleInputChange, // Handle search input typing
    handleKeyDown,     // Handle keyboard shortcuts
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
