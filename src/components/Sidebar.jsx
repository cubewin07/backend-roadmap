import React from "react";

export default function Sidebar({
  sections,
  selectedSection,
  onSelectSection,
}) {
  return (
    <aside className="w-64 flex-shrink-0 bg-base-100 shadow-xl border-r border-base-300 p-8 flex flex-col z-20">
      <h2 className="text-2xl font-bold mb-10 tracking-tight">
        Backend Roadmap
      </h2>
      <ul className="menu space-y-2">
        {sections.map((sec, idx) => (
          <li key={sec.section}>
            <button
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors text-base ${
                selectedSection === idx
                  ? "bg-primary text-primary-foreground shadow"
                  : "bg-card text-foreground hover:bg-base-200"
              }`}
              onClick={() => onSelectSection(idx)}
            >
              {sec.section}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
