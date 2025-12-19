/**
 * Simple logger that respects REACT_APP_LOG_LEVEL
 * Levels: error < warn < info < debug
 */
const LEVELS = ["error","warn","info","debug"];

export const createLogger = (level = "info") => {
  const idx = LEVELS.indexOf(level);
  const enabled = (lvl) => LEVELS.indexOf(lvl) <= idx;
  return {
    // PUBLIC_INTERFACE
    error: (...args) => enabled("error") && console.error("[ERROR]", ...args),
    // PUBLIC_INTERFACE
    warn: (...args) => enabled("warn") && console.warn("[WARN]", ...args),
    // PUBLIC_INTERFACE
    info: (...args) => enabled("info") && console.info("[INFO]", ...args),
    // PUBLIC_INTERFACE
    debug: (...args) => enabled("debug") && console.debug("[DEBUG]", ...args),
  };
};
