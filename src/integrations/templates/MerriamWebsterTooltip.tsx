import React from 'react';

interface MerriamWebsterTooltipProps {
  data: {
    word: string;
    phonetic?: string;
    pronunciation?: string;
    definitions: Array<{
      partOfSpeech: string;
      definitions: Array<{
        definition: string;
        example?: string;
        synonyms?: string[];
        antonyms?: string[];
      }>;
    }>;
    etymology?: string;
    source?: string;
  };
  word: string;
}

const MerriamWebsterTooltip: React.FC<MerriamWebsterTooltipProps> = ({ data }) => {
  return (
    <div className="integration-tooltip-content merriam-webster-content">
      <div className="integration-tooltip-header">
        <span className="integration-icon">📘</span>
        <h3>{data.word}</h3>
        {data.phonetic && <span className="phonetic">{data.phonetic}</span>}
        <span className="source-badge">Merriam-Webster</span>
      </div>
      
      <div className="definitions">
        {data.definitions?.map((meaningGroup, groupIndex) => (
          <div key={groupIndex} className="meaning-group">
            <span className="part-of-speech">{meaningGroup.partOfSpeech}</span>
            {meaningGroup.definitions.map((def, defIndex) => (
              <div key={defIndex} className="definition-item">
                <p className="definition">{def.definition}</p>
                {def.example && <p className="example"><em>Example: {def.example}</em></p>}
                {def.synonyms && def.synonyms.length > 0 && (
                  <p className="synonyms">
                    <strong>Synonyms:</strong> {def.synonyms.join(', ')}
                  </p>
                )}
                {def.antonyms && def.antonyms.length > 0 && (
                  <p className="antonyms">
                    <strong>Antonyms:</strong> {def.antonyms.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {data.etymology && (
        <div className="etymology">
          <strong>Etymology:</strong> {data.etymology}
        </div>
      )}
      
      {data.source && (
        <div className="source-info">
          <small>{data.source}</small>
        </div>
      )}
    </div>
  );
};

export default MerriamWebsterTooltip;
