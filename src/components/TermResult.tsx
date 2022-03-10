import React from 'react';
import { Term } from '../types';

interface TermResultProps {
  term: Term;
  onWordClick: (word: string) => void;
  getDefinition: (word: string) => string;
}

const TermResult: React.FC<TermResultProps> = ({ term, onWordClick, getDefinition }) => {
  return (
    <div className="result">
      <h2>{term.word}</h2>
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
          >
            <b>{foundWord}</b>: <span>{getDefinition(foundWord)}</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default TermResult;
