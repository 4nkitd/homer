

import React, { useState } from 'react';
import Modal from './Modal';
import { AccentColor, ThemeClasses } from '../types';
import { ACCENT_COLOR_CLASSES } from '../constants';

interface AddLinkModalProps {
  onClose: () => void;
  onAdd: (url: string, title: string, category: string) => void;
  accentColor: AccentColor;
  themeClasses: ThemeClasses;
  categories: string[];
}

const AddLinkModal: React.FC<AddLinkModalProps> = ({ onClose, onAdd, accentColor, themeClasses, categories }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  
  const accentClasses = ACCENT_COLOR_CLASSES[accentColor];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url && title) {
      const finalCategory = isAddingNewCategory ? newCategory.trim() : category;
      onAdd(url.startsWith('http') ? url : `https://${url}`, title, finalCategory || 'General');
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
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="category" className="block text-sm font-medium text-gray-300">Folder</label>
            <button 
              type="button"
              onClick={() => setIsAddingNewCategory(!isAddingNewCategory)}
              className={`text-xs ${accentClasses.text} hover:underline`}
            >
              {isAddingNewCategory ? 'Select existing' : 'Create new'}
            </button>
          </div>
          {isAddingNewCategory ? (
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New folder name..."
              className={`block w-full ${themeClasses.input} border ${themeClasses.border} rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 ${accentClasses.ring} focus:border-transparent`}
              autoFocus
            />
          ) : (
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`block w-full ${themeClasses.input} border ${themeClasses.border} rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 ${accentClasses.ring} focus:border-transparent`}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              {!categories.includes('General') && <option value="General">General</option>}
            </select>
          )}
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