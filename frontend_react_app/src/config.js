/**
 * PUBLIC_INTERFACE
 * getConfig returns effective environment configuration for the app.
 */
export const getConfig = () => {
  const cfg = {
    REACT_APP_API_BASE: process.env.REACT_APP_API_BASE || "",
    REACT_APP_BACKEND_URL: process.env.REACT_APP_BACKEND_URL || "",
    REACT_APP_FRONTEND_URL: process.env.REACT_APP_FRONTEND_URL || "",
    REACT_APP_WS_URL: process.env.REACT_APP_WS_URL || "",
    REACT_APP_NODE_ENV: process.env.REACT_APP_NODE_ENV || process.env.NODE_ENV || "development",
    REACT_APP_NEXT_TELEMETRY_DISABLED: process.env.REACT_APP_NEXT_TELEMETRY_DISABLED || "1",
    REACT_APP_ENABLE_SOURCE_MAPS: process.env.REACT_APP_ENABLE_SOURCE_MAPS || "true",
    REACT_APP_PORT: process.env.REACT_APP_PORT || "3000",
    REACT_APP_TRUST_PROXY: process.env.REACT_APP_TRUST_PROXY || "false",
    REACT_APP_LOG_LEVEL: process.env.REACT_APP_LOG_LEVEL || "info",
    REACT_APP_HEALTHCHECK_PATH: process.env.REACT_APP_HEALTHCHECK_PATH || "",
    REACT_APP_FEATURE_FLAGS: process.env.REACT_APP_FEATURE_FLAGS || "",
    REACT_APP_EXPERIMENTS_ENABLED: process.env.REACT_APP_EXPERIMENTS_ENABLED || "false",

    // Firebase
    REACT_APP_FIREBASE_API_KEY: process.env.REACT_APP_FIREBASE_API_KEY || "",
    REACT_APP_FIREBASE_AUTH_DOMAIN: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "",
    REACT_APP_FIREBASE_PROJECT_ID: process.env.REACT_APP_FIREBASE_PROJECT_ID || "",
    REACT_APP_FIREBASE_STORAGE_BUCKET: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "",
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "",
    REACT_APP_FIREBASE_APP_ID: process.env.REACT_APP_FIREBASE_APP_ID || ""
  };

  const flags = (cfg.REACT_APP_FEATURE_FLAGS || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  const experiments = (cfg.REACT_APP_EXPERIMENTS_ENABLED === "true");

  const firebaseEnabled =
    !!cfg.REACT_APP_FIREBASE_API_KEY &&
    !!cfg.REACT_APP_FIREBASE_AUTH_DOMAIN &&
    !!cfg.REACT_APP_FIREBASE_PROJECT_ID;

  return {
    ...cfg,
    flags,
    experiments,
    firebaseEnabled,
    mockMode: !firebaseEnabled || !cfg.REACT_APP_BACKEND_URL
  };
};
