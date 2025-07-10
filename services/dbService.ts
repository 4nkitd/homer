
import { DB_NAME, DB_VERSION, LINK_STORE, NOTE_STORE, EVENT_STORE } from '../constants';
import { DbStore, LinkItem, NoteItem } from '../types';

let db: IDBDatabase;

const getDb = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(db);
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error("Database error:", request.error);
      reject("Database error");
    };

    request.onsuccess = (event) => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      if (!dbInstance.objectStoreNames.contains(LINK_STORE)) {
        dbInstance.createObjectStore(LINK_STORE, { keyPath: 'id' });
      }
      if (!dbInstance.objectStoreNames.contains(NOTE_STORE)) {
        dbInstance.createObjectStore(NOTE_STORE, { keyPath: 'id' });
      }
      if (!dbInstance.objectStoreNames.contains(EVENT_STORE)) {
        dbInstance.createObjectStore(EVENT_STORE, { keyPath: 'id' });
      }
    };
  });
};

export const getAll = async <T,>(storeName: DbStore): Promise<T[]> => {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      console.error('Error getting all items:', request.error);
      reject(request.error);
    };
  });
};

export const add = async <T,>(storeName: DbStore, item: T): Promise<void> => {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.add(item);

    request.onsuccess = () => resolve();
    request.onerror = () => {
        console.error('Error adding item:', request.error);
        reject(request.error);
    };
  });
};

export const remove = async (storeName: DbStore, id: string): Promise<void> => {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);
    
    request.onsuccess = () => resolve();
    request.onerror = () => {
        console.error('Error deleting item:', request.error);
        reject(request.error);
    };
  });
};

export const clear = async (storeName: DbStore): Promise<void> => {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => {
        console.error('Error clearing store:', request.error);
        reject(request.error);
    };
  });
};