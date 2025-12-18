
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { AccentColor, ThemeClasses, LinkItem } from '../types';
import { ACCENT_COLOR_CLASSES } from '../constants';

interface SearchBarProps {
  accentColor: AccentColor;
  searchUrl: string;
  themeClasses: ThemeClasses;
  links: LinkItem[];
}

const SearchBar: React.FC<SearchBarProps> = ({ accentColor, searchUrl, themeClasses, links }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const accentClasses = ACCENT_COLOR_CLASSES[accentColor];

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return links
      .filter(link => 
        link.title.toLowerCase().includes(lowerQuery) || 
        link.url.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 8); // Limit to 8 suggestions
  }, [query, links]);

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
      window.open(suggestions[selectedIndex].url, '_blank');
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
    <div className="my-8 animate-fadeIn" ref={containerRef}>
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
            {suggestions.map((link, index) => (
              <button
                key={link.id}
                type="button"
                onClick={() => {
                  window.open(link.url, '_blank');
                  setQuery('');
                  setShowSuggestions(false);
                }}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
                  selectedIndex === index ? `${accentClasses.bg} text-white` : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <div className={`p-2 rounded-lg mr-3 ${selectedIndex === index ? 'bg-white/20' : themeClasses.button}`}>
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="font-medium truncate">{link.title}</span>
                  <span className={`text-xs truncate ${selectedIndex === index ? 'text-white/70' : 'text-gray-500'}`}>{link.url}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;