/**
 * PUBLIC_INTERFACE
 * StorageService exposes list, upload, delete, download methods.
 */
import { getConfig } from "../../config";
import { createLogger } from "../../utils/logger";
import { FirebaseStorageAdapter } from "./adapters/FirebaseStorageAdapter";
import { MockStorageAdapter } from "./adapters/MockStorageAdapter";

const cfg = getConfig();
const log = createLogger(cfg.REACT_APP_LOG_LEVEL);

let adapter = null;

if (cfg.firebaseEnabled) {
  adapter = new FirebaseStorageAdapter();
  log.info("Using FirebaseStorageAdapter");
} else {
  adapter = new MockStorageAdapter();
  log.warn("Using MockStorageAdapter");
}

// PUBLIC_INTERFACE
export const list = (path = "") => adapter.list(path);

// PUBLIC_INTERFACE
export const upload = (file, path = "", onProgress) => adapter.upload(file, path, onProgress);

// PUBLIC_INTERFACE
export const remove = (path) => adapter.remove(path);

// PUBLIC_INTERFACE
export const download = (path) => adapter.download(path);
