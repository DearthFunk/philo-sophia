import React, { useCallback, useRef } from 'react';
import { Term } from '../types';
import { integrationManager } from '../services/integrationManager';
import { useAppContext } from '../context/AppContext';
import './TermResult.css';

interface TermResultProps {
  term: Term;
}

const TermResult: React.FC<TermResultProps> = ({ term }) => {
  const enabledIntegrations = integrationManager.getEnabledIntegrations();
  const { terms, setSearchTerm, settings, searchTerm } = useAppContext();
  const definitionRef = useRef<HTMLParagraphElement>(null);
  const isExactMatch = searchTerm.toLowerCase() === term.word.toLowerCase();

  const getDefinition = useCallback((word: string): string => {
      const term = terms.find((item) => item.word === word);
      return term ? term.definition : '';
    }, [terms]);

  const updateSearchTerm = (foundWord: string) => {
    setSearchTerm(foundWord);    
  }

  const handleDefinitionClick = () => {
    if (!settings.selectOnClick || !definitionRef.current) {
      return;
    }

    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      const range = document.createRange();
      range.selectNodeContents(definitionRef.current);
      selection.addRange(range);
    }
  }

  return (
    <div className={`term-result ${isExactMatch ? 'exact-match' : ''}`}>
      <h2>
        <button className="term-title" onClick={() => updateSearchTerm(term.word)}>{term.word}</button>
        <div className="integrations-container">
          {enabledIntegrations.map((integration) => (
            <button
              className="integration-trigger"
              tabIndex={3}
              key={`${integration.id}-${term.word}`}
              title={integration.description}
            >
              {integration.icon}
            </button>
          ))}
        </div>
      </h2>
      <p 
        ref={definitionRef}
        onClick={handleDefinitionClick}
        style={{ cursor: settings.selectOnClick ? 'pointer' : '' }}
      >
        {term.definition}
      </p>
      {term.foundWords.map((foundWord) => (
        <div key={foundWord} className="found-words">
          <button
            key={foundWord}
            className="found-word"
            tabIndex={3}
            onClick={() => updateSearchTerm(foundWord)}
          >
            <b>{foundWord}</b>: <span>{getDefinition(foundWord)}</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default TermResult;
