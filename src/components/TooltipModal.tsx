import React, { useState, useRef, useEffect } from 'react';

interface TooltipModalProps {
  word: string;
  definition: string;
  onWordClick: (word: string) => void;
  children: React.ReactNode;
}

const TooltipModal: React.FC<TooltipModalProps> = ({ 
  word, 
  definition, 
  onWordClick, 
  children 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const updateTooltipPosition = () => {
    if (triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      // Position tooltip above the trigger element
      let top = triggerRect.top - tooltipRect.height - 10;
      let left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
      
      // Ensure tooltip doesn't go off-screen
      if (top < 0) {
        top = triggerRect.bottom + 10; // Position below if not enough space above
      }
      
      if (left < 0) {
        left = 10; // Keep some margin from left edge
      } else if (left + tooltipRect.width > window.innerWidth) {
        left = window.innerWidth - tooltipRect.width - 10; // Keep some margin from right edge
      }
      
      setTooltipPosition({ top, left });
    }
  };

  useEffect(() => {
    if (isVisible) {
      updateTooltipPosition();
    }
  }, [isVisible]);

  useEffect(() => {
    const handleResize = () => {
      if (isVisible) {
        updateTooltipPosition();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isVisible]);

  const handleFocus = () => {
    setIsVisible(true);
  };

  const handleBlur = () => {
    setIsVisible(false);
  };

  const handleClick = () => {
    onWordClick(word);
    setIsVisible(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    } else if (e.key === 'Escape') {
      setIsVisible(false);
    }
  };

  const getDefinitionContent = () => {
    if (!definition || definition.trim() === '') {
      return 'Definition not available - API request failed or word not found in dictionary.';
    }
    return definition;
  };

  return (
    <>
      <button
        ref={triggerRef}
        className="found-word tooltip-trigger"
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        tabIndex={3}
        aria-describedby={isVisible ? `tooltip-${word}` : undefined}
      >
        {children}
      </button>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          id={`tooltip-${word}`}
          className="tooltip-modal"
          style={{
            position: 'fixed',
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
          }}
          role="tooltip"
          aria-live="polite"
        >
          <div className="tooltip-content">
            <div className="tooltip-word">{word}</div>
            <div className="tooltip-definition">{getDefinitionContent()}</div>
          </div>
          <div className="tooltip-arrow"></div>
        </div>
      )}
    </>
  );
};

export default TooltipModal;
