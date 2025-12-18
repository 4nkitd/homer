import React, { useRef, useState } from 'react';
import Modal from './Modal';
import { Settings, AccentColor, ThemeClasses, BackgroundName } from '../types';
import { ACCENT_COLORS, ACCENT_COLOR_CLASSES, BACKGROUND_NAMES, BACKGROUND_THEMES } from '../constants';

interface SettingsModalProps {
  onClose: () => void;
  settings: Settings;
  onUpdateSettings: (newSettings: Partial<Settings>) => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onDeleteAllData: () => void;
  themeClasses: ThemeClasses;
  categories: string[];
  onRenameFolder: (oldName: string, newName: string) => void;
  onDeleteFolder: (name: string) => void;
  onCreateFolder: (name: string) => void;
}

type Tab = 'personalization' | 'folders' | 'search' | 'shortcuts' | 'data' | 'danger';

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  onClose, 
  settings, 
  onUpdateSettings, 
  onExport, 
  onImport, 
  onDeleteAllData, 
  themeClasses,
  categories,
  onRenameFolder,
  onDeleteFolder,
  onCreateFolder
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('personalization');
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [createFolderName, setCreateFolderName] = useState('');
  const importInputRef = useRef<HTMLInputElement>(null);

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
    setCaptchaInput('');
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === 'danger') {
      generateCaptcha();
    }
  };

  const handleDeleteAll = () => {
    if (captchaInput.toUpperCase() === captcha) {
      if (confirm('Are you absolutely sure? This will permanently delete all your links, notes, and events.')) {
        onDeleteAllData();
        onClose();
      }
    } else {
      alert('Invalid captcha. Please try again.');
      generateCaptcha();
    }
  };

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

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'personalization', label: 'Personalization', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg> },
    { id: 'folders', label: 'Folders', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg> },
    { id: 'search', label: 'Search', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> },
    { id: 'shortcuts', label: 'Shortcuts', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg> },
    { id: 'data', label: 'Data', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg> },
    { id: 'danger', label: 'Danger Zone', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> },
  ];

  return (
    <Modal onClose={onClose} title="Settings" themeClasses={themeClasses} maxWidth="max-w-4xl" noPadding>
      <div className="flex flex-col md:flex-row h-[60vh] md:h-[500px]">
        {/* Sidebar */}
        <div className={`md:w-64 flex-shrink-0 border-b md:border-b-0 md:border-r ${themeClasses.border} overflow-y-auto`}>
          <nav className="p-2 space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? tab.id === 'danger' ? 'bg-red-600 text-white' : `${accentClasses.bg} text-white`
                    : `text-gray-300 ${themeClasses.buttonHover}`
                }`}
              >
                <span className="mr-3">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'personalization' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-lg font-medium leading-6 text-white mb-4">Accent Color</h3>
                <div className="flex flex-wrap gap-3">
                  {ACCENT_COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => onUpdateSettings({ accentColor: color })}
                      className={`w-10 h-10 rounded-full ${ACCENT_COLOR_CLASSES[color].bg} focus:outline-none transition-transform transform hover:scale-110 ${settings.accentColor === color ? `ring-2 ring-offset-2 ${themeClasses.ringOffsetModal} ring-white` : ''}`}
                      aria-label={`Set accent color to ${color}`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium leading-6 text-white mb-4">Background Theme</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {BACKGROUND_NAMES.map(name => {
                    const theme = BACKGROUND_THEMES[name];
                    return (
                      <button
                        key={name}
                        onClick={() => onUpdateSettings({ backgroundName: name })}
                        className={`text-left p-3 rounded-lg focus:outline-none transition-all ${settings.backgroundName === name ? `ring-2 ${accentClasses.ring}` : 'ring-1 ring-transparent'} ${theme.card} border ${themeClasses.border}`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full ${theme.body} ring-1 ring-white/20 shadow-inner`}></div>
                          <span className="font-medium text-white">{theme.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'folders' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white">Manage Folders</h3>
                  <p className="text-sm text-gray-400">Rename or delete your bookmark categories.</p>
                </div>
                <button
                  onClick={() => setIsCreatingFolder(true)}
                  className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md ${accentClasses.bg} text-white hover:opacity-90 transition-opacity`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Folder
                </button>
              </div>

              {isCreatingFolder && (
                <div className={`p-4 rounded-lg ${themeClasses.card} border ${themeClasses.border} animate-fadeIn`}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Folder Name</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={createFolderName}
                      onChange={(e) => setCreateFolderName(e.target.value)}
                      placeholder="Enter folder name..."
                      className={`flex-1 px-3 py-2 rounded-md ${themeClasses.input} border ${themeClasses.border} text-white focus:outline-none focus:ring-2 ${accentClasses.ring}`}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          onCreateFolder(createFolderName);
                          setCreateFolderName('');
                          setIsCreatingFolder(false);
                        } else if (e.key === 'Escape') {
                          setIsCreatingFolder(false);
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        onCreateFolder(createFolderName);
                        setCreateFolderName('');
                        setIsCreatingFolder(false);
                      }}
                      className={`px-4 py-2 rounded-md ${accentClasses.bg} text-white font-medium`}
                    >
                      Create
                    </button>
                    <button
                      onClick={() => setIsCreatingFolder(false)}
                      className="px-4 py-2 rounded-md bg-gray-600 text-white font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
                
              <div className="space-y-2">
                  {categories.map(category => (
                    <div key={category} className={`flex items-center justify-between p-3 rounded-lg ${themeClasses.button} border ${themeClasses.border}`}>
                      {editingFolder === category ? (
                        <div className="flex-1 flex items-center space-x-2">
                          <input
                            type="text"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            className={`flex-1 px-2 py-1 rounded ${themeClasses.input} border ${themeClasses.border} text-white text-sm focus:outline-none focus:ring-1 ${accentClasses.ring}`}
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                onRenameFolder(category, newFolderName);
                                setEditingFolder(null);
                              } else if (e.key === 'Escape') {
                                setEditingFolder(null);
                              }
                            }}
                          />
                          <button 
                            onClick={() => {
                              onRenameFolder(category, newFolderName);
                              setEditingFolder(null);
                            }}
                            className={`p-1 rounded ${accentClasses.bg} text-white`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => setEditingFolder(null)}
                            className="p-1 rounded bg-gray-600 text-white"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-3 ${accentClasses.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                            <span className="text-sm text-white font-medium">{category}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <button 
                              onClick={() => {
                                setEditingFolder(category);
                                setNewFolderName(category);
                              }}
                              className="p-2 text-gray-400 hover:text-white transition-colors"
                              title="Rename folder"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            {category !== 'General' && (
                              <button 
                                onClick={() => onDeleteFolder(category)}
                                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                                title="Delete folder"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
          )}

          {activeTab === 'search' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-white">Show Search Bar</h3>
                  <p className="text-sm text-gray-400">Enable or disable the search bar on the dashboard.</p>
                </div>
                <button
                  onClick={() => onUpdateSettings({ showSearch: !settings.showSearch })}
                  className={`${settings.showSearch ? accentClasses.bg : themeClasses.toggleOff} relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${themeClasses.ringOffsetModal} ${accentClasses.ring}`}
                >
                  <span className={`${settings.showSearch ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
                </button>
              </div>
              <div>
                <label htmlFor="search-url" className="block text-lg font-medium leading-6 text-white mb-2">
                  Search Engine URL
                </label>
                <input
                  id="search-url"
                  type="text"
                  value={settings.searchUrl}
                  onChange={(e) => onUpdateSettings({ searchUrl: e.target.value })}
                  className={`block w-full ${themeClasses.input} border ${themeClasses.border} rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 ${accentClasses.ring} focus:border-transparent`}
                />
                <p className="mt-2 text-sm text-gray-400">
                  Use <code className={`${themeClasses.button} px-1 py-0.5 rounded-sm text-white`}>{`{query}`}</code> as a placeholder for the search term.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'shortcuts' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-lg font-medium leading-6 text-white mb-4">Keyboard Shortcuts</h3>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { label: 'Focus Search', keys: ['S'] },
                  { label: 'Add new Link', keys: ['A', 'L'] },
                  { label: 'Add new Note', keys: ['N'] },
                  { label: 'Add new Event', keys: ['E'] },
                  { label: 'Toggle \'Add\' Menu', keys: ['C'] },
                  { label: 'Toggle Utility Bar', keys: ['U'] },
                  { label: 'Open Settings', keys: ['?'] },
                ].map((shortcut, index) => (
                  <div key={index} className={`flex justify-between items-center p-3 rounded-lg ${themeClasses.card} border ${themeClasses.border}`}>
                    <span className="text-gray-200">{shortcut.label}</span>
                    <div className="flex space-x-2">
                      {shortcut.keys.map((key, kIndex) => (
                        <React.Fragment key={key}>
                          {kIndex > 0 && <span className="text-gray-500 self-center">or</span>}
                          <kbd className={`px-2.5 py-1.5 text-sm font-bold text-gray-200 ${themeClasses.kbdBg} border ${themeClasses.kbdBorder} rounded-md shadow-sm`}>{key}</kbd>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-lg font-medium leading-6 text-white">Export Data</h3>
                <p className="text-sm text-gray-400 mt-1">Download a backup of your links, notes, and events.</p>
                <button
                  onClick={onExport}
                  className={`mt-3 inline-flex items-center px-4 py-2 border ${themeClasses.border} shadow-sm text-sm font-medium rounded-md text-white ${themeClasses.button} ${themeClasses.buttonHover} focus:outline-none focus:ring-2 focus:ring-offset-2 ${themeClasses.ringOffsetModal} ${accentClasses.ring}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export JSON Backup
                </button>
              </div>
              
              <div className={`border-t ${themeClasses.border} pt-6`}>
                <h3 className="text-lg font-medium leading-6 text-white">Import Data</h3>
                <p className="text-sm text-gray-400 mt-1">Restore from a JSON backup or import Chrome bookmarks.</p>
                <div className="mt-3">
                  <button
                    onClick={handleImportClick}
                    className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${accentClasses.bg} hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 ${themeClasses.ringOffsetModal} ${accentClasses.ring}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Import File (JSON or HTML)
                  </button>
                  <input
                    type="file"
                    ref={importInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".json,.html"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Supported formats: Homer Backup (.json), Chrome Bookmarks (.html)
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'danger' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-lg">
                <h3 className="text-lg font-medium leading-6 text-red-400 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Delete All Data
                </h3>
                <p className="text-sm text-red-300/80 mt-2">
                  This action is irreversible. It will permanently delete all your links, notes, and events from this browser's local storage.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    To confirm, please enter the captcha below:
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className={`px-4 py-2 bg-gray-700 rounded font-mono text-xl tracking-widest text-white select-none border ${themeClasses.border}`}>
                      {captcha}
                    </div>
                    <button 
                      onClick={generateCaptcha}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                      title="Refresh Captcha"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  placeholder="Enter captcha"
                  className={`block w-full ${themeClasses.input} border ${themeClasses.border} rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                />

                <button
                  onClick={handleDeleteAll}
                  disabled={captchaInput.toUpperCase() !== captcha}
                  className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 ${themeClasses.ringOffsetModal} focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Permanently Delete Everything
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;
