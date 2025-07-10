
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LinkItem, NoteItem, Settings, EventItem } from './types';
import { add, getAll, remove, clear } from './services/dbService';
import { ACCENT_COLOR_CLASSES, LINK_STORE, NOTE_STORE, EVENT_STORE, BACKGROUND_THEMES } from './constants';
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

const App: React.FC = () => {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
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
  const [isLoading, setIsLoading] = useState(true);

  const themeClasses = useMemo(() => BACKGROUND_THEMES[settings.backgroundName], [settings.backgroundName]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [dbLinks, dbNotes, dbEvents] = await Promise.all([
        getAll<LinkItem>(LINK_STORE),
        getAll<NoteItem>(NOTE_STORE),
        getAll<EventItem>(EVENT_STORE),
      ]);
      setLinks(dbLinks.sort((a, b) => b.createdAt - a.createdAt));
      setNotes(dbNotes.sort((a, b) => b.createdAt - a.createdAt));
      setEvents(dbEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.time.localeCompare(b.time)));
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
      const isModalOpen = isLinkModalOpen || isNoteModalOpen || isSettingsModalOpen || isEventModalOpen;
      if (targetNodeName === 'INPUT' || targetNodeName === 'TEXTAREA' || isModalOpen) {
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
  }, [isLinkModalOpen, isNoteModalOpen, isSettingsModalOpen, isEventModalOpen, settings.showSearch]);


  const handleAddLink = async (url: string, title: string) => {
    const newLink: LinkItem = { id: crypto.randomUUID(), url, title, createdAt: Date.now() };
    await add<LinkItem>(LINK_STORE, newLink);
    setLinks(prev => [newLink, ...prev].sort((a, b) => b.createdAt - a.createdAt));
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
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.links && Array.isArray(data.links) && data.notes && Array.isArray(data.notes)) {
          await Promise.all([clear(LINK_STORE), clear(NOTE_STORE), clear(EVENT_STORE)]);
          await Promise.all([
            ...data.links.map((link: LinkItem) => add(LINK_STORE, link)),
            ...data.notes.map((note: NoteItem) => add(NOTE_STORE, note)),
            ...(data.events || []).map((event: EventItem) => add(EVENT_STORE, event)),
          ]);
          await loadData();
          setSettingsModalOpen(false);
        } else {
          alert('Invalid import file format.');
        }
      } catch (error) {
        console.error('Import failed:', error);
        alert('Failed to import data. The file might be corrupted.');
      }
    };
    reader.readAsText(file);
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

  return (
    <div className={`min-h-screen text-gray-100 font-sans transition-all duration-300 ${isUtilityBarOpen ? 'pb-80' : ''}`}>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Header onSettingsClick={() => setSettingsModalOpen(true)} accentColor={settings.accentColor} themeClasses={themeClasses} eventsToday={eventsToday} />
        {settings.showSearch && <SearchBar accentColor={settings.accentColor} searchUrl={settings.searchUrl} themeClasses={themeClasses} />}
        
        <main className="mt-8">
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
                      <h2 className={`text-2xl font-bold mb-4 border-b-2 pb-2 ${accentClasses.border} ${accentClasses.text}`}>Links</h2>
                      <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(140px,1fr))]">
                        {links.map(link => (
                          <LinkCard key={link.id} link={link} onDelete={handleDeleteLink} accentColor={settings.accentColor} themeClasses={themeClasses} />
                        ))}
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
      
      {isLinkModalOpen && ( <AddLinkModal onClose={() => setLinkModalOpen(false)} onAdd={handleAddLink} accentColor={settings.accentColor} themeClasses={themeClasses} /> )}
      {isNoteModalOpen && ( <AddNoteModal onClose={() => setNoteModalOpen(false)} onAdd={handleAddNote} accentColor={settings.accentColor} themeClasses={themeClasses} /> )}
      {isEventModalOpen && ( <AddEventModal onClose={() => setEventModalOpen(false)} onAdd={handleAddEvent} accentColor={settings.accentColor} themeClasses={themeClasses} /> )}
      {isSettingsModalOpen && ( <SettingsModal onClose={() => setSettingsModalOpen(false)} settings={settings} onUpdateSettings={handleUpdateSettings} onExport={handleExport} onImport={handleImport} themeClasses={themeClasses} /> )}
    </div>
  );
};

export default App;