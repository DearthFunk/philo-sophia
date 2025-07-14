import React from 'react';
import { Term } from '../types';
import IntegrationTooltip from './IntegrationTooltip';
import { integrationManager } from '../services/integrationManager';

interface TermResultProps {
  term: Term;
  onWordClick: (word: string) => void;
  getDefinition: (word: string) => string;
}

const TermResult: React.FC<TermResultProps> = ({ term, onWordClick, getDefinition }) => {
  const enabledIntegrations = integrationManager.getEnabledIntegrations();
  
  return (
    <div className="result">
      <h2>
        {term.word}
        <div className="integrations-container">
          {enabledIntegrations.map((integration) => (
            <IntegrationTooltip
              key={integration.id}
              integration={integration}
              word={term.word}
              onWordClick={onWordClick}
            />
          ))}
        </div>
      </h2>
      <p>{term.definition}</p>
      {term.foundWords.map((foundWord) => (
        <div key={foundWord} className="found-words">
          <button
            className="found-word"
            onClick={() => onWordClick(foundWord)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onWordClick(foundWord);
              }
            }}
            tabIndex={3}
          >
            <b>{foundWord}</b>: <span>{getDefinition(foundWord)}</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default TermResult;
