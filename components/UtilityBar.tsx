
import React, { useState } from 'react';
import { AccentColor, ThemeClasses } from '../types';
import { ACCENT_COLOR_CLASSES } from '../constants';
import ToolInterface from './ToolInterface';

interface UtilityBarProps {
  onClose: () => void;
  themeClasses: ThemeClasses;
  accentColor: AccentColor;
}

type Utility = 'Base64' | 'URL' | 'JSON';

const UtilityBar: React.FC<UtilityBarProps> = ({ onClose, themeClasses, accentColor }) => {
  const [activeUtil, setActiveUtil] = useState<Utility>('Base64');
  
  const [base64Input, setBase64Input] = useState('');
  const [base64Output, setBase64Output] = useState('');
  
  const [urlInput, setUrlInput] = useState('');
  const [urlOutput, setUrlOutput] = useState('');
  
  const [jsonInput, setJsonInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');

  const accentClasses = ACCENT_COLOR_CLASSES[accentColor];

  const handleBase64Encode = () => {
    try {
      setBase64Output(btoa(base64Input));
    } catch (error) {
      setBase64Output('Error: Invalid input for Base64 encoding.');
    }
  };
  const handleBase64Decode = () => {
    try {
      setBase64Output(atob(base64Input));
    } catch (error) {
      setBase64Output('Error: Invalid input for Base64 decoding.');
    }
  };

  const handleUrlEncode = () => setUrlOutput(encodeURIComponent(urlInput));
  const handleUrlDecode = () => {
     try {
      setUrlOutput(decodeURIComponent(urlInput));
    } catch (error) {
      setUrlOutput('Error: Invalid input for URL decoding.');
    }
  };

  const handleJsonMinify = () => {
    try {
      setJsonOutput(JSON.stringify(JSON.parse(jsonInput)));
    } catch (error) {
      setJsonOutput('Error: Invalid JSON format.');
    }
  };

  const utils: Utility[] = ['Base64', 'URL', 'JSON'];
  
  return (
    <div className={`fixed bottom-0 left-0 right-0 h-80 z-40 ${themeClasses.modal} border-t ${themeClasses.border} shadow-2xl flex flex-col animate-slideInUp`}>
      {/* Header */}
      <header className={`flex items-center justify-between p-2 border-b ${themeClasses.border} flex-shrink-0`}>
        <div className="flex items-center">
          {utils.map(util => (
            <button
              key={util}
              onClick={() => setActiveUtil(util)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${activeUtil === util ? `${accentClasses.bg} text-white` : `text-gray-300 ${themeClasses.buttonHover}`}`}
            >
              {util}
            </button>
          ))}
        </div>
        <button onClick={onClose} className="p-2 text-gray-400 hover:text-white" aria-label="Close utility bar">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </header>

      {/* Content */}
      <main className="flex-grow p-4 overflow-y-auto">
        {activeUtil === 'Base64' && (
          <ToolInterface
            input={base64Input}
            onInputChange={setBase64Input}
            output={base64Output}
            actions={[
              { label: 'Encode', onClick: handleBase64Encode },
              { label: 'Decode', onClick: handleBase64Decode }
            ]}
            themeClasses={themeClasses}
            accentColor={accentColor}
            inputLabel="Input (UTF-8)"
            outputLabel="Output (Base64)"
          />
        )}
        {activeUtil === 'URL' && (
          <ToolInterface
            input={urlInput}
            onInputChange={setUrlInput}
            output={urlOutput}
            actions={[
              { label: 'Encode', onClick: handleUrlEncode },
              { label: 'Decode', onClick: handleUrlDecode }
            ]}
            themeClasses={themeClasses}
            accentColor={accentColor}
            inputLabel="Decoded URL"
            outputLabel="Encoded URL"
          />
        )}
         {activeUtil === 'JSON' && (
          <ToolInterface
            input={jsonInput}
            onInputChange={setJsonInput}
            output={jsonOutput}
            actions={[
              { label: 'Minify', onClick: handleJsonMinify }
            ]}
            themeClasses={themeClasses}
            accentColor={accentColor}
            inputLabel="Formatted JSON"
            outputLabel="Minified JSON"
          />
        )}
      </main>
    </div>
  );
};

export default UtilityBar;
