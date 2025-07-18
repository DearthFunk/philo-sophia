import React from 'react';
import './WordsAPITooltip.css';

interface WordsAPITooltipProps {
  data: {
    word: string;
    definitions: Array<{
      definition: string;
      partOfSpeech: string;
      source?: string;
    }>;
  };
  word: string;
}

const WordsAPITooltip: React.FC<WordsAPITooltipProps> = ({ data }) => {
  return (
    <div className="integration-tooltip-content wordsapi-content">
      <div className="integration-tooltip-header">
        <span className="integration-icon">📝</span>
        <h3>{data.word}</h3>
        <span className="source-badge">WordsAPI</span>
      </div>
      <div className="definitions">
        {data.definitions?.map((def, index) => (
          <div key={index} className="definition-item">
            <span className="part-of-speech">{def.partOfSpeech}</span>
            <p className="definition">{def.definition}</p>
            {def.source && <p className="source">Source: {def.source}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordsAPITooltip;
