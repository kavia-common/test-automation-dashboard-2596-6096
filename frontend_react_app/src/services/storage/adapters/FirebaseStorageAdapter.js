import { storage } from "../../../firebaseClient";
import {
  ref, uploadBytesResumable, listAll, getDownloadURL, deleteObject
} from "firebase/storage";

export class FirebaseStorageAdapter {
  /** List files under a folder path */
  async list(path = "") {
    const r = ref(storage, path || "/");
    const res = await listAll(r);
    const files = await Promise.all(
      res.items.map(async (item) => {
        const url = await getDownloadURL(item);
        return { name: item.name, path: item.fullPath, url, type: "file" };
      })
    );
    const folders = res.prefixes.map((p) => ({
      name: p.name, path: p.fullPath, type: "folder"
    }));
    return [...folders, ...files];
  }

  /** Upload file to a path; onProgress callback receives 0..100 */
  async upload(file, path = "", onProgress) {
    const r = ref(storage, `${path ? path.replace(/\/$/, "") + "/" : ""}${file.name}`);
    const task = uploadBytesResumable(r, file);
    return await new Promise((resolve, reject) => {
      task.on("state_changed",
        (snap) => {
          const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
          onProgress && onProgress(pct);
        },
        (err) => reject(err),
        async () => {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve({ path: task.snapshot.ref.fullPath, url });
        }
      );
    });
  }

  /** Delete a file by path */
  async remove(path) {
    const r = ref(storage, path);
    await deleteObject(r);
    return { ok: true };
  }

  /** Download returns a URL for browser */
  async download(path) {
    const r = ref(storage, path);
    const url = await getDownloadURL(r);
    return { url };
  }
}
