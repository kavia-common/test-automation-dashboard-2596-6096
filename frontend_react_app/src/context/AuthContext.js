import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth } from "../firebaseClient";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { getConfig } from "../config";
import { createLogger } from "../utils/logger";

const AuthContext = createContext(null);
const cfg = getConfig();
const log = createLogger(cfg.REACT_APP_LOG_LEVEL);

// Mock user and role map
const SAMPLE_USER = { uid: "sample-uid", email: "sample@demo.local", displayName: "Sample User" };
const ROLE_MAP = { "sample@demo.local": "admin" };

// PUBLIC_INTERFACE
export const useAuth = () => {
  /** Access authentication context. */
  return useContext(AuthContext);
};

// PUBLIC_INTERFACE
export const AuthProvider = ({ children }) => {
  /** Provides user state and auth APIs to the app. */
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const mockMode = !cfg.firebaseEnabled;

  useEffect(() => {
    if (mockMode) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub && unsub();
  }, [mockMode]);

  const role = useMemo(() => {
    if (!user) return "guest";
    if (mockMode) {
      return ROLE_MAP[user.email] || "user";
    }
    // Default role in real mode
    return "user";
  }, [user, mockMode]);

  const login = async (email, password) => {
    /** Login using Firebase or mock if not configured. */
    if (mockMode) {
      setUser({ ...SAMPLE_USER, email });
      return { ok: true, user: { ...SAMPLE_USER, email } };
    }
    const cred = await signInWithEmailAndPassword(auth, email, password);
    setUser(cred.user);
    return { ok: true, user: cred.user };
  };

  const loginSample = async () => {
    /** Sign in with sample account in mock mode. */
    setUser(SAMPLE_USER);
    return { ok: true, user: SAMPLE_USER };
  };

  const register = async (email, password) => {
    /** Register new user via Firebase or mock nop. */
    if (mockMode) {
      setUser({ ...SAMPLE_USER, email });
      return { ok: true, user: { ...SAMPLE_USER, email } };
    }
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    setUser(cred.user);
    return { ok: true, user: cred.user };
  };

  const resetPassword = async (email) => {
    /** Trigger password reset via Firebase or resolve in mock. */
    if (mockMode) {
      log.info("Mock reset password for", email);
      return { ok: true };
    }
    await sendPasswordResetEmail(auth, email);
    return { ok: true };
  };

  const logout = async () => {
    /** Logout current session. */
    if (mockMode) {
      setUser(null);
      return;
    }
    await signOut(auth);
    setUser(null);
  };

  const value = {
    user,
    role,
    login,
    loginSample,
    register,
    resetPassword,
    logout,
    loading,
    mockMode
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
