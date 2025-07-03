import React from "react";
import {
  BookOpen,
  Database,
  Cloud,
  ShieldCheck,
  FlaskConical,
  Rocket,
} from "lucide-react";

const sectionIcons = [
  BookOpen, // Fundamentals
  Database, // Databases
  Cloud, // APIs
  ShieldCheck, // Security
  FlaskConical, // Testing
  Rocket, // DevOps & Deployment
];

export default function Sidebar({
  sections,
  selectedSection,
  onSelectSection,
}) {
  return (
    <aside className="w-64 flex-shrink-0 bg-gradient-to-b from-primary/80 to-base-100 shadow-2xl border-r border-base-300 p-8 flex flex-col z-20 min-h-screen">
      <h2 className="text-3xl font-extrabold mb-12 tracking-tight text-primary-foreground flex items-center gap-2">
        <span className="bg-primary rounded-full px-3 py-1 text-lg shadow">
          <BookOpen className="inline w-6 h-6" />
        </span>
        Backend Roadmap
      </h2>
      <ul className="menu space-y-3">
        {sections.map((sec, idx) => {
          const Icon = sectionIcons[idx % sectionIcons.length] || BookOpen;
          return (
            <li key={sec.section} className="relative">
              <button
                className={`w-full text-left px-5 py-3 rounded-xl font-semibold flex items-center gap-3 transition-all text-base shadow-sm border border-transparent hover:border-primary/40 hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                  selectedSection === idx
                    ? "bg-primary text-primary-foreground border-primary/80 shadow-lg scale-[1.03]"
                    : "bg-card text-foreground"
                }`}
                onClick={() => onSelectSection(idx)}
              >
                <Icon className="w-6 h-6" />
                <span>{sec.section}</span>
                {selectedSection === idx && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-1.5 rounded-r bg-accent"></span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
