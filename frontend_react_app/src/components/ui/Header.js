import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const { user, logout, mockMode } = useAuth();
  return (
    <header className="w-full bg-surface border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" aria-label="App Home">
          <div className="h-8 w-8 rounded bg-primary"></div>
          <div className="font-bold text-text">AI Test Automation</div>
          {mockMode && <span className="ml-2 text-xs text-secondary border border-amber-200 rounded px-2 py-0.5">Sample Mode</span>}
        </Link>
        <nav className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-gray-600" aria-label="Logged in user">{user.email || "user"}</span>
              <button className="btn btn-ghost" onClick={logout} aria-label="Logout">Logout</button>
            </>
          ) : (
            <Link className="btn btn-primary" to="/login">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
