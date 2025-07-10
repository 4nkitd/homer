
import React, { useState } from 'react';
import { AccentColor, ThemeClasses } from '../types';
import { ACCENT_COLOR_CLASSES } from '../constants';

interface ToolAction {
  label: string;
  onClick: () => void;
}

interface ToolInterfaceProps {
  input: string;
  onInputChange: (value: string) => void;
  output: string;
  actions: ToolAction[];
  themeClasses: ThemeClasses;
  accentColor: AccentColor;
  inputLabel?: string;
  outputLabel?: string;
}

const ToolInterface: React.FC<ToolInterfaceProps> = ({ input, onInputChange, output, actions, themeClasses, accentColor, inputLabel, outputLabel }) => {
  const accentClasses = ACCENT_COLOR_CLASSES[accentColor];
  const [copyStatus, setCopyStatus] = useState('Copy Output');

  const handleCopy = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus('Copy Output'), 2000);
    });
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
        <div className="flex flex-col">
          {inputLabel && <label className="text-sm font-medium text-gray-400 mb-1">{inputLabel}</label>}
          <textarea
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            className={`flex-grow w-full p-2 ${themeClasses.input} border ${themeClasses.border} rounded-md text-white focus:outline-none focus:ring-2 ${accentClasses.ring}`}
            placeholder="Input..."
          />
        </div>
        <div className="flex flex-col">
          {outputLabel && <label className="text-sm font-medium text-gray-400 mb-1">{outputLabel}</label>}
          <textarea
            value={output}
            readOnly
            className={`flex-grow w-full p-2 ${themeClasses.input} border ${themeClasses.border} rounded-md text-white focus:outline-none focus:ring-2 ${accentClasses.ring}`}
            placeholder="Output..."
          />
        </div>
      </div>
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex space-x-2">
          {actions.map(action => (
            <button
              key={action.label}
              onClick={action.onClick}
              className={`px-3 py-1.5 text-sm font-medium text-white ${accentClasses.bg} rounded-md shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 ${themeClasses.ringOffsetModal} ${accentClasses.ring}`}
            >
              {action.label}
            </button>
          ))}
          <button
             onClick={() => onInputChange('')}
             className={`px-3 py-1.5 text-sm font-medium text-white ${themeClasses.button} ${themeClasses.buttonHover} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${themeClasses.ringOffsetModal} ${accentClasses.ring}`}
          >
              Clear
          </button>
        </div>
        <button
          onClick={handleCopy}
          disabled={!output}
          className={`px-3 py-1.5 text-sm font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${themeClasses.ringOffsetModal} ${accentClasses.ring} ${copyStatus === 'Copied!' ? 'bg-green-600' : `${themeClasses.button} ${themeClasses.buttonHover}`} disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
        >
          {copyStatus}
        </button>
      </div>
    </div>
  );
};

export default ToolInterface;
