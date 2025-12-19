import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const parts = pathname.split("/").filter(Boolean);
  const crumbs = [{ name: "Home", path: "/" }, ...parts.map((p, idx) => ({
    name: p.replace(/-/g, " "),
    path: "/" + parts.slice(0, idx + 1).join("/")
  }))];

  return (
    <nav className="text-sm text-gray-600" aria-label="Breadcrumb">
      {crumbs.map((c, i) => (
        <span key={c.path}>
          {i > 0 && <span className="mx-2 text-gray-400">/</span>}
          {i === crumbs.length - 1 ? (
            <span aria-current="page" className="font-medium text-text">{c.name}</span>
          ) : (
            <Link className="hover:underline" to={c.path}>{c.name}</Link>
          )}
        </span>
      ))}
    </nav>
  );
}
