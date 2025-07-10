

import React, { useEffect } from 'react';
import { ThemeClasses } from '../types';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  themeClasses: ThemeClasses;
}

const Modal: React.FC<ModalProps> = ({ onClose, children, title, themeClasses }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className={`${themeClasses.modal} rounded-lg shadow-xl w-full max-w-md animate-fadeIn`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`flex justify-between items-center p-4 border-b ${themeClasses.border}`}>
          <h2 id="modal-title" className="text-xl font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;