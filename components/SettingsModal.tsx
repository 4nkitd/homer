
import React, { useRef } from 'react';
import Modal from './Modal';
import { Settings, AccentColor, ThemeClasses, BackgroundName } from '../types';
import { ACCENT_COLORS, ACCENT_COLOR_CLASSES, BACKGROUND_NAMES, BACKGROUND_THEMES } from '../constants';

interface SettingsModalProps {
  onClose: () => void;
  settings: Settings;
  onUpdateSettings: (newSettings: Partial<Settings>) => void;
  onExport: () => void;
  onImport: (file: File) => void;
  themeClasses: ThemeClasses;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, settings, onUpdateSettings, onExport, onImport, themeClasses }) => {
  const importInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImport(file);
    }
  };

  const accentClasses = ACCENT_COLOR_CLASSES[settings.accentColor];

  return (
    <Modal onClose={onClose} title="Settings" themeClasses={themeClasses}>
      <div className="space-y-6">
        
        {/* Appearance Section */}
        <div className={`border-b ${themeClasses.border} pb-4`}>
          <h3 className="text-lg font-medium leading-6 text-white">Appearance</h3>
          <div className="mt-4 space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-300">Accent Color</label>
              <div className="flex space-x-3 mt-2">
                {ACCENT_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => onUpdateSettings({ accentColor: color })}
                    className={`w-8 h-8 rounded-full ${ACCENT_COLOR_CLASSES[color].bg} focus:outline-none transition-transform transform hover:scale-110 ${settings.accentColor === color ? `ring-2 ring-offset-2 ${themeClasses.ringOffsetModal} ring-white` : ''}`}
                    aria-label={`Set accent color to ${color}`}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300">Background Theme</label>
              <div className="grid grid-cols-3 gap-3 mt-2">
                {BACKGROUND_NAMES.map(name => {
                  const theme = BACKGROUND_THEMES[name];
                  return (
                    <button
                      key={name}
                      onClick={() => onUpdateSettings({ backgroundName: name })}
                      className={`text-left p-2 rounded-md focus:outline-none transition-all ${settings.backgroundName === name ? `ring-2 ${accentClasses.ring}` : 'ring-1 ring-transparent'} ${theme.card}`}
                      aria-label={`Set theme to ${theme.name}`}
                    >
                      <div className="flex items-center space-x-2">
                        <div className={`w-5 h-5 rounded-full ${theme.body} ring-1 ring-white/20`}></div>
                        <span className="text-sm text-white">{theme.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className={`border-b ${themeClasses.border} pb-4`}>
          <h3 className="text-lg font-medium leading-6 text-white">Search</h3>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-300">Show Search Bar</span>
            <button
              onClick={() => onUpdateSettings({ showSearch: !settings.showSearch })}
              className={`${settings.showSearch ? accentClasses.bg : themeClasses.toggleOff} relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${themeClasses.ringOffsetModal} ${accentClasses.ring}`}
            >
              <span className={`${settings.showSearch ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
            </button>
          </div>
          <div className="mt-4">
            <label htmlFor="search-url" className="text-sm font-medium text-gray-300">
              Search Engine URL
            </label>
            <input
              id="search-url"
              type="text"
              value={settings.searchUrl}
              onChange={(e) => onUpdateSettings({ searchUrl: e.target.value })}
              className={`mt-1 block w-full ${themeClasses.input} border ${themeClasses.border} rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 ${accentClasses.ring} focus:border-transparent`}
            />
            <p className="mt-2 text-xs text-gray-400">
              Use <code className={`${themeClasses.button} px-1 py-0.5 rounded-sm`}>{`{query}`}</code> as a placeholder for the search term.
            </p>
          </div>
        </div>

        {/* Keyboard Shortcuts Section */}
        <div className={`border-b ${themeClasses.border} pb-4`}>
          <h3 className="text-lg font-medium leading-6 text-white">Keyboard Shortcuts</h3>
          <div className="mt-4 space-y-2 text-sm text-gray-300">
            <div className="flex justify-between items-center">
              <span>Focus Search</span>
              <kbd className={`px-2 py-1 text-xs font-semibold text-gray-200 ${themeClasses.kbdBg} border ${themeClasses.kbdBorder} rounded-md`}>S</kbd>
            </div>
            <div className="flex justify-between items-center">
              <span>Add new Link</span>
              <div>
                <kbd className={`px-2 py-1 text-xs font-semibold text-gray-200 ${themeClasses.kbdBg} border ${themeClasses.kbdBorder} rounded-md`}>A</kbd>
                <span className="mx-1 text-gray-400">or</span>
                <kbd className={`px-2 py-1 text-xs font-semibold text-gray-200 ${themeClasses.kbdBg} border ${themeClasses.kbdBorder} rounded-md`}>L</kbd>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Add new Note</span>
              <kbd className={`px-2 py-1 text-xs font-semibold text-gray-200 ${themeClasses.kbdBg} border ${themeClasses.kbdBorder} rounded-md`}>N</kbd>
            </div>
             <div className="flex justify-between items-center">
              <span>Add new Event</span>
              <kbd className={`px-2 py-1 text-xs font-semibold text-gray-200 ${themeClasses.kbdBg} border ${themeClasses.kbdBorder} rounded-md`}>E</kbd>
            </div>
            <div className="flex justify-between items-center">
              <span>Toggle 'Add' Menu</span>
              <kbd className={`px-2 py-1 text-xs font-semibold text-gray-200 ${themeClasses.kbdBg} border ${themeClasses.kbdBorder} rounded-md`}>C</kbd>
            </div>
             <div className="flex justify-between items-center">
              <span>Toggle Utility Bar</span>
              <kbd className={`px-2 py-1 text-xs font-semibold text-gray-200 ${themeClasses.kbdBg} border ${themeClasses.kbdBorder} rounded-md`}>U</kbd>
            </div>
            <div className="flex justify-between items-center">
              <span>Open Settings</span>
              <kbd className={`px-2 py-1 text-xs font-semibold text-gray-200 ${themeClasses.kbdBg} border ${themeClasses.kbdBorder} rounded-md`}>?</kbd>
            </div>
          </div>
        </div>

        {/* Data Management Section */}
        <div>
          <h3 className="text-lg font-medium leading-6 text-white">Data Management</h3>
          <p className="text-sm text-gray-400 mt-1">Export your data to a file or import from a backup.</p>
          <div className="mt-4 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={onExport}
              className={`w-full justify-center inline-flex items-center px-4 py-2 border ${themeClasses.border} shadow-sm text-sm font-medium rounded-md text-white ${themeClasses.button} ${themeClasses.buttonHover} focus:outline-none focus:ring-2 focus:ring-offset-2 ${themeClasses.ringOffsetModal} ${accentClasses.ring}`}
            >
              Export Data
            </button>
            <button
              onClick={handleImportClick}
              className={`w-full justify-center inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${accentClasses.bg} hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 ${themeClasses.ringOffsetModal} ${accentClasses.ring}`}
            >
              Import Data
            </button>
            <input
              type="file"
              ref={importInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="application/json"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;