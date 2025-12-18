import React from 'react';
import { ThemeClasses, AccentColor } from '../types';
import { ACCENT_COLOR_CLASSES } from '../constants';

interface AIChatViewProps {
  onClose: () => void;
  themeClasses: ThemeClasses;
  accentColor: AccentColor;
}

const AIChatView: React.FC<AIChatViewProps> = ({ onClose, themeClasses, accentColor }) => {
  const accentClasses = ACCENT_COLOR_CLASSES[accentColor];

  return (
    <div className={`fixed inset-0 z-[60] flex flex-col ${themeClasses.body} animate-fadeIn`}>
      {/* Header */}
      <header className={`flex items-center justify-between p-4 border-b ${themeClasses.border} ${themeClasses.card}`}>
        <div className="flex items-center space-x-4">
          <button 
            onClick={onClose}
            className={`p-2 rounded-full ${themeClasses.button} ${themeClasses.buttonHover} text-gray-300 hover:text-white transition-colors`}
            aria-label="Back to Dashboard"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h2 className="text-xl font-bold text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 mr-2 ${accentClasses.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            AI Chat Studio
          </h2>
        </div>
        <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 hidden sm:inline">Shortcut: Cmd+I</span>
            <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white p-2"
                aria-label="Close"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
      </header>

      {/* Iframe Container */}
      <main className="flex-grow relative bg-black">
        <iframe 
          src="https://4nkitd.github.io/ollama-ai-studio/" 
          className="absolute inset-0 w-full h-full border-none"
          title="AI Chat Studio"
          allow="clipboard-read; clipboard-write; microphone; camera"
        />
      </main>
    </div>
  );
};

export default AIChatView;
