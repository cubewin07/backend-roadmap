import React, { useState, useEffect } from "react";
import { Progress } from "./components/ui/progress";
import "./App.css";

const ROADMAP = [
  {
    section: "Fundamentals",
    items: [
      "Learn a programming language (e.g., JavaScript, Python, Java)",
      "Understand basic data structures and algorithms",
      "Version control with Git",
      "Basic networking concepts",
    ],
  },
  {
    section: "Databases",
    items: [
      "Relational Databases (e.g., PostgreSQL, MySQL)",
      "NoSQL Databases (e.g., MongoDB, Redis)",
      "ORMs and query builders",
    ],
  },
  {
    section: "APIs",
    items: [
      "RESTful API design",
      "Authentication & Authorization",
      "API documentation (Swagger, OpenAPI)",
    ],
  },
  {
    section: "DevOps & Deployment",
    items: [
      "Containerization (Docker)",
      "CI/CD basics",
      "Cloud providers (AWS, GCP, Azure)",
    ],
  },
];

const STORAGE_KEY = "roadmap-progress";

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export default function App() {
  const [progress, setProgress] = useState(loadProgress());
  const [selectedSection, setSelectedSection] = useState(0);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const handleCheck = (sectionIdx, itemIdx) => {
    setProgress((prev) => {
      const updated = { ...prev };
      if (!updated[sectionIdx]) updated[sectionIdx] = {};
      updated[sectionIdx][itemIdx] = !updated[sectionIdx][itemIdx];
      return updated;
    });
  };

  // Calculate progress
  const totalItems = ROADMAP.reduce((sum, sec) => sum + sec.items.length, 0);
  const completedItems = Object.values(progress).reduce(
    (sum, sec) => sum + Object.values(sec).filter(Boolean).length,
    0
  );
  const percent = Math.round((completedItems / totalItems) * 100);

  return (
    <div className="min-h-screen flex bg-base-200">
      {/* Sidebar */}
      <aside className="w-64 bg-base-100 shadow-lg p-4 hidden md:block">
        <h2 className="text-xl font-bold mb-6">Backend Roadmap</h2>
        <ul className="menu">
          {ROADMAP.map((sec, idx) => (
            <li key={sec.section}>
              <button
                className={`w-full text-left px-2 py-2 rounded-lg ${
                  selectedSection === idx
                    ? "bg-primary text-primary-content"
                    : ""
                }`}
                onClick={() => setSelectedSection(idx)}
              >
                {sec.section}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-6 max-w-3xl mx-auto w-full">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
            <h1 className="text-2xl font-bold">
              {ROADMAP[selectedSection].section}
            </h1>
            <div className="w-full md:w-1/2">
              <Progress value={percent} className="h-4" />
              <div className="text-xs text-right mt-1">{percent}% complete</div>
            </div>
          </div>
          <ul className="space-y-4">
            {ROADMAP[selectedSection].items.map((item, idx) => (
              <li
                key={item}
                className="flex items-center gap-3 p-4 bg-base-100 rounded-lg shadow border border-base-200"
              >
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={
                    !!(
                      progress[selectedSection] &&
                      progress[selectedSection][idx]
                    )
                  }
                  onChange={() => handleCheck(selectedSection, idx)}
                  id={`item-${selectedSection}-${idx}`}
                />
                <label
                  htmlFor={`item-${selectedSection}-${idx}`}
                  className="flex-1 cursor-pointer"
                >
                  {item}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
