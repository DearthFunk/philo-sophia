import React, { useState, useEffect } from 'react';
import { Integration as IntegrationType, IntegrationData } from '../types/integrations';
import { integrationManager } from '../services/integrationManager';
import Tooltip from './Tooltip';
import './IntegrationTooltip.css';

interface IntegrationProps {
  integration: IntegrationType;
  word: string;
  onWordClick: (word: string) => void;
}

const Integration: React.FC<IntegrationProps> = ({
  integration,
  word,
  onWordClick
}) => {
  const [data, setData] = useState<IntegrationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleShow = () => {
    if (!data) {
      fetchData();
    }
  };

  const renderContent = () => {
    if (!data) {
      return '';
    }

    if (!data.success) {
      return (
        <div className="integration-tooltip-content">
          <div className="integration-tooltip-error">
            {data.fallbackMessage || data.error || 'Failed to load data'}
          </div>
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
    <Tooltip
      trigger={integration.icon}
      content={renderContent()}
      isLoading={isLoading}
      triggerClassName="integration-trigger"
      className="integration-tooltip"
      onShow={handleShow}
    />
  );
};

export default Integration;
