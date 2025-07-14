import { useCallback } from 'react';
import { Term } from '../types';

interface UseSearchProps {
  terms: Term[];
  setSearchTerm: (term: string) => void;
  setResults: (results: Term[]) => void;
}

export const useSearch = ({ terms, setSearchTerm, setResults }: UseSearchProps) => {
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    const filteredResults = terms.filter((definition) =>
      definition.word.includes(value)
    );
    setResults(filteredResults);
  }, [terms, setSearchTerm, setResults]);

  const handleWordClick = useCallback((word: string) => {
    setSearchTerm(word);
    const filteredResults = terms.filter((definition) =>
      definition.word.includes(word)
    );
    setResults(filteredResults);
  }, [terms, setSearchTerm, setResults]);

  return {
    handleInputChange,
    handleWordClick
  };
};
