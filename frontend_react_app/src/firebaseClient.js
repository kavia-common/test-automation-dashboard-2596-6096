import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getConfig } from "./config";
import { createLogger } from "./utils/logger";

const cfg = getConfig();
const log = createLogger(cfg.REACT_APP_LOG_LEVEL);

let app = null;
let auth = null;
let storage = null;

if (cfg.firebaseEnabled) {
  try {
    app = initializeApp({
      apiKey: cfg.REACT_APP_FIREBASE_API_KEY,
      authDomain: cfg.REACT_APP_FIREBASE_AUTH_DOMAIN,
      projectId: cfg.REACT_APP_FIREBASE_PROJECT_ID,
      storageBucket: cfg.REACT_APP_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: cfg.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
      appId: cfg.REACT_APP_FIREBASE_APP_ID
    });
    auth = getAuth(app);
    storage = getStorage(app);
    log.info("Firebase initialized");
  } catch (e) {
    log.error("Failed to init Firebase, falling back to mock:", e);
  }
} else {
  log.warn("Firebase env not configured; app will use mock adapters");
}

export { app, auth, storage };
