

import React, { useState } from 'react';
import Modal from './Modal';
import { AccentColor, ThemeClasses } from '../types';
import { ACCENT_COLOR_CLASSES } from '../constants';

interface AddNoteModalProps {
  onClose: () => void;
  onAdd: (title: string, content: string) => void;
  accentColor: AccentColor;
  themeClasses: ThemeClasses;
}

const AddNoteModal: React.FC<AddNoteModalProps> = ({ onClose, onAdd, accentColor, themeClasses }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const accentClasses = ACCENT_COLOR_CLASSES[accentColor];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && content) {
      onAdd(title, content);
    }
  };

  return (
    <Modal onClose={onClose} title="Add New Note" themeClasses={themeClasses} maxWidth="max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="note-title" className="block text-sm font-medium text-gray-400 mb-1">Title</label>
          <input
            type="text"
            id="note-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Note Title"
            className={`block w-full ${themeClasses.input} border ${themeClasses.border} rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 ${accentClasses.ring} focus:border-transparent text-lg font-bold`}
          />
        </div>
        <div>
          <label htmlFor="note-content" className="block text-sm font-medium text-gray-400 mb-1">Content</label>
          <textarea
            id="note-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={12}
            placeholder="Start typing your note here..."
            className={`block w-full ${themeClasses.input} border ${themeClasses.border} rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 ${accentClasses.ring} focus:border-transparent resize-none leading-relaxed`}
          />
        </div>
        <div className="flex justify-end pt-4 border-t border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className={`mr-3 px-4 py-2 text-sm font-medium text-gray-300 ${themeClasses.buttonHover} rounded-md transition-colors`}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-6 py-2 text-sm font-medium text-white ${accentClasses.bg} rounded-md shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 ${themeClasses.ringOffsetModal} ${accentClasses.ring} transition-opacity`}
          >
            Add Note
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddNoteModal;