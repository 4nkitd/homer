
import { AccentColor, BackgroundName } from './types';

export const DB_NAME = 'PersonalDashboardDB';
export const DB_VERSION = 1;
export const LINK_STORE = 'links';
export const NOTE_STORE = 'notes';
export const EVENT_STORE = 'events';

export const ACCENT_COLORS: AccentColor[] = ['blue', 'green', 'purple', 'pink', 'orange'];

export const ACCENT_COLOR_CLASSES: Record<AccentColor, { bg: string; text: string; ring: string; border: string }> = {
  blue: { bg: 'bg-blue-600', text: 'text-blue-400', ring: 'focus:ring-blue-500', border: 'border-blue-500' },
  green: { bg: 'bg-green-600', text: 'text-green-400', ring: 'focus:ring-green-500', border: 'border-green-500' },
  purple: { bg: 'bg-purple-600', text: 'text-purple-400', ring: 'focus:ring-purple-500', border: 'border-purple-500' },
  pink: { bg: 'bg-pink-600', text: 'text-pink-400', ring: 'focus:ring-pink-500', border: 'border-pink-500' },
  orange: { bg: 'bg-orange-600', text: 'text-orange-400', ring: 'focus:ring-orange-500', border: 'border-orange-500' },
};

export const BACKGROUND_NAMES: BackgroundName[] = ['gray', 'slate', 'onyx'];

export const BACKGROUND_THEMES: Record<BackgroundName, {
  name: string;
  body: string;
  card: string;
  input: string;
  modal: string;
  button: string;
  buttonHover: string;
  ringOffsetBody: string;
  ringOffsetModal: string;
  border: string;
  toggleOff: string;
  kbdBg: string;
  kbdBorder: string;
}> = {
  gray: {
    name: 'Gray',
    body: 'bg-gray-900',
    card: 'bg-gray-800',
    input: 'bg-gray-700',
    modal: 'bg-gray-800',
    button: 'bg-gray-700',
    buttonHover: 'hover:bg-gray-600',
    ringOffsetBody: 'ring-offset-gray-900',
    ringOffsetModal: 'ring-offset-gray-800',
    border: 'border-gray-700',
    toggleOff: 'bg-gray-600',
    kbdBg: 'bg-gray-600',
    kbdBorder: 'border-gray-500',
  },
  slate: {
    name: 'Slate',
    body: 'bg-slate-900',
    card: 'bg-slate-800',
    input: 'bg-slate-700',
    modal: 'bg-slate-800',
    button: 'bg-slate-700',
    buttonHover: 'hover:bg-slate-600',
    ringOffsetBody: 'ring-offset-slate-900',
    ringOffsetModal: 'ring-offset-slate-800',
    border: 'border-slate-700',
    toggleOff: 'bg-slate-600',
    kbdBg: 'bg-slate-600',
    kbdBorder: 'border-slate-500',
  },
  onyx: {
    name: 'Onyx',
    body: 'bg-black',
    card: 'bg-gray-900',
    input: 'bg-gray-800',
    modal: 'bg-gray-900',
    button: 'bg-gray-800',
    buttonHover: 'hover:bg-gray-700',
    ringOffsetBody: 'ring-offset-black',
    ringOffsetModal: 'ring-offset-gray-900',
    border: 'border-gray-800',
    toggleOff: 'bg-gray-700',
    kbdBg: 'bg-gray-700',
    kbdBorder: 'border-gray-600',
  },
};