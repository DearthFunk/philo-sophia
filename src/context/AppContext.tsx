import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Term, TermsFile, Settings } from '../types';
import { integrationManager } from '../services/integrationManager';
import philosophyTerms from '../terms/philosobabel';
import scienceTerms from '../terms/sciencebabel';

// LocalStorage key for persisting user settings
const STORAGE_KEY = 'philosobabel-settings';

/**
 * Interface defining the shape of the App Context
 * This centralizes all app state and provides a single source of truth for:
 * - Search functionality (searchTerm, searchResults)
 * - User settings (settings)
 * - Terms data (terms)
 * - Event handlers for input interactions
 */
interface AppContextType {
  // Core data - the four main pieces of app state
  searchTerm: string;           // Current search input value
  settings: Settings;           // User preferences and configuration
  searchResults: Term[];        // Filtered subset of terms based on searchTerm
  terms: Term[];               // All loaded terms from selected file
  
  // Actions - functions to modify state
  setSearchTerm: (term: string) => void;                    // Update search term
  updateSettings: (newSettings: Settings) => void;          // Update and persist settings
  
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
  
  // User settings with sensible defaults
  const [settings, setSettings] = useState<Settings>({
    quickErase: false,                                    // Backspace clears entire search
    saveSettings: true,                                   // Whether to persist settings
    selectedTermsFile: TermsFile.PHILOSOPHY,             // Default to philosophy terms
    selectOnClick: true,                                 // Select text on definition click
    integrations: integrationManager.getIntegrationSettings(), // Third-party integrations
  });
  
  // All terms loaded from the selected terms file
  const [terms, setTerms] = useState<Term[]>([]);
  
  // Filtered terms based on current search - displayed in results
  const [searchResults, setSearchResults] = useState<Term[]>([]);

  // === SETTINGS MANAGEMENT ===
  
  /**
   * Saves settings to localStorage if saveSettings is enabled
   * Otherwise removes settings from localStorage
   */
  const saveSettings = useCallback((newSettings: Settings) => {
    if (newSettings.saveSettings) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      } catch (error) {
        console.error('Error saving settings:', error);
      }
    } else {
      // If user disables save settings, remove from localStorage
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

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
   * Loads settings from localStorage on app startup
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

  // === TERMS MANAGEMENT ===
  
  /**
   * Loads and processes terms from the selected terms file
   * Converts from object format to array and calculates foundWords for each term
   */
  const loadTerms = useCallback(() => {
    // Select the appropriate terms file based on user setting
    const selectedTerms = settings.selectedTermsFile === TermsFile.SCIENCE ? scienceTerms : philosophyTerms;
    
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

  // === EFFECTS ===
  
  // Load settings from localStorage on app startup
  useEffect(() => {
    loadSettings();
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

  // Reset search when user changes terms file
  // Clear search input and show all terms from the new file
  useEffect(() => {
    setSearchTerm('');
    setSearchResults(terms);
  }, [settings.selectedTermsFile, terms]);

  // === CONTEXT VALUE ===
  // Package all state and functions into the context value
  const contextValue: AppContextType = {
    // State
    searchTerm,        // Current search input
    settings,          // User preferences
    searchResults,     // Filtered terms for display
    terms,            // All loaded terms
    // Actions
    setSearchTerm,     // Update search term (triggers search via useEffect)
    updateSettings,    // Update and persist settings
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
