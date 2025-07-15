export enum TermsFile {
  PHILOSOPHY = 'philosophy',
  SCIENCE = 'science'
}

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
  termsFile: TermsFile;
  integrations: { [integrationId: string]: boolean };
}
