
import React from 'react';
import { AccentColor, LinkItem, ThemeClasses } from '../types';
import { ACCENT_COLOR_CLASSES } from '../constants';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface LinkCardProps {
  link: LinkItem;
  onDelete: (id: string) => void;
  accentColor: AccentColor;
  themeClasses: ThemeClasses;
}

const LinkCard: React.FC<LinkCardProps> = ({ link, onDelete, accentColor, themeClasses }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  const accentClasses = ACCENT_COLOR_CLASSES[accentColor];
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${link.url}&sz=64`;

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(link.id);
  };

  const getHostname = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch (e) {
      return url;
    }
  }

  return (
    <a 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      href={link.url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={`group relative aspect-square flex flex-col items-center justify-center ${themeClasses.card} rounded-lg p-4 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fadeIn cursor-grab active:cursor-grabbing`}
    >
      <img src={faviconUrl} alt="" className="w-12 h-12 mb-3 rounded-md object-contain pointer-events-none" />
      <div className="text-center w-full pointer-events-none">
        <p className={`font-semibold text-white group-hover:${accentClasses.text} transition-colors break-words text-sm`}>{link.title}</p>
        <p className="text-xs text-gray-400 truncate w-full">{getHostname(link.url)}</p>
      </div>
      <button 
        onClick={handleDelete} 
        onPointerDown={(e) => e.stopPropagation()}
        className={`absolute top-2 right-2 p-1.5 rounded-full text-gray-400 ${themeClasses.card} bg-opacity-50 hover:text-red-500 ${themeClasses.buttonHover} transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 z-10`}
        aria-label={`Delete link ${link.title}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </a>
  );
};

export default LinkCard;