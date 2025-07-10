

import React, { useState } from 'react';
import Modal from './Modal';
import { AccentColor, ThemeClasses } from '../types';
import { ACCENT_COLOR_CLASSES } from '../constants';

interface AddLinkModalProps {
  onClose: () => void;
  onAdd: (url: string, title: string) => void;
  accentColor: AccentColor;
  themeClasses: ThemeClasses;
}

const AddLinkModal: React.FC<AddLinkModalProps> = ({ onClose, onAdd, accentColor, themeClasses }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const accentClasses = ACCENT_COLOR_CLASSES[accentColor];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url && title) {
      onAdd(url.startsWith('http') ? url : `https://${url}`, title);
    }
  };

  return (
    <Modal onClose={onClose} title="Add New Link" themeClasses={themeClasses}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={`mt-1 block w-full ${themeClasses.input} border ${themeClasses.border} rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 ${accentClasses.ring} focus:border-transparent`}
          />
        </div>
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-300">URL</label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            placeholder="example.com"
            className={`mt-1 block w-full ${themeClasses.input} border ${themeClasses.border} rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 ${accentClasses.ring} focus:border-transparent`}
          />
        </div>
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className={`px-4 py-2 text-sm font-medium text-white ${accentClasses.bg} rounded-md shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 ${themeClasses.ringOffsetModal} ${accentClasses.ring}`}
          >
            Add Link
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddLinkModal;