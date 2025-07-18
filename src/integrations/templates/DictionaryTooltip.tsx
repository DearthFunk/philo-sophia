import React from 'react';
import './DictionaryTooltip.css';

interface DictionaryTooltipProps {
  data: {
    word: string;
    phonetic?: string;
    definitions: Array<{
      partOfSpeech: string;
      definition: string;
      example?: string;
      synonyms?: string[];
      antonyms?: string[];
    }>;
  };
  word: string;
}

const DictionaryTooltip: React.FC<DictionaryTooltipProps> = ({ data }) => {
  return (
    <div className="integration-tooltip-content dictionary-content">
      <div className="integration-tooltip-header">
        <span className="integration-icon">📖</span>
        <h3>{data.word}</h3>
        {data.phonetic && <span className="phonetic">{data.phonetic}</span>}
      </div>
      <div className="definitions">
        {data.definitions?.map((def, index) => (
          <div key={index} className="definition-item">
            <span className="part-of-speech">{def.partOfSpeech}</span>
            <p className="definition">{def.definition}</p>
            {def.example && <p className="example"><em>Example: {def.example}</em></p>}
            {def.synonyms && def.synonyms.length > 0 && (
              <p className="synonyms">
                <strong>Synonyms:</strong> {def.synonyms.join(', ')}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DictionaryTooltip;
