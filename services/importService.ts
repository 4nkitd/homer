import { LinkItem, NoteItem, EventItem, CategoryItem, Settings } from '../types';

export interface ImportData {
  links: LinkItem[];
  notes: NoteItem[];
  events: EventItem[];
  categories?: CategoryItem[];
  settings?: Partial<Settings>;
}

export const parseJsonBackup = (jsonString: string): ImportData => {
  const data = JSON.parse(jsonString);
  // Basic validation
  if (!data.links || !Array.isArray(data.links) || !data.notes || !Array.isArray(data.notes)) {
    throw new Error('Invalid backup file format');
  }
  return {
    links: data.links,
    notes: data.notes,
    events: data.events || [],
    categories: data.categories || [],
    settings: data.settings || {},
  };
};

export const parseChromeBookmarks = (htmlString: string): LinkItem[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const links: LinkItem[] = [];
  
  const walk = (root: Node, currentFolder: string = 'General') => {
    let node = root.firstChild;
    let lastFolderName = currentFolder;

    while (node) {
      if (node.nodeName === 'H3') {
        lastFolderName = node.textContent || currentFolder;
      } else if (node.nodeName === 'DL') {
        walk(node, lastFolderName);
      } else if (node.nodeName === 'A') {
        const anchor = node as HTMLAnchorElement;
        const url = anchor.href;
        const title = anchor.textContent || url;
        const addDate = anchor.getAttribute('add_date');
        
        if (url && !url.startsWith('place:') && !url.startsWith('javascript:')) {
          links.push({
            id: crypto.randomUUID(),
            url: url,
            title: title,
            category: currentFolder === 'Bookmarks bar' || currentFolder === 'Bookmarks Menu' ? 'General' : currentFolder,
            createdAt: addDate ? parseInt(addDate) * 1000 : Date.now(),
          });
        }
      } else if (node.hasChildNodes()) {
        walk(node, currentFolder);
      }
      node = node.nextSibling;
    }
  };

  walk(doc.body);
  return links;
};
