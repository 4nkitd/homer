
import React, { useState } from 'react';
import Modal from './Modal';
import { AccentColor, ThemeClasses } from '../types';
import { ACCENT_COLOR_CLASSES } from '../constants';

interface AddEventModalProps {
  onClose: () => void;
  onAdd: (title: string, date: string, time: string, link: string, description: string) => void;
  accentColor: AccentColor;
  themeClasses: ThemeClasses;
}

const AddEventModal: React.FC<AddEventModalProps> = ({ onClose, onAdd, accentColor, themeClasses }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('');
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const accentClasses = ACCENT_COLOR_CLASSES[accentColor];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && date) {
      onAdd(title, date, time, link, description);
    }
  };

  return (
    <Modal onClose={onClose} title="Add New Event" themeClasses={themeClasses}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="event-title" className="block text-sm font-medium text-gray-300">Title</label>
          <input
            type="text"
            id="event-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
            className={`mt-1 block w-full ${themeClasses.input} border ${themeClasses.border} rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 ${accentClasses.ring} focus:border-transparent`}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="event-date" className="block text-sm font-medium text-gray-300">Date</label>
            <input
              type="date"
              id="event-date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className={`mt-1 block w-full ${themeClasses.input} border ${themeClasses.border} rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 ${accentClasses.ring} focus:border-transparent`}
              style={{ colorScheme: 'dark' }}
            />
          </div>
          <div>
            <label htmlFor="event-time" className="block text-sm font-medium text-gray-300">Time (Optional)</label>
            <input
              type="time"
              id="event-time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={`mt-1 block w-full ${themeClasses.input} border ${themeClasses.border} rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 ${accentClasses.ring} focus:border-transparent`}
               style={{ colorScheme: 'dark' }}
            />
          </div>
        </div>
         <div>
          <label htmlFor="event-link" className="block text-sm font-medium text-gray-300">Meeting Link (Optional)</label>
          <input
            type="text"
            id="event-link"
            value={link}
            placeholder="https://meet.google.com/..."
            onChange={(e) => setLink(e.target.value)}
            className={`mt-1 block w-full ${themeClasses.input} border ${themeClasses.border} rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 ${accentClasses.ring} focus:border-transparent`}
          />
        </div>
         <div>
          <label htmlFor="event-description" className="block text-sm font-medium text-gray-300">Description (Optional)</label>
          <textarea
            id="event-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={`mt-1 block w-full ${themeClasses.input} border ${themeClasses.border} rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 ${accentClasses.ring} focus:border-transparent`}
          />
        </div>
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className={`px-4 py-2 text-sm font-medium text-white ${accentClasses.bg} rounded-md shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 ${themeClasses.ringOffsetModal} ${accentClasses.ring}`}
          >
            Add Event
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEventModal;