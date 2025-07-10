

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
    <Modal onClose={onClose} title="Add New Note" themeClasses={themeClasses}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="note-title" className="block text-sm font-medium text-gray-300">Title</label>
          <input
            type="text"
            id="note-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={`mt-1 block w-full ${themeClasses.input} border ${themeClasses.border} rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 ${accentClasses.ring} focus:border-transparent`}
          />
        </div>
        <div>
          <label htmlFor="note-content" className="block text-sm font-medium text-gray-300">Content</label>
          <textarea
            id="note-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={4}
            className={`mt-1 block w-full ${themeClasses.input} border ${themeClasses.border} rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 ${accentClasses.ring} focus:border-transparent`}
          />
        </div>
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className={`px-4 py-2 text-sm font-medium text-white ${accentClasses.bg} rounded-md shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 ${themeClasses.ringOffsetModal} ${accentClasses.ring}`}
          >
            Add Note
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddNoteModal;