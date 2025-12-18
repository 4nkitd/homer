
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LinkItem, NoteItem, Settings, EventItem, CategoryItem } from './types';
import { add, getAll, remove, clear, update } from './services/dbService';
import { parseJsonBackup, parseChromeBookmarks } from './services/importService';
import { ACCENT_COLOR_CLASSES, LINK_STORE, NOTE_STORE, EVENT_STORE, BACKGROUND_THEMES, CATEGORY_STORE } from './constants';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
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
  });
  const [isLinkModalOpen, setLinkModalOpen] = useState(false);
  const [isNoteModalOpen, setNoteModalOpen] = useState(false);
  const [isEventModalOpen, setEventModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [isUtilityBarOpen, setUtilityBarOpen] = useState(false);
  const [isAIChatOpen, setAIChatOpen] = useState(false);
  const [collapsedFolders, setCollapsedFolders] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('collapsed-folders');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [isLoading, setIsLoading] = useState(true);

  const themeClasses = useMemo(() => BACKGROUND_THEMES[settings.backgroundName], [settings.backgroundName]);

  useEffect(() => {
    localStorage.setItem('collapsed-folders', JSON.stringify(Array.from(collapsedFolders)));
  }, [collapsedFolders]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [dbLinks, dbNotes, dbEvents, dbCategories] = await Promise.all([
        getAll<LinkItem>(LINK_STORE),
        getAll<NoteItem>(NOTE_STORE),
        getAll<EventItem>(EVENT_STORE),
        getAll<CategoryItem>(CATEGORY_STORE),
      ]);
      setLinks(dbLinks.sort((a, b) => b.createdAt - a.createdAt));
      setNotes(dbNotes.sort((a, b) => b.createdAt - a.createdAt));
      setEvents(dbEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.time.localeCompare(b.time)));
      setCategories(dbCategories.sort((a, b) => a.name.localeCompare(b.name)));
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
    const newLink: LinkItem = { id: crypto.randomUUID(), url, title, category, createdAt: Date.now() };
    await add<LinkItem>(LINK_STORE, newLink);
    
    // Also ensure category exists in store if it's new
    if (category !== 'General' && !categories.some((c: CategoryItem) => c.name === category)) {
      await add(CATEGORY_STORE, {
        id: crypto.randomUUID(),
        name: category,
        createdAt: Date.now()
      });
    }

    setLinks((prev: LinkItem[]) => [newLink, ...prev].sort((a, b) => b.createdAt - a.createdAt));
    await loadData();
    setLinkModalOpen(false);
  };

  const handleDeleteLink = async (id: string) => {
    await remove(LINK_STORE, id);
    setLinks(prev => prev.filter(link => link.id !== id));
  };

  const handleAddNote = async (title: string, content: string) => {
    const newNote: NoteItem = { id: crypto.randomUUID(), title, content, createdAt: Date.now() };
    await add<NoteItem>(NOTE_STORE, newNote);
    setNotes(prev => [newNote, ...prev].sort((a, b) => b.createdAt - a.createdAt));
    setNoteModalOpen(false);
  };

  const handleDeleteNote = async (id: string) => {
    await remove(NOTE_STORE, id);
    setNotes(prev => prev.filter(note => note.id !== id));
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
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handleExport = async () => {
    const dataToExport = {
      links: await getAll<LinkItem>(LINK_STORE),
      notes: await getAll<NoteItem>(NOTE_STORE),
      events: await getAll<EventItem>(EVENT_STORE),
    };
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-backup-${new Date().toISOString().split('T')[0]}.json`;
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
             
             // Extract unique categories from links
             const uniqueCategories = Array.from(new Set(data.links.map((l: LinkItem) => l.category || 'General')));
             
             await Promise.all([
              ...data.links.map((link: LinkItem) => add(LINK_STORE, link)),
              ...data.notes.map((note: NoteItem) => add(NOTE_STORE, note)),
              ...(data.events || []).map((event: EventItem) => add(EVENT_STORE, event)),
              ...uniqueCategories.map(cat => add(CATEGORY_STORE, { id: crypto.randomUUID(), name: cat, createdAt: Date.now() }))
            ]);
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

  const handleCreateFolder = async (name: string) => {
    if (!name.trim()) return;
    if (categories.some((c: CategoryItem) => c.name.toLowerCase() === name.toLowerCase())) {
      alert('Folder already exists.');
      return;
    }

    try {
      await add(CATEGORY_STORE, {
        id: crypto.randomUUID(),
        name: name.trim(),
        createdAt: Date.now()
      });
      await loadData();
    } catch (error) {
      console.error('Failed to create folder:', error);
      alert('Failed to create folder.');
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
    const expanded: [string, LinkItem[]][] = [];
    const collapsed: [string, LinkItem[]][] = [];
    (Object.entries(groupedLinks) as [string, LinkItem[]][]).forEach(([category, categoryLinks]) => {
      if (collapsedFolders.has(category)) {
        collapsed.push([category, categoryLinks]);
      } else {
        expanded.push([category, categoryLinks]);
      }
    });
    return { expandedFoldersList: expanded, collapsedFoldersList: collapsed };
  }, [groupedLinks, collapsedFolders]);

  return (
    <div className={`min-h-screen text-gray-100 font-sans transition-all duration-300 ${isUtilityBarOpen ? 'pb-80' : ''}`}>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className={`sticky top-0 z-30 ${themeClasses.body} -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 pb-4 mb-4`}>
          <Header onSettingsClick={() => setSettingsModalOpen(true)} accentColor={settings.accentColor} themeClasses={themeClasses} eventsToday={eventsToday} />
          {settings.showSearch && <SearchBar accentColor={settings.accentColor} searchUrl={settings.searchUrl} themeClasses={themeClasses} links={links} />}
        </div>
        
        <main>
          {isLoading ? (
            <div className="text-center text-gray-400">Loading your dashboard...</div>
          ) : (
            <>
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
                        {expandedFoldersList.map(([category, categoryLinks]: [string, LinkItem[]]) => (
                          <div key={category} className="animate-fadeIn">
                            <button 
                              onClick={() => toggleFolder(category)}
                              className={`w-full flex items-center justify-between mb-4 border-b pb-1 ${themeClasses.border} group transition-colors hover:border-gray-500`}
                            >
                              <h2 className="text-xl font-bold text-gray-400 group-hover:text-gray-200 transition-colors">{category}</h2>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-600 group-hover:text-gray-400">{categoryLinks.length} items</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </button>
                            <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(140px,1fr))] animate-fadeIn">
                              {categoryLinks.map((link: LinkItem) => (
                                <LinkCard key={link.id} link={link} onDelete={handleDeleteLink} accentColor={settings.accentColor} themeClasses={themeClasses} />
                              ))}
                            </div>
                          </div>
                        ))}

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
                              {collapsedFoldersList.map(([category, categoryLinks]: [string, LinkItem[]]) => (
                                <button
                                  key={category}
                                  onClick={() => toggleFolder(category)}
                                  className={`flex flex-col items-center p-4 rounded-xl ${themeClasses.card} border ${themeClasses.border} hover:border-gray-500 transition-all group text-center`}
                                >
                                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${themeClasses.button} transition-colors`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${accentClasses.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                    </svg>
                                  </div>
                                  <span className="text-sm font-medium text-gray-300 group-hover:text-white truncate w-full px-1">{category}</span>
                                  <span className="text-[10px] text-gray-600 mt-1">{categoryLinks.length} items</span>
                                </button>
                              ))}
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
                            <h2 className={`text-2xl font-bold mb-4 border-b-2 pb-2 ${accentClasses.border} ${accentClasses.text}`}>Notes</h2>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1">
                              {notes.map(note => (
                                <NoteCard key={note.id} note={note} onDelete={handleDeleteNote} accentColor={settings.accentColor} themeClasses={themeClasses} />
                              ))}
                            </div>
                          </section>
                        )}
                       </div>
                    </aside>
                  )}
                </div>
              )}
            </>
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
          categories={Object.keys(groupedLinks)}
          onRenameFolder={handleRenameFolder}
          onDeleteFolder={handleDeleteFolder}
          onCreateFolder={handleCreateFolder}
        /> 
      )}
      {isAIChatOpen && ( <AIChatView onClose={() => setAIChatOpen(false)} themeClasses={themeClasses} accentColor={settings.accentColor} /> )}
    </div>
  );
};

export default App;