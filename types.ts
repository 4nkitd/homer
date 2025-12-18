
import { BACKGROUND_THEMES } from './constants';

export interface LinkItem {
  id: string;
  url: string;
  title: string;
  createdAt: number;
  category?: string;
}

export interface NoteItem {
  id:string;
  title: string;
  content: string;
  createdAt: number;
}

export interface EventItem {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM, optional
  link?: string;
  description?: string;
  createdAt: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  createdAt: number;
}

export type AccentColor = 'blue' | 'green' | 'purple' | 'pink' | 'orange';
export type BackgroundName = 'gray' | 'slate' | 'onyx';

export interface Settings {
  showSearch: boolean;
  accentColor: AccentColor;
  searchUrl: string;
  backgroundName: BackgroundName;
}

export type DbStore = 'links' | 'notes' | 'events' | 'categories';

export type ThemeClasses = typeof BACKGROUND_THEMES[keyof typeof BACKGROUND_THEMES];