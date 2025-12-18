
import React, { useState } from 'react';
import { AccentColor, NoteItem, ThemeClasses } from '../types';
import { ACCENT_COLOR_CLASSES } from '../constants';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Modal from './Modal';

interface NoteCardProps {
  note: NoteItem;
  onDelete: (id: string) => void;
  onUpdate: (note: NoteItem) => void;
  accentColor: AccentColor;
  themeClasses: ThemeClasses;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onDelete, onUpdate, accentColor, themeClasses }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: note.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  const accentClasses = ACCENT_COLOR_CLASSES[accentColor];

  const handleSave = () => {
    onUpdate({
      ...note,
      title: editTitle,
      content: editContent,
    });
    setIsExpanded(false);
  };

  return (
    <>
      <div 
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`relative group ${themeClasses.card} rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col animate-fadeIn hover:-translate-y-1 cursor-grab active:cursor-grabbing h-[300px] overflow-hidden`}
      >
        <div className="flex-grow flex flex-col pointer-events-none overflow-hidden">
          <h3 className={`font-bold text-lg mb-2 ${accentClasses.text} pr-16 shrink-0`}>{note.title}</h3>
          <div className="flex-grow overflow-hidden relative">
            <p className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed break-words">
              {note.content}
            </p>
            <div className={`absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t ${themeClasses.card.replace('bg-', 'from-')} to-transparent`} />
          </div>
          <p className={`text-xs text-gray-500 mt-2 text-right pt-2 border-t ${themeClasses.border}/50 shrink-0`}>
            {new Date(note.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200 z-10">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(true);
            }} 
            onPointerDown={(e) => e.stopPropagation()}
            className={`p-2 rounded-full text-gray-400 ${themeClasses.card} bg-opacity-80 hover:text-white ${themeClasses.buttonHover} transition-all duration-200 shadow-lg border ${themeClasses.border}`}
            title="Expand / Edit Note"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteConfirm(true);
            }} 
            onPointerDown={(e) => e.stopPropagation()}
            className={`p-2 rounded-full text-gray-400 ${themeClasses.card} bg-opacity-80 hover:text-red-500 ${themeClasses.buttonHover} transition-all duration-200 shadow-lg border ${themeClasses.border}`}
            title="Delete Note"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
               <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <Modal
          onClose={() => setShowDeleteConfirm(false)}
          title="Delete Note"
          themeClasses={themeClasses}
          maxWidth="max-w-sm"
        >
          <div className="space-y-4">
            <p className="text-gray-300">Are you sure you want to delete this note? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className={`px-4 py-2 rounded-md text-gray-300 ${themeClasses.buttonHover} transition-colors`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(note.id);
                  setShowDeleteConfirm(false);
                }}
                className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

      {isExpanded && (
        <Modal 
          onClose={() => setIsExpanded(false)} 
          title="Edit Note" 
          themeClasses={themeClasses}
          maxWidth="max-w-4xl"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className={`w-full ${themeClasses.input} border ${themeClasses.border} rounded-md p-3 text-white focus:outline-none focus:ring-2 ${accentClasses.ring} text-lg font-bold`}
                placeholder="Note Title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Content</label>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className={`w-full ${themeClasses.input} border ${themeClasses.border} rounded-md p-3 text-white focus:outline-none focus:ring-2 ${accentClasses.ring} min-h-[400px] resize-none leading-relaxed`}
                placeholder="Start typing..."
              />
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-700">
              <span className="text-xs text-gray-500">
                Created on {new Date(note.createdAt).toLocaleString()}
              </span>
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsExpanded(false)}
                  className={`px-4 py-2 rounded-md text-gray-300 ${themeClasses.buttonHover} transition-colors`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className={`px-6 py-2 rounded-md text-white ${accentClasses.bg} hover:opacity-90 transition-opacity font-medium`}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default NoteCard;