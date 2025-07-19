import React, { useEffect, useRef, useState } from 'react';
import { Integration, IntegrationData } from '../types/integrations';
import { integrationManager } from '../services/integrationManager';
import './IntegrationTooltip.css';

interface IntegrationTooltipProps {
  integration: Integration;
  word: string;
  triggerElement: HTMLElement | null;
  onClose: () => void;
}

const IntegrationTooltip: React.FC<IntegrationTooltipProps> = ({ 
  integration, 
  word, 
  triggerElement, 
  onClose 
}) => {
  const [data, setData] = useState<IntegrationData | null>(null);
  const [loading, setLoading] = useState(true);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await integrationManager.fetchIntegrationData(integration.id, word);
        setData(result);
      } catch (error) {
        setData({
          success: false,
          error: 'Failed to fetch data',
          fallbackMessage: `Could not load ${integration.name} data for "${word}". Error ${JSON.stringify(error)}`
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [integration, word]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  // Position tooltip relative to trigger element
  const getTooltipStyle = (): React.CSSProperties => {
    if (!triggerElement) return {};

    const rect = triggerElement.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    return {
      position: 'absolute',
      top: rect.bottom + scrollTop + 8,
      left: rect.left + scrollLeft,
      zIndex: 1000,
    };
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="integration-tooltip-loading">
          <div className="loading-spinner"></div>
          <p>Loading {integration.name} data...</p>
        </div>
      );
    }

    if (!data?.success) {
      return (
        <div className="integration-tooltip-error">
          <p>{data?.fallbackMessage || `Failed to load ${integration.name} data`}</p>
        </div>
      );
    }

    // Use integration-specific template if provided
    if (integration.tooltipTemplate && data.data) {
      return integration.tooltipTemplate(data.data, word);
    }

    // Fallback to default template based on integration type
    return renderDefaultTemplate();
  };

  const renderDefaultTemplate = () => {
    if (!data?.data) return null;

    // Generic fallback template for integrations without custom templates
    return (
      <div className="integration-tooltip-content">
        <div className="integration-tooltip-header">
          <span className="integration-icon">{integration.icon}</span>
          <h3>{integration.name}</h3>
        </div>
        <pre>{JSON.stringify(data.data, null, 2)}</pre>
      </div>
    );
  };


  return (
    <div 
      ref={tooltipRef}
      className="integration-tooltip"
      style={getTooltipStyle()}
    >
      <div className="integration-tooltip-arrow"></div>
      {renderContent()}
    </div>
  );
};

export default IntegrationTooltip;
