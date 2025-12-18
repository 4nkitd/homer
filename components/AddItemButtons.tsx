
import React, { useState } from 'react';
import { AccentColor, ThemeClasses } from '../types';
import { ACCENT_COLOR_CLASSES } from '../constants';

interface AddItemButtonsProps {
  onAddLink: () => void;
  onAddNote: () => void;
  onAddEvent: () => void;
  onToggleUtilityBar: () => void;
  onAIChatOpen: () => void;
  accentColor: AccentColor;
  themeClasses: ThemeClasses;
}

const AddItemButtons: React.FC<AddItemButtonsProps> = ({ onAddLink, onAddNote, onAddEvent, onToggleUtilityBar, onAIChatOpen, accentColor, themeClasses }) => {
  const [isOpen, setIsOpen] = useState(false);
  const accentClasses = ACCENT_COLOR_CLASSES[accentColor];

  const buttonBaseClasses = `w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg focus:outline-none ${accentClasses.ring} ${themeClasses.ringOffsetBody} ring-offset-2`;
  const mainButtonClasses = `${accentClasses.bg} hover:opacity-90 transform transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`;
  const subButtonClasses = `${themeClasses.button} ${themeClasses.buttonHover} transition-all duration-300`;

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className="relative flex flex-col items-end gap-3">
        {isOpen && (
          <>
            <div className="flex items-center group">
              <span className={`mr-3 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md border ${themeClasses.border}`}>
                AI Chat <kbd className="ml-1 font-sans text-[10px] opacity-60">⌘I</kbd>
              </span>
              <button onClick={onAIChatOpen} className={`${buttonBaseClasses} ${subButtonClasses}`} aria-label="AI Chat">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </button>
            </div>

            <div className="flex items-center group">
              <span className={`mr-3 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md border ${themeClasses.border}`}>
                Utilities <kbd className="ml-1 font-sans text-[10px] opacity-60">U</kbd>
              </span>
              <button onClick={onToggleUtilityBar} className={`${buttonBaseClasses} ${subButtonClasses}`} aria-label="Toggle Utilities">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </button>
            </div>

            <div className="flex items-center group">
              <span className={`mr-3 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md border ${themeClasses.border}`}>
                Add Event <kbd className="ml-1 font-sans text-[10px] opacity-60">E</kbd>
              </span>
              <button onClick={onAddEvent} className={`${buttonBaseClasses} ${subButtonClasses}`} aria-label="Add Event">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15h.01" />
                </svg>
              </button>
            </div>

            <div className="flex items-center group">
              <span className={`mr-3 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md border ${themeClasses.border}`}>
                Add Note <kbd className="ml-1 font-sans text-[10px] opacity-60">N</kbd>
              </span>
              <button onClick={onAddNote} className={`${buttonBaseClasses} ${subButtonClasses}`} aria-label="Add Note">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
            </div>

            <div className="flex items-center group">
              <span className={`mr-3 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md border ${themeClasses.border}`}>
                Add Link <kbd className="ml-1 font-sans text-[10px] opacity-60">L</kbd>
              </span>
              <button onClick={onAddLink} className={`${buttonBaseClasses} ${subButtonClasses}`} aria-label="Add Link">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </button>
            </div>
          </>
        )}
        <div className="flex items-center group">
          <span className={`mr-3 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md border ${themeClasses.border}`}>
            {isOpen ? "Close" : "Add Item"} <kbd className="ml-1 font-sans text-[10px] opacity-60">C</kbd>
          </span>
          <button
            id="fab-toggle-button"
            onClick={() => setIsOpen(!isOpen)}
            className={`${buttonBaseClasses} ${mainButtonClasses}`}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close add options" : "Open add options"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddItemButtons;