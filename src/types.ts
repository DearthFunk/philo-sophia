export interface Term {
  word: string;
  definition: string;
  foundWords: string[];
}

export interface TermsData {
  [key: string]: string;
}
