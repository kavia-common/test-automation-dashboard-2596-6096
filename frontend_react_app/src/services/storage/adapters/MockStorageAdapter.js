import { openDB } from "idb";

const DB_NAME = "mock-storage";
const STORE = "files";

async function getDB() {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: "path" });
        store.createIndex("path", "path", { unique: true });
      }
    }
  });
  return db;
}

function splitPath(path) {
  const normalized = (path || "").replace(/^\/+|\/+$/g, "");
  return normalized ? normalized.split("/") : [];
}

export class MockStorageAdapter {
  /** List folder contents in a pseudo hierarchy based on key prefixes */
  async list(path = "") {
    const db = await getDB();
    const tx = db.transaction(STORE, "readonly");
    const store = tx.objectStore(STORE);
    const all = await store.getAll();

    const base = (path || "").replace(/^\/+|\/+$/g, "");
    const depth = splitPath(base).length;

    const children = {};
    const files = [];

    for (const entry of all) {
      if (!entry.path.startsWith(base)) continue;
      const rem = entry.path.slice(base.length).replace(/^\/+/, "");
      const parts = splitPath(rem);
      if (rem === "" || parts.length === 0) {
        // direct file in base
        files.push({ name: entry.name, path: entry.path, type: "file", url: entry.url });
      } else if (parts.length >= 1) {
        const folder = parts[0];
        children[folder] = true;
        if (parts.length === 1 && entry.blob) {
          files.push({ name: entry.name, path: entry.path, type: "file", url: entry.url });
        }
      }
    }

    const folders = Object.keys(children).map((name) => ({
      name,
      path: base ? `${base}/${name}` : name,
      type: "folder"
    }));

    // ensure unique files only at this depth
    const directFiles = files.filter((f) => {
      const parent = splitPath(f.path).slice(0, depth).join("/");
      return parent === base || (base === "" && depth === 0 && !f.path.includes("/"));
    });

    await tx.done;
    return [...folders, ...directFiles];
  }

  /** Upload file to mock store */
  async upload(file, path = "", onProgress) {
    const db = await getDB();
    const fullPath = `${path ? path.replace(/\/$/, "") + "/" : ""}${file.name}`;
    const reader = new FileReader();
    const blob = await new Promise((resolve, reject) => {
      reader.onload = () => resolve(new Blob([reader.result]));
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
    onProgress && onProgress(100);
    const url = URL.createObjectURL(blob);
    await db.put(STORE, { path: fullPath, name: file.name, blob, url });
    return { path: fullPath, url };
  }

  /** Remove file by path */
  async remove(path) {
    const db = await getDB();
    await db.delete(STORE, path);
    return { ok: true };
  }

  /** Download returns an object URL */
  async download(path) {
    const db = await getDB();
    const entry = await db.get(STORE, path);
    if (!entry) throw new Error("Not found");
    return { url: entry.url };
  }
}
