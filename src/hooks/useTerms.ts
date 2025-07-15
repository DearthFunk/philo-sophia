import { useState, useEffect, useCallback } from 'react';
import { Term, TermsFile } from '../types';
import philosophyTerms from '../terms/philosobabel';
import scienceTerms from '../terms/sciencebabel';

export const useTerms = (termsFile: TermsFile) => {
  const [terms, setTerms] = useState<Term[]>([]);

  const loadTerms = useCallback(() => {
    // Select the appropriate terms file based on settings
    const selectedTerms = termsFile === TermsFile.SCIENCE ? scienceTerms : philosophyTerms;
    
    // Map the terms to an array of objects
    const mappedTerms: Term[] = Object.keys(selectedTerms).map((key) => ({
      word: key,
      definition: selectedTerms[key],
      foundWords: [],
    }));

    // For each term, break up the definition into an array
    // and collect any words that also exist in the terms
    mappedTerms.forEach((item) => {
      const termsWords = Object.keys(selectedTerms);
      const definitionWords = item.definition.split(' ');
      const foundWords = definitionWords.filter((word) =>
        termsWords.includes(word)
      );
      // Deduplicate foundWords using Set
      item.foundWords = Array.from(new Set(foundWords));
    });

    setTerms(mappedTerms);
  }, [termsFile]);

  useEffect(() => {
    loadTerms();
  }, [loadTerms]);

  return {
    terms,
  };
};
