import React, { useState, useRef, useEffect } from 'react';
import { Integration, IntegrationData } from '../types/integrations';
import { integrationManager } from '../services/integrationManager';

interface IntegrationTooltipProps {
  integration: Integration;
  word: string;
  onWordClick: (word: string) => void;
}

const IntegrationTooltip: React.FC<IntegrationTooltipProps> = ({ 
  integration, 
  word, 
  onWordClick 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<IntegrationData | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const updateTooltipPosition = () => {
    if (triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      let top = triggerRect.top - tooltipRect.height - 10;
      let left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
      
      if (top < 0) {
        top = triggerRect.bottom + 10;
      }
      
      if (left < 0) {
        left = 10;
      } else if (left + tooltipRect.width > window.innerWidth) {
        left = window.innerWidth - tooltipRect.width - 10;
      }
      
      setTooltipPosition({ top, left });
    }
  };

  useEffect(() => {
    if (isVisible) {
      updateTooltipPosition();
    }
  }, [isVisible, data]);

  useEffect(() => {
    const handleResize = () => {
      if (isVisible) {
        updateTooltipPosition();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isVisible]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await integrationManager.fetchIntegrationData(integration.id, word);
      setData(result);
    } catch (error) {
      console.error('Error fetching integration data:', error);
      setData({
        success: false,
        error: 'Failed to fetch data',
        fallbackMessage: `Failed to fetch data from ${integration.name}. Please try again later.`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFocus = () => {
    setIsVisible(true);
    if (!data) {
      fetchData();
    }
  };

  const handleBlur = () => {
    setIsVisible(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    // Only show tooltip, don't navigate to word
    if (!isVisible) {
      setIsVisible(true);
      if (!data) {
        fetchData();
      }
    } else {
      setIsVisible(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      // Only toggle tooltip, don't navigate to word
      if (!isVisible) {
        setIsVisible(true);
        if (!data) {
          fetchData();
        }
      } else {
        setIsVisible(false);
      }
    } else if (e.key === 'Escape') {
      setIsVisible(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="integration-tooltip-loading">
          Loading {integration.name} data...
        </div>
      );
    }

    if (!data) {
      return (
        <div className="integration-tooltip-error">
          Loading {integration.name} data...
        </div>
      );
    }

    if (!data.success) {
      return (
        <div className="integration-tooltip-error">
          {data.fallbackMessage || data.error || 'Failed to load data'}
        </div>
      );
    }

    // Render dictionary-specific content
    if (integration.id === 'dictionary' && data.data) {
      const dictData = data.data;
      return (
        <div className="integration-tooltip-content">
          <div className="integration-tooltip-header">
            <div className="integration-tooltip-word">{dictData.word}</div>
            {dictData.phonetic && (
              <div className="integration-tooltip-phonetic">{dictData.phonetic}</div>
            )}
          </div>
          <div className="integration-tooltip-definitions">
            {dictData.definitions.map((def: any, index: number) => (
              <div key={index} className="integration-tooltip-definition">
                <div className="integration-tooltip-pos">{def.partOfSpeech}</div>
                <div className="integration-tooltip-def-text">{def.definition}</div>
                {def.example && (
                  <div className="integration-tooltip-example">
                    <em>"{def.example}"</em>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Render Wikipedia-specific content
    if (integration.id === 'wikipedia' && data.data) {
      const wikiData = data.data;
      return (
        <div className="integration-tooltip-content">
          <div className="integration-tooltip-header">
            <div className="integration-tooltip-word">{wikiData.title}</div>
          </div>
          <div className="integration-tooltip-wiki-content">
            <div className="integration-tooltip-extract">{wikiData.extract}</div>
            {wikiData.url && (
              <div className="integration-tooltip-wiki-link">
                <a href={wikiData.url} target="_blank" rel="noopener noreferrer">
                  Read more on Wikipedia →
                </a>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Render WordsAPI-specific content
    if (integration.id === 'wordsapi' && data.data) {
      const wordsData = data.data;
      return (
        <div className="integration-tooltip-content">
          <div className="integration-tooltip-header">
            <div className="integration-tooltip-word">{wordsData.word}</div>
          </div>
          <div className="integration-tooltip-definitions">
            {wordsData.definitions.map((def: any, index: number) => (
              <div key={index} className="integration-tooltip-definition">
                <div className="integration-tooltip-pos">{def.partOfSpeech}</div>
                <div className="integration-tooltip-def-text">{def.definition}</div>
                <div className="integration-tooltip-source">Source: {def.source}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Render Merriam-Webster-specific content
    if (integration.id === 'merriam-webster' && data.data) {
      const mwData = data.data;
      return (
        <div className="integration-tooltip-content">
          <div className="integration-tooltip-header">
            <div className="integration-tooltip-word">{mwData.word}</div>
            {mwData.phonetic && (
              <div className="integration-tooltip-phonetic">{mwData.phonetic}</div>
            )}
          </div>
          <div className="integration-tooltip-definitions">
            {mwData.definitions.map((meaning: any, meaningIndex: number) => (
              <div key={meaningIndex} className="integration-tooltip-meaning">
                <div className="integration-tooltip-pos">{meaning.partOfSpeech}</div>
                {meaning.definitions.map((def: any, defIndex: number) => (
                  <div key={defIndex} className="integration-tooltip-definition">
                    <div className="integration-tooltip-def-text">{def.definition}</div>
                    {def.example && (
                      <div className="integration-tooltip-example">
                        <em>"{def.example}"</em>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
          {mwData.etymology && (
            <div className="integration-tooltip-etymology">
              <strong>Etymology:</strong> {mwData.etymology}
            </div>
          )}
          <div className="integration-tooltip-source">{mwData.source}</div>
        </div>
      );
    }

    // Generic content for other integrations
    return (
      <div className="integration-tooltip-content">
        <div className="integration-tooltip-word">{word}</div>
        <div className="integration-tooltip-data">
          {JSON.stringify(data.data, null, 2)}
        </div>
      </div>
    );
  };

  return (
    <>
      <button
        ref={triggerRef}
        className="integration-trigger"
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        tabIndex={3}
        aria-describedby={isVisible ? `integration-tooltip-${integration.id}-${word}` : undefined}
        title={integration.description}
      >
        {integration.icon}
      </button>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          id={`integration-tooltip-${integration.id}-${word}`}
          className="integration-tooltip"
          style={{
            position: 'fixed',
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
          }}
          role="tooltip"
          aria-live="polite"
        >
          {renderContent()}
          <div className="integration-tooltip-arrow"></div>
        </div>
      )}
    </>
  );
};

export default IntegrationTooltip;
