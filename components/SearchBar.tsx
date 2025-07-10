
import React, { useState, useMemo } from 'react';
import { AccentColor, ThemeClasses } from '../types';
import { ACCENT_COLOR_CLASSES } from '../constants';

interface SearchBarProps {
  accentColor: AccentColor;
  searchUrl: string;
  themeClasses: ThemeClasses;
}

const SearchBar: React.FC<SearchBarProps> = ({ accentColor, searchUrl, themeClasses }) => {
  const [query, setQuery] = useState('');
  const accentClasses = ACCENT_COLOR_CLASSES[accentColor];

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const urlToOpen = searchUrl.includes('{query}')
        ? searchUrl.replace('{query}', encodeURIComponent(query))
        : `${searchUrl}${encodeURIComponent(query)}`;
      window.open(urlToOpen, '_blank');
      setQuery('');
    }
  };

  return (
    <div className="my-8 animate-fadeIn">
      <form onSubmit={handleSearch} className="relative">
        <input
          id="search-bar"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search with ${searchEngineName}...`}
          className={`w-full py-3 pl-12 pr-4 ${themeClasses.card} border-2 border-transparent rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${accentClasses.ring} focus:border-transparent transition duration-300`}
        />
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;