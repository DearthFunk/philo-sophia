import { useCallback } from 'react';
import { Settings, Term } from '../types';

interface UseKeyboardInteractionsProps {
  settings: Settings;
  terms: Term[];
  setSearchTerm: (term: string) => void;
  setResults: (results: Term[]) => void;
}

export const useKeyboardInteractions = ({
  settings,
  terms,
  setSearchTerm,
  setResults
}: UseKeyboardInteractionsProps) => {
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
