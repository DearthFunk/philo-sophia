import React, { useCallback, useRef, useState } from 'react';
import { Term } from '../types';
import { integrationManager } from '../services/integrationManager';
import { useAppContext } from '../context/AppContext';
import './TermResult.css';
import { Integration } from '../types/integrations';
import IntegrationTooltip from './IntegrationTooltip';

interface TermResultProps {
  term: Term;
}

const TermResult: React.FC<TermResultProps> = ({ term }) => {
  const enabledIntegrations = integrationManager.getEnabledIntegrations();
  const { terms, setSearchTerm, settings, searchTerm } = useAppContext();
  const definitionRef = useRef<HTMLParagraphElement>(null);
  const isExactMatch = searchTerm.toLowerCase() === term.word.toLowerCase();
  const [activeTooltip, setActiveTooltip] = useState<{
    integration: Integration;
    triggerElement: HTMLElement;
  } | null>(null);

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

  const showIntegrationInfo = (integration: Integration, event: React.MouseEvent<HTMLButtonElement>) => {
    const triggerElement = event.currentTarget;
    
    // Close tooltip if clicking the same integration
    if (activeTooltip?.integration.id === integration.id) {
      setActiveTooltip(null);
      return;
    }
    
    // Open tooltip for this integration
    setActiveTooltip({
      integration,
      triggerElement
    });
  };

  const handleIntegrationRightClick = (integration: Integration, event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent context menu
    const cleared = integrationManager.clearCachedData(integration.id, term.word);
    if (cleared) {
      console.log(`Cache cleared for ${integration.name}: ${term.word}`);
      
      // Visual feedback - add CSS animation class
      const button = event.currentTarget;
      button.classList.add('cache-cleared');
      
      // Remove the class after animation completes
      const handleAnimationEnd = () => {
        button.classList.remove('cache-cleared');
        button.removeEventListener('animationend', handleAnimationEnd);
      };
      button.addEventListener('animationend', handleAnimationEnd);
    }
  };

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
              title={`${integration.description} | Right-click to clear cache`}
              onClick={(event) => showIntegrationInfo(integration, event)}
              onContextMenu={(event) => handleIntegrationRightClick(integration, event)}
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
      
      {activeTooltip && (
        <IntegrationTooltip
          integration={activeTooltip.integration}
          word={term.word}
          triggerElement={activeTooltip.triggerElement}
          onClose={() => setActiveTooltip(null)}
        />
      )}
    </div>
  );
};

export default TermResult;
