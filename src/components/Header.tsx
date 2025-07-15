import React, { useRef, useEffect } from 'react';
import { TermsFile } from '../types';
import { useSettings } from '../hooks/useSettings';
import MenuOptions from './MenuOptions';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onTermsFileChange: (termsFile: TermsFile) => void;
}

const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchChange,
  onKeyDown,
  onTermsFileChange
}) => {
  const { settings } = useSettings();
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
        onTermsFileChange={onTermsFileChange}
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
