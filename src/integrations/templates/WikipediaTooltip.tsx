import React from 'react';

interface WikipediaTooltipProps {
  data: {
    title: string;
    extract: string;
    url?: string;
    thumbnail?: string;
    lang?: string;
  };
  word: string;
}

const WikipediaTooltip: React.FC<WikipediaTooltipProps> = ({ data }) => {
  return (
    <div className="integration-tooltip-content wikipedia-content">
      <div className="integration-tooltip-header">
        <span className="integration-icon">🌐</span>
        <h3>{data.title}</h3>
      </div>
      {data.thumbnail && (
        <img 
          src={data.thumbnail} 
          alt={data.title} 
          className="wikipedia-thumbnail"
        />
      )}
      <p className="wikipedia-extract">{data.extract}</p>
      {data.url && (
        <a 
          href={data.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="wikipedia-link"
        >
          Read more on Wikipedia →
        </a>
      )}
    </div>
  );
};

export default WikipediaTooltip;
