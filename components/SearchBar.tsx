
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { AccentColor, ThemeClasses, LinkItem, NoteItem, EventItem } from '../types';
import { ACCENT_COLOR_CLASSES } from '../constants';

interface SearchBarProps {
  accentColor: AccentColor;
  searchUrl: string;
  themeClasses: ThemeClasses;
  links: LinkItem[];
  notes: NoteItem[];
  events: EventItem[];
}

type SuggestionItem = 
  | { type: 'link'; id: string; title: string; url: string }
  | { type: 'note'; id: string; title: string; content: string }
  | { type: 'event'; id: string; title: string; date: string };

const SearchBar: React.FC<SearchBarProps> = ({ accentColor, searchUrl, themeClasses, links, notes, events }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const accentClasses = ACCENT_COLOR_CLASSES[accentColor];

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    
    const linkSuggestions: SuggestionItem[] = links
      .filter(link => 
        link.title.toLowerCase().includes(lowerQuery) || 
        link.url.toLowerCase().includes(lowerQuery)
      )
      .map(l => ({ type: 'link', id: l.id, title: l.title, url: l.url }));

    const noteSuggestions: SuggestionItem[] = notes
      .filter(note => 
        note.title.toLowerCase().includes(lowerQuery) || 
        note.content.toLowerCase().includes(lowerQuery)
      )
      .map(n => ({ type: 'note', id: n.id, title: n.title, content: n.content }));

    const eventSuggestions: SuggestionItem[] = events
      .filter(event => 
        event.title.toLowerCase().includes(lowerQuery) || 
        (event.description && event.description.toLowerCase().includes(lowerQuery))
      )
      .map(e => ({ type: 'event', id: e.id, title: e.title, date: e.date }));

    return [...linkSuggestions, ...noteSuggestions, ...eventSuggestions].slice(0, 10);
  }, [query, links, notes, events]);

  useEffect(() => {
    setSelectedIndex(-1);
    setShowSuggestions(query.length > 0);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchEngineName = useMemo(() => {
    if (!searchUrl) return 'Web';
    try {
      const url = new URL(searchUrl.split('{query}')[0]);
      let hostname = url.hostname;
      if (hostname.startsWith('www.')) {
        hostname = hostname.substring(4);
      }
      const parts = hostname.split('.');
      if (parts.length >= 2) {
        return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
      }
      return 'Web';
    } catch (e) {
      return 'Web';
    }
  }, [searchUrl]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      const item = suggestions[selectedIndex];
      if (item.type === 'link') {
        window.open(item.url, '_blank');
      } else if (item.type === 'note') {
        // For notes, maybe we just clear search and let user see it?
        // Or we could scroll to it. For now, just clear.
        alert(`Note: ${item.title}\n\n${item.content}`);
      } else if (item.type === 'event') {
        alert(`Event: ${item.title} on ${item.date}`);
      }
      setQuery('');
      setShowSuggestions(false);
      return;
    }

    if (query.trim()) {
      const urlToOpen = searchUrl.includes('{query}')
        ? searchUrl.replace('{query}', encodeURIComponent(query))
        : `${searchUrl}${encodeURIComponent(query)}`;
      window.open(urlToOpen, '_blank');
      setQuery('');
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > -1 ? prev - 1 : -1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="animate-fadeIn" ref={containerRef}>
      <form onSubmit={handleSearch} className="relative">
        <input
          id="search-bar"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(query.length > 0)}
          placeholder={`Search with ${searchEngineName}...`}
          autoComplete="off"
          className={`w-full py-3 pl-12 pr-4 ${themeClasses.card} border-2 border-transparent rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${accentClasses.ring} focus:border-transparent transition duration-300`}
        />
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className={`absolute z-50 w-full mt-2 py-2 ${themeClasses.modal} border ${themeClasses.border} rounded-2xl shadow-2xl overflow-hidden animate-fadeIn`}>
            {suggestions.map((item, index) => (
              <button
                key={`${item.type}-${item.id}`}
                type="button"
                onClick={() => {
                  if (item.type === 'link') window.open(item.url, '_blank');
                  else if (item.type === 'note') alert(`Note: ${item.title}\n\n${item.content}`);
                  else if (item.type === 'event') alert(`Event: ${item.title} on ${item.date}`);
                  setQuery('');
                  setShowSuggestions(false);
                }}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
                  selectedIndex === index ? `${accentClasses.bg} text-white` : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <div className={`p-2 rounded-lg mr-3 ${selectedIndex === index ? 'bg-white/20' : themeClasses.button}`}>
                  {item.type === 'link' && (
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  )}
                  {item.type === 'note' && (
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                  {item.type === 'event' && (
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <div className="flex flex-col overflow-hidden flex-grow">
                  <span className="font-medium truncate">{item.title}</span>
                  <span className={`text-xs truncate ${selectedIndex === index ? 'text-white/70' : 'text-gray-500'}`}>
                    {item.type === 'link' ? item.url : item.type === 'event' ? item.date : 'Note'}
                  </span>
                </div>
                <span className={`text-[10px] uppercase tracking-wider ml-2 opacity-40 ${selectedIndex === index ? 'text-white' : ''}`}>
                  {item.type}
                </span>
              </button>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;