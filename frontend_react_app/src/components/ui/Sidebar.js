import React from "react";
import { NavLink } from "react-router-dom";

const LinkItem = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `block rounded px-3 py-2 text-sm ${isActive ? "bg-blue-100 text-primary font-semibold" : "text-gray-700 hover:bg-gray-100"}`
    }
    aria-label={label}
  >
    {label}
  </NavLink>
);

export default function Sidebar() {
  return (
    <aside className="bg-surface border-r border-gray-200 w-64 hidden md:flex flex-col p-3" aria-label="Sidebar">
      <div className="text-xs uppercase text-gray-500 px-2 pb-2">Navigation</div>
      <div className="space-y-1">
        <LinkItem to="/" label="Home" />
        <LinkItem to="/requirements" label="Refine Requirement" />
        <LinkItem to="/test-generation" label="Generate Test Cases" />
        <LinkItem to="/execute" label="Execute Tests" />
        <LinkItem to="/reports" label="Reports" />
        <LinkItem to="/settings" label="Settings" />
        <LinkItem to="/health" label="Health" />
      </div>
    </aside>
  );
}
