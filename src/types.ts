export interface Term {
  word: string;
  definition: string;
  foundWords: string[];
}

export interface Terms {
  [key: string]: string;
}

export interface Settings {
  quickErase: boolean;
  saveSettings: boolean;
  termsFile: 'philosophy' | 'science';
  integrations: { [integrationId: string]: boolean };
}
