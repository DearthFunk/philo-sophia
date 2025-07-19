import React, { useCallback, useRef, useState, useEffect } from 'react';
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
  const { terms, setSearchTerm, settings, searchTerm, updateCustomTerm } = useAppContext();
  const definitionRef = useRef<HTMLParagraphElement>(null);
  const isExactMatch = searchTerm.toLowerCase() === term.word.toLowerCase();
  const [activeTooltip, setActiveTooltip] = useState<{
    integration: Integration;
    triggerElement: HTMLElement;
  } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [editValue, setEditValue] = useState(term.definition);

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

  const handleDefinitionEdit = () => {
    if (term.isCustom) {
      setIsEditing(true);
    }
  };

  const handleDefinitionSave = () => {
    if (term.isCustom) {
      updateCustomTerm(term.word, editValue);
      setIsEditing(false);
    }
  };

  const handleDefinitionCancel = () => {
    setEditValue(term.definition);
    setIsEditing(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && event.shiftKey === false) {
      event.preventDefault();
      handleDefinitionSave();
    } else if (event.key === 'Escape') {
      handleDefinitionCancel();
    }
  };

  // Sync editValue with term definition when it changes
  useEffect(() => {
    setEditValue(term.definition);
  }, [term.definition]);

  // Determine if we should show editing interface
  const shouldShowEditor = term.isCustom && (isEditing || (!term.definition.trim() && searchTerm));
  const shouldShowHoverEditor = term.isCustom && !searchTerm && isHovered && term.definition.trim();

  return (
    <div className="term-result">
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
      
      {/* Definition section with editing capability */}
      {shouldShowEditor || shouldShowHoverEditor ? (
        <div className="definition-editor">
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleDefinitionSave}
            autoFocus
            placeholder="Enter definition..."
            className="definition-input"
          />
          {isEditing && (
            <div className="edit-buttons">
              <button onClick={handleDefinitionSave} className="save-button">Save</button>
              <button onClick={handleDefinitionCancel} className="cancel-button">Cancel</button>
            </div>
          )}
        </div>
      ) : (
        <p 
          ref={definitionRef}
          onClick={term.isCustom ? handleDefinitionEdit : handleDefinitionClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ 
            cursor: term.isCustom ? 'text' : (settings.selectOnClick ? 'pointer' : ''),
            minHeight: term.isCustom && !term.definition.trim() ? '20px' : 'auto'
          }}
          className={term.isCustom ? 'custom-definition' : ''}
        >
          {term.definition || (term.isCustom ? 'Click to add definition...' : '')}
        </p>
      )}
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
