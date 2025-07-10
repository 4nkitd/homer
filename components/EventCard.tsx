
import React from 'react';
import { EventItem, ThemeClasses } from '../types';

interface EventCardProps {
  event: EventItem;
  onDelete: (id: string) => void;
  themeClasses: ThemeClasses;
}

const EventCard: React.FC<EventCardProps> = ({ event, onDelete, themeClasses }) => {
  
  const formatEventDate = (dateStr: string) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const eventDate = new Date(dateStr + 'T00:00:00');

    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      weekday: 'short',
    }).format(eventDate);
  };

  const formatEventTime = (time: string) => {
    if (!time) return 'All-day';
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(date);
  };

  return (
    <div className={`relative group ${themeClasses.card} rounded-lg p-3 shadow-md transition-all duration-300 flex items-start space-x-4 animate-fadeIn`}>
      <div className="flex-shrink-0 text-center w-20 pt-1">
        <p className="font-bold text-white">{formatEventDate(event.date)}</p>
        <p className="text-xs text-gray-400">{formatEventTime(event.time)}</p>
      </div>
      <div className={`w-px self-stretch ${themeClasses.border} rounded-full`}></div>
      <div className="flex-grow min-w-0 pr-6">
        <div className="flex items-center justify-between">
          <p className="text-gray-200 break-words font-semibold">{event.title}</p>
          {event.link && (
             <a href={event.link.startsWith('http') ? event.link : `https://${event.link}`} target="_blank" rel="noopener noreferrer" className={`ml-2 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white ${themeClasses.buttonHover} transition-colors`} aria-label="Open event link">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
             </a>
           )}
        </div>
        {event.description && (
          <p className="text-sm text-gray-400 mt-1 whitespace-pre-wrap break-words">{event.description}</p>
        )}
      </div>
      <button 
        onClick={() => onDelete(event.id)} 
        className={`absolute top-2 right-2 p-1.5 rounded-full text-gray-500 hover:text-red-500 hover:${themeClasses.buttonHover} transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100`}
        aria-label={`Delete event ${event.title}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
           <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default EventCard;