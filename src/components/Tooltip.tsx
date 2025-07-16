import React, { useState, useRef, useEffect } from 'react';
import './Tooltip.css';

interface TooltipProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  isLoading?: boolean;
  className?: string;
  triggerClassName?: string;
  onShow?: () => void;
  onHide?: () => void;
  disabled?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({
  trigger,
  content,
  isLoading = false,
  className = '',
  triggerClassName = '',
  onShow,
  onHide,
  disabled = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
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
  }, [isVisible, content]);

  useEffect(() => {
    const handleResize = () => {
      if (isVisible) {
        updateTooltipPosition();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isVisible]);

  const handleShow = () => {
    if (disabled) return;
    setIsVisible(true);
    onShow?.();
  };

  const handleHide = () => {
    setIsVisible(false);
    onHide?.();
  };

  const handleFocus = () => {
    handleShow();
  };

  const handleBlur = () => {
    handleHide();
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
    if (!isVisible) {
      handleShow();
    } else {
      handleHide();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      if (!isVisible) {
        handleShow();
      } else {
        handleHide();
      }
    } else if (e.key === 'Escape') {
      handleHide();
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        className={`tooltip-trigger ${triggerClassName}`}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        tabIndex={3}
        aria-describedby={isVisible ? `tooltip-content` : undefined}
        disabled={disabled}
      >
        {trigger}
      </button>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`tooltip ${className}`}
          style={{
            position: 'fixed',
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
          }}
          role="tooltip"
          aria-live="polite"
        >
          {isLoading ? (
            <div className="tooltip-loading">
              Loading...
            </div>
          ) : (
            content
          )}
          <div className="tooltip-arrow"></div>
        </div>
      )}
    </>
  );
};

export default Tooltip;
