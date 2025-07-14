import React, { useRef, useEffect } from 'react';
import { Settings } from '../types';
import MenuOptions from './MenuOptions';

interface HeaderProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  searchTerm: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const Header: React.FC<HeaderProps> = ({
  settings,
  onSettingsChange,
  searchTerm,
  onSearchChange,
  onKeyDown
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus the input on component mount
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  }, []);

  // Expose focus method to parent via global escape handler
  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  return (
    <div className="header">
      <MenuOptions
        settings={settings}
        onSettingsChange={onSettingsChange}
      />
      <input
        ref={inputRef}
        type="text"
        id="search-input"
        value={searchTerm}
        onChange={onSearchChange}
        onKeyDown={onKeyDown}
placeholder={`Search ${settings.termsFile} terms...`}
        tabIndex={2}
      />
    </div>
  );
};

export default Header;
