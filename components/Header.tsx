
import React, { useState, useEffect } from 'react';
import { AccentColor, ThemeClasses, EventItem } from '../types';
import { ACCENT_COLOR_CLASSES } from '../constants';

interface HeaderProps {
  onSettingsClick: () => void;
  accentColor: AccentColor;
  themeClasses: ThemeClasses;
  eventsToday: EventItem[];
  weatherCity?: string;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick, accentColor, themeClasses, eventsToday }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const accentClasses = ACCENT_COLOR_CLASSES[accentColor];

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(currentDate);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(currentDate);

  const formatEventTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(date);
  }

  return (
    <header className="flex justify-between items-start mb-10">
      <div className="flex-1">
        <div className="flex flex-col">
          <div className="flex items-baseline space-x-4">
            <h1 className={`text-4xl sm:text-5xl font-bold ${accentClasses.text} tabular-nums tracking-tight`}>{formattedTime}</h1>
            <p className="text-gray-400 text-xl sm:text-2xl font-light">{formattedDate}</p>
          </div>
          
          <div className="mt-6 flex flex-col space-y-4">
            {/* Events Section */}
            <div className="space-y-3">
              {eventsToday.length > 0 ? (
                eventsToday.map(event => (
                  <div key={event.id} className="flex items-center space-x-4 text-gray-400 animate-fadeIn group pl-1">
                    <div className={`w-1 h-8 rounded-full ${accentClasses.bg} opacity-40 group-hover:opacity-100 transition-all duration-300`} />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        {event.time ? formatEventTime(event.time) : 'All-day'}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-200 group-hover:text-white transition-colors font-medium">{event.title}</span>
                        {event.link && (
                          <a href={event.link.startsWith('http') ? event.link : `https://${event.link}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors" aria-label="Open event link">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center space-x-2 text-gray-500 pl-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm italic">No events scheduled for today.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={onSettingsClick}
        className={`p-2 rounded-full text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 ${themeClasses.ringOffsetBody} ${accentClasses.ring}`}
        aria-label="Open settings"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </header>
  );
};

export default Header;