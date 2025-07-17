import { IntegrationData } from '../types/integrations';

class StorageService {
  private readonly STORAGE_PREFIX = 'philosobabel-integration-';
  private readonly STORAGE_AVAILABLE = typeof(Storage) !== 'undefined';

  private getStorageKey(integrationId: string, word: string): string {
    return `${this.STORAGE_PREFIX}${integrationId}-${word.toLowerCase()}`;
  }

  getCachedData(integrationId: string, word: string): IntegrationData | null {
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

  setCachedData(integrationId: string, word: string, data: IntegrationData): void {
    if (!this.STORAGE_AVAILABLE) return;
    
    try {
      const key = this.getStorageKey(integrationId, word);
      sessionStorage.setItem(key, JSON.stringify(data));
      console.log(`Set Cached data for ${integrationId}:${word}`);
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
}

export const storageService = new StorageService();
