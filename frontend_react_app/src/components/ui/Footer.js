import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-surface border-t border-gray-200 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-3 text-sm text-gray-600 flex items-center justify-between">
        <span>© {new Date().getFullYear()} Corporate QA</span>
        <span className="text-gray-400">Navy & Gold</span>
      </div>
    </footer>
  );
}
