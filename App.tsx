
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LinkItem, NoteItem, Settings, EventItem, CategoryItem } from './types';
import { add, getAll, remove, clear, update } from './services/dbService';
import { parseJsonBackup, parseChromeBookmarks } from './services/importService';
import { ACCENT_COLOR_CLASSES, LINK_STORE, NOTE_STORE, EVENT_STORE, BACKGROUND_THEMES, CATEGORY_STORE } from './constants';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import WeatherPill from './components/WeatherPill';
import FolderHeader from './components/FolderHeader';
import SortableCollapsedFolder from './components/SortableCollapsedFolder';
import LinkCard from './components/LinkCard';
import NoteCard from './components/NoteCard';
import EventCard from './components/EventCard';
import AddItemButtons from './components/AddItemButtons';
import AddLinkModal from './components/AddLinkModal';
import AddNoteModal from './components/AddNoteModal';
import AddEventModal from './components/AddEventModal';
import SettingsModal from './components/SettingsModal';
import UtilityBar from './components/UtilityBar';
import AIChatView from './components/AIChatView';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

const App: React.FC = () => {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [settings, setSettings] = useState<Settings>({
    showSearch: true,
    accentColor: 'blue',
    searchUrl: 'https://www.google.com/search?q={query}&udm=14&as_qdr=all&as_occt=any',
    backgroundName: 'gray',
    autoLocation: false,
  });
  const [isLinkModalOpen, setLinkModalOpen] = useState(false);
  const [isNoteModalOpen, setNoteModalOpen] = useState(false);
  const [isEventModalOpen, setEventModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [isUtilityBarOpen, setUtilityBarOpen] = useState(false);
  const [isAIChatOpen, setAIChatOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [collapsedFolders, setCollapsedFolders] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('collapsed-folders');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [collapsedNotes, setCollapsedNotes] = useState<boolean>(() => {
    return localStorage.getItem('collapsed-notes') === 'true';
  });
  const [isLoading, setIsLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const themeClasses = useMemo(() => BACKGROUND_THEMES[settings.backgroundName], [settings.backgroundName]);

  useEffect(() => {
    localStorage.setItem('collapsed-folders', JSON.stringify(Array.from(collapsedFolders)));
  }, [collapsedFolders]);

  useEffect(() => {
    localStorage.setItem('collapsed-notes', collapsedNotes.toString());
  }, [collapsedNotes]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [dbLinks, dbNotes, dbEvents, dbCategories] = await Promise.all([
        getAll<LinkItem>(LINK_STORE),
        getAll<NoteItem>(NOTE_STORE),
        getAll<EventItem>(EVENT_STORE),
        getAll<CategoryItem>(CATEGORY_STORE),
      ]);
      
      // Sort by order if available, then by createdAt
      const sortItems = (a: any, b: any) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        if (a.order !== undefined) return -1;
        if (b.order !== undefined) return 1;
        return b.createdAt - a.createdAt;
      };

      setLinks(dbLinks.sort(sortItems));
      setNotes(dbNotes.sort(sortItems));
      setEvents(dbEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.time.localeCompare(b.time)));
      
      // Sort categories by order, then alphabetical
      setCategories(dbCategories.sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        if (a.order !== undefined) return -1;
        if (b.order !== undefined) return 1;
        return a.name.localeCompare(b.name);
      }));
    } catch (error) {
      console.error("Failed to load data from DB", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedSettings = localStorage.getItem('dashboard-settings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(prev => ({ ...prev, ...parsedSettings }));
    }
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!settings.autoLocation) return;

    const CACHE_KEY = 'cached-location';
    const CACHE_TIME_KEY = 'cached-location-time';
    const SIX_HOURS = 6 * 60 * 60 * 1000;

    const fetchLocation = async () => {
      try {
        const response = await fetch('https://ipinfo.io/json');
        const data = await response.json();
        if (data.city) {
          setSettings(prev => ({ ...prev, weatherCity: data.city }));
          localStorage.setItem(CACHE_KEY, data.city);
          localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
        }
      } catch (error) {
        console.error("Failed to fetch location:", error);
      }
    };

    const cachedCity = localStorage.getItem(CACHE_KEY);
    const cachedTime = localStorage.getItem(CACHE_TIME_KEY);

    if (cachedCity && cachedTime && (Date.now() - parseInt(cachedTime)) < SIX_HOURS) {
      if (settings.weatherCity !== cachedCity) {
        setSettings(prev => ({ ...prev, weatherCity: cachedCity }));
      }
    } else {
      fetchLocation();
    }
  }, [settings.autoLocation, settings.weatherCity]);

  useEffect(() => {
    localStorage.setItem('dashboard-settings', JSON.stringify(settings));
    document.body.className = '';
    document.body.classList.add(themeClasses.body);
  }, [settings, themeClasses]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const targetNodeName = (event.target as HTMLElement).nodeName;
      const isModalOpen = isLinkModalOpen || isNoteModalOpen || isSettingsModalOpen || isEventModalOpen || isAIChatOpen;
      if (targetNodeName === 'INPUT' || targetNodeName === 'TEXTAREA' || (isModalOpen && event.key !== 'Escape')) {
        if (isAIChatOpen && (event.metaKey || event.ctrlKey) && event.key === 'i') {
          event.preventDefault();
          setAIChatOpen(false);
        }
        return;
      }

      if ((event.metaKey || event.ctrlKey) && event.key === 'i') {
        event.preventDefault();
        setAIChatOpen(prev => !prev);
        return;
      }

      switch (event.key) {
        case 's':
          if (settings.showSearch) {
            event.preventDefault();
            document.getElementById('search-bar')?.focus();
          }
          break;
        case 'a':
        case 'l':
          event.preventDefault();
          setLinkModalOpen(true);
          break;
        case 'n':
          event.preventDefault();
          setNoteModalOpen(true);
          break;
        case 'e':
          event.preventDefault();
          setEventModalOpen(true);
          break;
        case 'c':
          event.preventDefault();
          (document.getElementById('fab-toggle-button') as HTMLButtonElement)?.click();
          break;
        case 'u':
            event.preventDefault();
            setUtilityBarOpen(prev => !prev);
            break;
        case '?':
        case '/':
          event.preventDefault();
          setSettingsModalOpen(true);
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLinkModalOpen, isNoteModalOpen, isSettingsModalOpen, isEventModalOpen, isAIChatOpen, settings.showSearch]);


  const handleAddLink = async (url: string, title: string, category: string) => {
    const minOrder = links.length > 0 ? Math.min(...links.map(l => l.order ?? 0)) : 0;
    const newLink: LinkItem = { 
      id: crypto.randomUUID(), 
      url, 
      title, 
      category, 
      createdAt: Date.now(),
      order: minOrder - 1
    };
    await add<LinkItem>(LINK_STORE, newLink);
    
    // Also ensure category exists in store if it's new
    if (category !== 'General' && !categories.some((c: CategoryItem) => c.name === category)) {
      const minCatOrder = categories.length > 0 ? Math.min(...categories.map(c => c.order ?? 0)) : 0;
      await add(CATEGORY_STORE, {
        id: crypto.randomUUID(),
        name: category,
        createdAt: Date.now(),
        order: minCatOrder - 1
      });
    }

    await loadData();
    setLinkModalOpen(false);
  };

  const handleDeleteLink = async (id: string) => {
    await remove(LINK_STORE, id);
    setLinks(prev => prev.filter(link => link.id !== id));
  };

  const handleAddNote = async (title: string, content: string) => {
    const minOrder = notes.length > 0 ? Math.min(...notes.map(n => n.order ?? 0)) : 0;
    const newNote: NoteItem = { 
      id: crypto.randomUUID(), 
      title, 
      content, 
      createdAt: Date.now(),
      order: minOrder - 1
    };
    await add<NoteItem>(NOTE_STORE, newNote);
    await loadData();
    setNoteModalOpen(false);
  };

  const handleDeleteNote = async (id: string) => {
    await remove(NOTE_STORE, id);
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const handleUpdateNote = async (updatedNote: NoteItem) => {
    await update<NoteItem>(NOTE_STORE, updatedNote);
    setNotes(prev => prev.map(n => n.id === updatedNote.id ? updatedNote : n));
  };

  const handleAddEvent = async (title: string, date: string, time: string, link: string, description: string) => {
    const newEvent: EventItem = { id: crypto.randomUUID(), title, date, time, link, description, createdAt: Date.now() };
    await add<EventItem>(EVENT_STORE, newEvent);
    setEvents(prev => [...prev, newEvent].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.time.localeCompare(b.time)));
    setEventModalOpen(false);
  };

  const handleDeleteEvent = async (id: string) => {
    await remove(EVENT_STORE, id);
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const handleUpdateSettings = (newSettings: Partial<Settings>) => {
    if (newSettings.autoLocation === false) {
      setSettings(prev => ({ ...prev, ...newSettings, weatherCity: undefined }));
    } else {
      setSettings(prev => ({ ...prev, ...newSettings }));
    }
  };

  const handleExport = async () => {
    const dataToExport = {
      links: await getAll<LinkItem>(LINK_STORE),
      notes: await getAll<NoteItem>(NOTE_STORE),
      events: await getAll<EventItem>(EVENT_STORE),
      categories: await getAll<CategoryItem>(CATEGORY_STORE),
      settings: settings,
      version: 1
    };
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `homer-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      try {
        if (file.name.endsWith('.json') || file.type === 'application/json') {
          const data = parseJsonBackup(content);
          if (confirm('This will replace all your current data. Are you sure?')) {
             await Promise.all([clear(LINK_STORE), clear(NOTE_STORE), clear(EVENT_STORE), clear(CATEGORY_STORE)]);
             
             // If categories are in the backup, use them. Otherwise extract from links.
             let categoriesToImport: CategoryItem[] = [];
             if (data.categories && data.categories.length > 0) {
               categoriesToImport = data.categories;
             } else {
               const uniqueCategoryNames = Array.from(new Set(data.links.map((l: LinkItem) => l.category || 'General')));
               categoriesToImport = uniqueCategoryNames.map(name => ({
                 id: crypto.randomUUID(),
                 name,
                 createdAt: Date.now()
               }));
             }
             
             await Promise.all([
              ...data.links.map((link: LinkItem) => add(LINK_STORE, link)),
              ...data.notes.map((note: NoteItem) => add(NOTE_STORE, note)),
              ...(data.events || []).map((event: EventItem) => add(EVENT_STORE, event)),
              ...categoriesToImport.map(cat => add(CATEGORY_STORE, cat))
            ]);

            if (data.settings) {
              handleUpdateSettings(data.settings);
            }
          } else {
            return;
          }
        } else if (file.name.endsWith('.html') || file.type === 'text/html') {
           const newLinks = parseChromeBookmarks(content);
           if (confirm(`Found ${newLinks.length} bookmarks. Import them?`)) {
             // Extract unique categories from imported bookmarks
             const uniqueCategories = Array.from(new Set(newLinks.map((l: LinkItem) => l.category || 'General')));
             
             await Promise.all([
               ...newLinks.map(link => add(LINK_STORE, link)),
               ...uniqueCategories.map(cat => {
                 // Only add if it doesn't exist
                 if (!categories.some((c: CategoryItem) => c.name === cat)) {
                   return add(CATEGORY_STORE, { id: crypto.randomUUID(), name: cat, createdAt: Date.now() });
                 }
                 return Promise.resolve();
               })
             ]);
           } else {
             return;
           }
        } else {
          alert('Invalid file type. Please upload a JSON backup or Chrome Bookmarks HTML file.');
          return;
        }
        await loadData();
        setSettingsModalOpen(false);
      } catch (error) {
        console.error('Import failed:', error);
        alert('Failed to import data. The file might be corrupted.');
      }
    };
    reader.readAsText(file);
  };

  const handleDeleteAllData = async () => {
    try {
      await Promise.all([clear(LINK_STORE), clear(NOTE_STORE), clear(EVENT_STORE), clear(CATEGORY_STORE)]);
      await loadData();
    } catch (error) {
      console.error('Failed to delete data:', error);
      alert('Failed to delete data.');
    }
  };

  const handleRenameFolder = async (oldName: string, newName: string) => {
    if (!newName.trim() || oldName === newName) return;
    
    try {
      // Update links
      const linksToUpdate = links.filter((l: LinkItem) => (l.category || 'General') === oldName);
      await Promise.all(linksToUpdate.map((link: LinkItem) => 
        update(LINK_STORE, { ...link, category: newName })
      ));
      
      // Update category store
      const catToUpdate = categories.find((c: CategoryItem) => c.name === oldName);
      if (catToUpdate) {
        await update(CATEGORY_STORE, { ...catToUpdate, name: newName });
      } else {
        // If it wasn't in the store (e.g. derived from link), add it
        await add(CATEGORY_STORE, { id: crypto.randomUUID(), name: newName, createdAt: Date.now() });
      }

      // Update collapsed folders state
      if (collapsedFolders.has(oldName)) {
        setCollapsedFolders((prev: Set<string>) => {
          const next = new Set(prev);
          next.delete(oldName);
          next.add(newName);
          return next;
        });
      }
      
      await loadData();
    } catch (error) {
      console.error('Failed to rename folder:', error);
      alert('Failed to rename folder.');
    }
  };

  const handleUpdateFolderColor = async (name: string, color: string) => {
    try {
      const catToUpdate = categories.find((c: CategoryItem) => c.name === name);
      if (catToUpdate) {
        await update(CATEGORY_STORE, { ...catToUpdate, color });
      } else {
        await add(CATEGORY_STORE, { id: crypto.randomUUID(), name, color, createdAt: Date.now() });
      }
      await loadData();
    } catch (error) {
      console.error('Failed to update folder color:', error);
    }
  };

  const handleDeleteFolder = async (name: string) => {
    if (!confirm(`Are you sure you want to delete the folder "${name}" and all its links?`)) return;
    
    try {
      // Delete links
      const linksToDelete = links.filter((l: LinkItem) => (l.category || 'General') === name);
      await Promise.all(linksToDelete.map((link: LinkItem) => remove(LINK_STORE, link.id)));
      
      // Delete from category store
      const catToDelete = categories.find((c: CategoryItem) => c.name === name);
      if (catToDelete) {
        await remove(CATEGORY_STORE, catToDelete.id);
      }

      if (collapsedFolders.has(name)) {
        setCollapsedFolders((prev: Set<string>) => {
          const next = new Set(prev);
          next.delete(name);
          return next;
        });
      }
      
      await loadData();
    } catch (error) {
      console.error('Failed to delete folder:', error);
      alert('Failed to delete folder.');
    }
  };

  const handleCreateFolder = async (name: string, color?: string) => {
    if (!name.trim()) return;
    if (categories.some((c: CategoryItem) => c.name.toLowerCase() === name.toLowerCase())) {
      alert('Folder already exists.');
      return;
    }

    try {
      await add(CATEGORY_STORE, {
        id: crypto.randomUUID(),
        name: name.trim(),
        color,
        createdAt: Date.now()
      });
      await loadData();
    } catch (error) {
      console.error('Failed to create folder:', error);
      alert('Failed to create folder.');
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeLink = links.find(l => l.id === active.id);
    if (!activeLink) return;

    // If hovering over another link, we might want to change category
    const overLink = links.find(l => l.id === over.id);
    if (overLink && activeLink.category !== overLink.category) {
      setLinks(prev => {
        const activeIndex = prev.findIndex(l => l.id === active.id);
        const overIndex = prev.findIndex(l => l.id === over.id);
        const updated = [...prev];
        updated[activeIndex] = { ...activeLink, category: overLink.category };
        return arrayMove(updated, activeIndex, overIndex);
      });
      return;
    }

    // If hovering over a category header
    const overCat = categories.find(c => c.id === over.id);
    if (overCat && activeLink.category !== overCat.name) {
      setLinks(prev => {
        const activeIndex = prev.findIndex(l => l.id === active.id);
        const updated = [...prev];
        updated[activeIndex] = { ...activeLink, category: overCat.name };
        // Move to the end of that category
        let lastIndex = -1;
        for (let i = prev.length - 1; i >= 0; i--) {
          if (prev[i].category === overCat.name) {
            lastIndex = i;
            break;
          }
        }
        return arrayMove(updated, activeIndex, lastIndex === -1 ? activeIndex : lastIndex);
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // Check if we are dragging a link
    const activeLink = links.find(l => l.id === active.id);
    const overLink = links.find(l => l.id === over.id);

    if (activeLink && overLink) {
      // Reordering links within the same category or across categories
      const oldIndex = links.findIndex(l => l.id === active.id);
      const newIndex = links.findIndex(l => l.id === over.id);
      
      const newLinks = arrayMove(links, oldIndex, newIndex);
      
      // Update category if moved to a different one
      if (activeLink.category !== overLink.category) {
        const updatedLink = { ...activeLink, category: overLink.category };
        newLinks[newIndex] = updatedLink;
      }

      // Update orders for all links
      const updatedLinks = newLinks.map((link, index) => ({ ...link, order: index }));
      setLinks(updatedLinks);
      
      // Persist to DB
      await Promise.all(updatedLinks.map(link => update(LINK_STORE, link)));
      return;
    }

    // Handle dropping link on a category header
    const overCatHeader = categories.find(c => c.id === over.id);
    if (activeLink && overCatHeader) {
      const updatedLink = { ...activeLink, category: overCatHeader.name };
      const newLinks = links.map(l => l.id === activeLink.id ? updatedLink : l);
      setLinks(newLinks);
      await update(LINK_STORE, updatedLink);
      return;
    }

    // Check if we are dragging a note
    const activeNote = notes.find(n => n.id === active.id);
    const overNote = notes.find(n => n.id === over.id);

    if (activeNote && overNote) {
      const oldIndex = notes.findIndex(n => n.id === active.id);
      const newIndex = notes.findIndex(n => n.id === over.id);
      
      const newNotes = arrayMove(notes, oldIndex, newIndex);
      const updatedNotes = newNotes.map((note, index) => ({ ...note, order: index }));
      setNotes(updatedNotes);
      
      await Promise.all(updatedNotes.map(note => update(NOTE_STORE, note)));
      return;
    }

    // Check if we are dragging a category
    const activeCat = categories.find(c => c.id === active.id);
    const overCat = categories.find(c => c.id === over.id);

    if (activeCat && overCat) {
      const oldIndex = categories.findIndex(c => c.id === active.id);
      const newIndex = categories.findIndex(c => c.id === over.id);
      
      const newCats = arrayMove(categories, oldIndex, newIndex);
      const updatedCats = newCats.map((cat, index) => ({ ...cat, order: index }));
      setCategories(updatedCats);
      
      await Promise.all(updatedCats.map(cat => update(CATEGORY_STORE, cat)));
    }
  };

  const toggleFolder = (category: string) => {
    setCollapsedFolders(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const accentClasses = useMemo(() => ACCENT_COLOR_CLASSES[settings.accentColor], [settings.accentColor]);
  const hasLinks = links.length > 0;
  const hasNotes = notes.length > 0;
  const hasEvents = events.length > 0;
  
  const todayString = useMemo(() => new Date().toISOString().split('T')[0], []);

  const eventsToday = useMemo(() => {
    return events.filter(event => event.date === todayString).sort((a,b) => a.time.localeCompare(b.time));
  }, [events, todayString]);

  const upcomingEvents = useMemo(() => {
    return events.filter(event => new Date(event.date) >= new Date(todayString));
  }, [events, todayString]);

  const groupedLinks = useMemo(() => {
    const groups: Record<string, LinkItem[]> = {};
    
    // Initialize with categories from store
    categories.forEach((cat: CategoryItem) => {
      groups[cat.name] = [];
    });
    
    // Add links to groups
    links.forEach((link: LinkItem) => {
      const cat = link.category || 'General';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(link);
    });
    
    // Sort categories: General first, then alphabetical
    return Object.keys(groups)
      .sort((a, b) => {
        if (a === 'General') return -1;
        if (b === 'General') return 1;
        return a.localeCompare(b);
      })
      .reduce((acc, key) => {
        acc[key] = groups[key];
        return acc;
      }, {} as Record<string, LinkItem[]>);
  }, [links, categories]);

  const { expandedFoldersList, collapsedFoldersList } = useMemo(() => {
    const expanded: [CategoryItem, LinkItem[]][] = [];
    const collapsed: [CategoryItem, LinkItem[]][] = [];
    
    Object.entries(groupedLinks).forEach(([categoryName, categoryLinks]) => {
      const categoryObj = categories.find(c => c.name === categoryName) || {
        id: categoryName,
        name: categoryName,
        createdAt: 0,
        color: 'text-gray-400'
      };
      
      if (collapsedFolders.has(categoryName)) {
        collapsed.push([categoryObj, categoryLinks]);
      } else {
        expanded.push([categoryObj, categoryLinks]);
      }
    });
    return { expandedFoldersList: expanded, collapsedFoldersList: collapsed };
  }, [groupedLinks, collapsedFolders, categories]);

  return (
    <div className={`min-h-screen text-gray-100 font-sans transition-all duration-300 ${isUtilityBarOpen ? 'pb-80' : ''}`}>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className={`sticky top-0 z-30 ${themeClasses.body} -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 pb-4 mb-4`}>
          <Header 
            onSettingsClick={() => setSettingsModalOpen(true)} 
            accentColor={settings.accentColor} 
            themeClasses={themeClasses} 
            eventsToday={eventsToday} 
          />
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 my-8">
            {settings.showSearch && (
              <div className="flex-grow w-full">
                <SearchBar 
                  accentColor={settings.accentColor} 
                  searchUrl={settings.searchUrl} 
                  themeClasses={themeClasses} 
                  links={links} 
                  notes={notes}
                  events={events}
                />
              </div>
            )}
            {settings.weatherCity && (
              <WeatherPill 
                weatherCity={settings.weatherCity} 
                accentColor={settings.accentColor} 
                themeClasses={themeClasses} 
              />
            )}
          </div>
        </div>
        
        <main>
          {isLoading ? (
            <div className="text-center text-gray-400">Loading your dashboard...</div>
          ) : (
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              {!hasLinks && !hasNotes && !hasEvents ? (
                <div className="text-center text-gray-500 py-16">
                  <h2 className="text-2xl font-semibold">Your dashboard is empty!</h2>
                  <p className="mt-2">Click the '+' button to add your first link, note, or event.</p>
                </div>
              ) : (
                <div className={`grid grid-cols-1 ${hasLinks && (hasNotes || hasEvents) ? 'lg:grid-cols-10' : ''} gap-8`}>
                  {hasLinks && (
                    <section className={hasLinks && (hasNotes || hasEvents) ? 'lg:col-span-7' : ''}>
                      <div className="space-y-12">
                        {/* Expanded Folders */}
                        <SortableContext items={expandedFoldersList.map(([cat]: [CategoryItem, LinkItem[]]) => cat.id)} strategy={verticalListSortingStrategy}>
                          {expandedFoldersList.map(([category, categoryLinks]: [CategoryItem, LinkItem[]]) => (
                            <div key={category.id} className="animate-fadeIn">
                              <FolderHeader 
                                category={category}
                                itemCount={categoryLinks.length}
                                isCollapsed={false}
                                onToggle={() => toggleFolder(category.name)}
                                themeClasses={themeClasses}
                              />
                              <SortableContext items={categoryLinks.map(l => l.id)} strategy={rectSortingStrategy}>
                                <div className={`grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(140px,1fr))] animate-fadeIn min-h-[100px] p-2 rounded-lg transition-colors ${activeId && links.find(l => l.id === activeId) ? 'bg-white/5 ring-2 ring-dashed ring-white/10' : ''}`}>
                                  {categoryLinks.map((link: LinkItem) => (
                                    <LinkCard key={link.id} link={link} onDelete={handleDeleteLink} accentColor={settings.accentColor} themeClasses={themeClasses} />
                                  ))}
                                  {categoryLinks.length === 0 && (
                                    <div className="col-span-full flex items-center justify-center py-8 text-gray-600 border-2 border-dashed border-gray-800 rounded-xl">
                                      <p className="text-sm italic">Drop links here</p>
                                    </div>
                                  )}
                                </div>
                              </SortableContext>
                            </div>
                          ))}
                        </SortableContext>

                        {/* Collapsed Folders Grid */}
                        {collapsedFoldersList.length > 0 && (
                          <div className="animate-fadeIn">
                            <h2 className={`text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4 flex items-center`}>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                              </svg>
                              Collapsed Folders
                            </h2>
                            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                              <SortableContext items={collapsedFoldersList.map(([cat]: [CategoryItem, LinkItem[]]) => cat.id)} strategy={rectSortingStrategy}>
                                {collapsedFoldersList.map(([category, categoryLinks]: [CategoryItem, LinkItem[]]) => (
                                  <SortableCollapsedFolder 
                                    key={category.id}
                                    category={category}
                                    itemCount={categoryLinks.length}
                                    onToggle={() => toggleFolder(category.name)}
                                    themeClasses={themeClasses}
                                  />
                                ))}
                              </SortableContext>
                            </div>
                          </div>
                        )}
                      </div>
                    </section>
                  )}
                  
                  {(hasEvents || hasNotes) && (
                     <aside className={hasLinks && (hasNotes || hasEvents) ? 'lg:col-span-3' : 'lg:col-span-full'}>
                       <div className="lg:max-h-[calc(100vh-220px)] lg:overflow-y-auto lg:pr-2 space-y-8">
                        {hasEvents && (
                          <section>
                            <h2 className={`text-2xl font-bold mb-4 border-b-2 pb-2 ${accentClasses.border} ${accentClasses.text}`}>Upcoming Events</h2>
                            <div className="space-y-4">
                              {upcomingEvents.map(event => (
                                <EventCard key={event.id} event={event} onDelete={handleDeleteEvent} themeClasses={themeClasses} />
                              ))}
                            </div>
                          </section>
                        )}
                        {hasNotes && (
                           <section>
                            <button 
                              onClick={() => setCollapsedNotes(!collapsedNotes)}
                              className={`w-full flex items-center justify-between mb-4 border-b-2 pb-2 ${accentClasses.border} group transition-colors`}
                            >
                              <h2 className={`text-2xl font-bold ${accentClasses.text}`}>Notes</h2>
                              <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${accentClasses.text} transition-transform duration-200 ${collapsedNotes ? '-rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            {!collapsedNotes && (
                              <SortableContext items={notes.map(n => n.id)} strategy={verticalListSortingStrategy}>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 animate-fadeIn">
                                  {notes.map(note => (
                                    <NoteCard 
                                      key={note.id} 
                                      note={note} 
                                      onDelete={handleDeleteNote} 
                                      onUpdate={handleUpdateNote}
                                      accentColor={settings.accentColor} 
                                      themeClasses={themeClasses} 
                                    />
                                  ))}
                                </div>
                              </SortableContext>
                            )}
                          </section>
                        )}
                       </div>
                    </aside>
                  )}
                </div>
              )}
              <DragOverlay dropAnimation={{
                sideEffects: defaultDropAnimationSideEffects({
                  styles: {
                    active: {
                      opacity: '0.5',
                    },
                  },
                }),
              }}>
                {activeId ? (
                  (() => {
                    const activeLink = links.find(l => l.id === activeId);
                    if (activeLink) return <LinkCard link={activeLink} accentColor={settings.accentColor} themeClasses={themeClasses} isOverlay />;
                    
                    const activeNote = notes.find(n => n.id === activeId);
                    if (activeNote) return <NoteCard note={activeNote} accentColor={settings.accentColor} themeClasses={themeClasses} isOverlay />;
                    
                    const activeCat = categories.find(c => c.id === activeId);
                    if (activeCat) {
                      const catLinks = links.filter(l => (l.category || 'General') === activeCat.name);
                      const isCollapsed = collapsedFolders.has(activeCat.name);
                      
                      if (isCollapsed) {
                        return (
                          <div className="w-[150px]">
                            <SortableCollapsedFolder 
                              category={activeCat} 
                              itemCount={catLinks.length} 
                              onToggle={() => {}} 
                              themeClasses={themeClasses} 
                              isOverlay 
                            />
                          </div>
                        );
                      }

                      return (
                        <div className="w-[300px]">
                          <FolderHeader 
                            category={activeCat} 
                            itemCount={catLinks.length} 
                            isCollapsed={false} 
                            themeClasses={themeClasses} 
                            isOverlay 
                          />
                        </div>
                      );
                    }
                    return null;
                  })()
                ) : null}
              </DragOverlay>
            </DndContext>
          )}
        </main>
      </div>

      <AddItemButtons
        onAddLink={() => setLinkModalOpen(true)}
        onAddNote={() => setNoteModalOpen(true)}
        onAddEvent={() => setEventModalOpen(true)}
        onToggleUtilityBar={() => setUtilityBarOpen(prev => !prev)}
        onAIChatOpen={() => setAIChatOpen(true)}
        accentColor={settings.accentColor}
        themeClasses={themeClasses}
      />
      
      {isUtilityBarOpen && (
        <UtilityBar 
          onClose={() => setUtilityBarOpen(false)}
          themeClasses={themeClasses}
          accentColor={settings.accentColor}
        />
      )}
      
      {isLinkModalOpen && ( 
        <AddLinkModal 
          onClose={() => setLinkModalOpen(false)} 
          onAdd={handleAddLink} 
          accentColor={settings.accentColor} 
          themeClasses={themeClasses} 
          categories={categories.map((c: CategoryItem) => c.name)}
        /> 
      )}
      {isNoteModalOpen && ( <AddNoteModal onClose={() => setNoteModalOpen(false)} onAdd={handleAddNote} accentColor={settings.accentColor} themeClasses={themeClasses} /> )}
      {isEventModalOpen && ( <AddEventModal onClose={() => setEventModalOpen(false)} onAdd={handleAddEvent} accentColor={settings.accentColor} themeClasses={themeClasses} /> )}
      {isSettingsModalOpen && ( 
        <SettingsModal 
          onClose={() => setSettingsModalOpen(false)} 
          settings={settings} 
          onUpdateSettings={handleUpdateSettings} 
          onExport={handleExport} 
          onImport={handleImport} 
          onDeleteAllData={handleDeleteAllData} 
          themeClasses={themeClasses}
          categories={categories}
          onRenameFolder={handleRenameFolder}
          onDeleteFolder={handleDeleteFolder}
          onCreateFolder={handleCreateFolder}
          onUpdateFolderColor={handleUpdateFolderColor}
        /> 
      )}
      {isAIChatOpen && ( <AIChatView onClose={() => setAIChatOpen(false)} themeClasses={themeClasses} accentColor={settings.accentColor} /> )}
    </div>
  );
};

export default App;