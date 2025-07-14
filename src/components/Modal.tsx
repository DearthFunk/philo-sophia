import React, { useEffect, useRef, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerElement?: HTMLElement | null;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  triggerElement, 
  children, 
  className = '' 
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Calculate position relative to trigger element
  useEffect(() => {
    if (isOpen && triggerElement && modalRef.current) {
      const triggerRect = triggerElement.getBoundingClientRect();
      const modalRect = modalRef.current.getBoundingClientRect();
      
      // Position modal below the trigger element by default
      let top = triggerRect.bottom + 8;
      let left = triggerRect.left;
      
      // Adjust if modal would go off-screen
      if (top + modalRect.height > window.innerHeight) {
        // Position above the trigger if there's more space
        if (triggerRect.top > window.innerHeight - triggerRect.bottom) {
          top = triggerRect.top - modalRect.height - 8;
        }
      }
      
      if (left + modalRect.width > window.innerWidth) {
        left = window.innerWidth - modalRect.width - 16;
      }
      
      if (left < 16) {
        left = 16;
      }
      
      setPosition({ top, left });
    }
  }, [isOpen, triggerElement]);

  // Handle escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      // Small delay to prevent immediate closing
      const timer = setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 0);

      return () => {
        clearTimeout(timer);
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Focus the modal container
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        ref={modalRef}
        className={`modal-content ${className}`}
        style={{
          position: 'fixed',
          top: `${position.top}px`,
          left: `${position.left}px`,
          zIndex: 1000,
        }}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
