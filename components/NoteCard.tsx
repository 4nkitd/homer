
import React from 'react';
import { AccentColor, NoteItem, ThemeClasses } from '../types';
import { ACCENT_COLOR_CLASSES } from '../constants';

interface NoteCardProps {
  note: NoteItem;
  onDelete: (id: string) => void;
  accentColor: AccentColor;
  themeClasses: ThemeClasses;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onDelete, accentColor, themeClasses }) => {
  const accentClasses = ACCENT_COLOR_CLASSES[accentColor];

  return (
    <div className={`relative group ${themeClasses.card} rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col animate-fadeIn hover:-translate-y-1`}>
      <div className="flex-grow flex flex-col">
        <h3 className={`font-bold text-lg mb-2 ${accentClasses.text} pr-8`}>{note.title}</h3>
        <p className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed flex-grow break-words">{note.content}</p>
        <p className={`text-xs text-gray-500 mt-4 text-right pt-2 border-t ${themeClasses.border}/50`}>{new Date(note.createdAt).toLocaleDateString()}</p>
      </div>
      <button 
        onClick={() => onDelete(note.id)} 
        className={`absolute top-2 right-2 p-1.5 rounded-full text-gray-400 ${themeClasses.card} bg-opacity-50 hover:text-red-500 ${themeClasses.buttonHover} transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100`}
        aria-label={`Delete note ${note.title}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
           <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default NoteCard;