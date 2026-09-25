/**
 * IndexedDB Media Storage for large binary assets (video, audio, high-res images)
 * uploaded directly from laptop/device.
 */

const DB_NAME = "radhaa_media_vault_db";
const DB_VERSION = 1;
const STORE_NAME = "media_blobs";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not available"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function storeLocalFile(id: string, file: File): Promise<string> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const record = {
      id,
      file,
      name: file.name,
      type: file.type,
      size: file.size,
      updatedAt: Date.now(),
    };

    const request = store.put(record);

    request.onsuccess = () => {
      // Create a persistent object URL for the session
      const objectUrl = URL.createObjectURL(file);
      resolve(objectUrl);
    };

    request.onerror = () => reject(request.error);
  });
}

export async function getLocalFileUrl(id: string): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        const record = request.result;
        if (record && record.file) {
          resolve(URL.createObjectURL(record.file));
        } else {
          resolve(null);
        }
      };

      request.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function deleteLocalFile(id: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.warn("Could not delete from IndexedDB", e);
  }
}

export async function getAllLocalFiles(): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const records = request.result || [];
        for (const record of records) {
          if (record && record.id && record.file) {
            try {
              const url = URL.createObjectURL(record.file);
              map.set(record.id, url);
            } catch (err) {
              console.warn("Failed to createObjectURL for record", record.id, err);
            }
          }
        }
        resolve(map);
      };

      request.onerror = () => resolve(map);
    });
  } catch {
    return map;
  }
}
