export enum TermsFile {
  PHILOSOPHY = 'philosophy',
  SCIENCE = 'science'
}

// For handling custom terms files, we'll use strings instead of the enum
export type TermsFileType = TermsFile | string;

export interface Term {
  word: string;
  definition: string;
  foundWords: string[];
  isCustom?: boolean; // Flag for user-added custom terms
}

export interface Terms {
  [key: string]: string;
}

export interface Settings {
  quickErase: boolean;
  selectedTermsFile: TermsFileType;
  selectOnClick: boolean;
  integrations: { [integrationId: string]: boolean };
  customTermsFiles?: string[];
}
