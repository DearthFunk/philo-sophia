import { Integration, IntegrationData } from '../types/integrations';
import { dictionaryIntegration } from '../integrations/dictionaryIntegration';
import { wikipediaIntegration } from '../integrations/wikipediaIntegration';
import { wordsAPIIntegration } from '../integrations/wordsAPIIntegration';
import { merriamWebsterIntegration } from '../integrations/merriamWebsterIntegration';
import { storageService } from './storage';

class IntegrationManager {
  private integrations: Map<string, Integration> = new Map();

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


  async fetchIntegrationData(integrationId: string, word: string): Promise<IntegrationData> {
    // Check session cache first
    const cachedData = storageService.getCachedData(integrationId, word);
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
      storageService.setCachedData(integrationId, word, data);

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
    storageService.clearSessionCache();
  }

  getSessionCacheStats(): {
    totalItems: number;
    integrationItems: number;
    storageUsed: string;
  } {
    return storageService.getSessionCacheStats();
  }
}

export const integrationManager = new IntegrationManager();
