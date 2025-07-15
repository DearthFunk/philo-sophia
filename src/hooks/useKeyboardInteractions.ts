import { useCallback } from 'react';
import { Term } from '../types';
import { useSettings } from './useSettings';

interface UseKeyboardInteractionsProps {
  terms: Term[];
  setSearchTerm: (term: string) => void;
  setResults: (results: Term[]) => void;
}

export const useKeyboardInteractions = ({
  terms,
  setSearchTerm,
  setResults
}: UseKeyboardInteractionsProps) => {
  const { settings } = useSettings();
  
  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && settings.quickErase) {
      event.preventDefault();
      setSearchTerm('');
      setResults(terms);
    }
  }, [settings.quickErase, terms, setSearchTerm, setResults]);

  return {
    handleKeyDown
  };
};
