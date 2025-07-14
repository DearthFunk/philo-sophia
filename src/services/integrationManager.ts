import { Integration, IntegrationData, IntegrationResult } from '../types/integrations';
import { dictionaryIntegration } from '../integrations/dictionaryIntegration';
import { wikipediaIntegration } from '../integrations/wikipediaIntegration';
import { wordsAPIIntegration } from '../integrations/wordsAPIIntegration';
import { merriamWebsterIntegration } from '../integrations/merriamWebsterIntegration';

class IntegrationManager {
  private integrations: Map<string, Integration> = new Map();
  private readonly STORAGE_PREFIX = 'philosobabel-integration-';
  private readonly STORAGE_AVAILABLE = typeof(Storage) !== 'undefined';

  constructor() {
    this.registerIntegration(dictionaryIntegration);
    this.registerIntegration(wikipediaIntegration);
    this.registerIntegration(wordsAPIIntegration);
    this.registerIntegration(merriamWebsterIntegration);
  }

  registerIntegration(integration: Integration): void {
    this.integrations.set(integration.id, integration);
  }

  unregisterIntegration(integrationId: string): void {
    this.integrations.delete(integrationId);
  }

  getIntegration(integrationId: string): Integration | undefined {
    return this.integrations.get(integrationId);
  }

  getAllIntegrations(): Integration[] {
    return Array.from(this.integrations.values());
  }

  getEnabledIntegrations(): Integration[] {
    return this.getAllIntegrations().filter(integration => integration.enabled);
  }

  toggleIntegration(integrationId: string, enabled: boolean): void {
    const integration = this.integrations.get(integrationId);
    if (integration) {
      integration.enabled = enabled;
    }
  }

  updateIntegrationsFromSettings(integrationSettings: { [integrationId: string]: boolean }): void {
    Object.entries(integrationSettings).forEach(([integrationId, enabled]) => {
      this.toggleIntegration(integrationId, enabled);
    });
  }

  getIntegrationSettings(): { [integrationId: string]: boolean } {
    const settings: { [integrationId: string]: boolean } = {};
    this.integrations.forEach((integration, id) => {
      settings[id] = integration.enabled;
    });
    return settings;
  }

  private getStorageKey(integrationId: string, word: string): string {
    return `${this.STORAGE_PREFIX}${integrationId}-${word.toLowerCase()}`;
  }

  private getCachedData(integrationId: string, word: string): IntegrationData | null {
    if (!this.STORAGE_AVAILABLE) return null;
    
    try {
      const key = this.getStorageKey(integrationId, word);
      const cached = sessionStorage.getItem(key);
      if (cached) {
        const data = JSON.parse(cached) as IntegrationData;
        console.log(`Session cache hit for ${integrationId}:${word}`);
        return data;
      }
    } catch (error) {
      console.error('Error reading from sessionStorage:', error);
    }
    return null;
  }

  private setCachedData(integrationId: string, word: string, data: IntegrationData): void {
    if (!this.STORAGE_AVAILABLE) return;
    
    try {
      const key = this.getStorageKey(integrationId, word);
      sessionStorage.setItem(key, JSON.stringify(data));
      console.log(`Cached data for ${integrationId}:${word}`);
    } catch (error) {
      console.error('Error writing to sessionStorage:', error);
      // If storage is full, clear some integration data
      this.clearOldestCacheEntries();
    }
  }

  private clearOldestCacheEntries(): void {
    if (!this.STORAGE_AVAILABLE) return;
    
    // Get all integration keys from sessionStorage
    const keysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(this.STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    
    // Remove first 10 entries to free up space
    keysToRemove.slice(0, 10).forEach(key => {
      sessionStorage.removeItem(key);
    });
  }

  async fetchIntegrationData(integrationId: string, word: string): Promise<IntegrationData> {
    // Check session cache first
    const cachedData = this.getCachedData(integrationId, word);
    if (cachedData) {
      return cachedData;
    }

    const integration = this.integrations.get(integrationId);
    if (!integration) {
      return {
        success: false,
        error: 'Integration not found',
        fallbackMessage: `Integration "${integrationId}" is not available.`
      };
    }

    if (!integration.enabled) {
      return {
        success: false,
        error: 'Integration disabled',
        fallbackMessage: `Integration "${integration.name}" is currently disabled.`
      };
    }

    try {
      console.log(`Fetching fresh data for ${integrationId}:${word}`);
      const data = await integration.fetchData(word);
      
      // Cache the result in session storage
      this.setCachedData(integrationId, word, data);

      return data;
    } catch (error) {
      console.error(`Error fetching data from ${integration.name}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        fallbackMessage: `Failed to fetch data from ${integration.name}. Please try again later.`
      };
    }
  }

  clearSessionCache(): void {
    if (!this.STORAGE_AVAILABLE) return;
    
    // Clear all integration data from session storage
    const keysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(this.STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      sessionStorage.removeItem(key);
    });
    
    console.log('Session cache cleared');
  }

  clearCacheForWord(word: string): void {
    if (!this.STORAGE_AVAILABLE) return;
    
    this.getAllIntegrations().forEach(integration => {
      const key = this.getStorageKey(integration.id, word);
      sessionStorage.removeItem(key);
    });
    
    console.log(`Session cache cleared for word: ${word}`);
  }

  getSessionCacheStats(): {
    totalItems: number;
    integrationItems: number;
    storageUsed: string;
  } {
    if (!this.STORAGE_AVAILABLE) {
      return { totalItems: 0, integrationItems: 0, storageUsed: '0 KB' };
    }
    
    let integrationItems = 0;
    let storageUsed = 0;
    
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) {
        const value = sessionStorage.getItem(key);
        if (value) {
          storageUsed += key.length + value.length;
          if (key.startsWith(this.STORAGE_PREFIX)) {
            integrationItems++;
          }
        }
      }
    }
    
    return {
      totalItems: sessionStorage.length,
      integrationItems,
      storageUsed: `${Math.round(storageUsed / 1024)} KB`
    };
  }

  preloadCommonWords(words: string[]): void {
    // Preload session cache for common philosophy terms
    words.forEach(word => {
      this.getEnabledIntegrations().forEach(integration => {
        // Fire and forget - don't await
        this.fetchIntegrationData(integration.id, word).catch(error => {
          console.log(`Preload failed for ${integration.id}:${word}`, error);
        });
      });
    });
  }
}

export const integrationManager = new IntegrationManager();
