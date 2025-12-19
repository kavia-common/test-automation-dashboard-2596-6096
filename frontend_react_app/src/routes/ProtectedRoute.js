import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
export default function ProtectedRoute({ roles }) {
  /** Guards nested routes. Optionally accepts roles array. */
  const { user, role, loading } = useAuth();

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  if (roles && roles.length && !roles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
