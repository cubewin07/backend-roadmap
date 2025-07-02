import React, { useState, useEffect, useRef } from "react";
import { Progress } from "./components/ui/progress";
import { Toaster, toast } from "sonner";
import "./App.css";

const INITIAL_ROADMAP = [
  {
    section: "Fundamentals",
    collapsed: false,
    items: [
      {
        text: "Learn a programming language (e.g., JavaScript, Python, Java)",
        note: "",
        deadline: "",
        checked: false,
      },
      {
        text: "Understand basic data structures and algorithms",
        note: "",
        deadline: "",
        checked: false,
      },
      {
        text: "Version control with Git",
        note: "",
        deadline: "",
        checked: false,
      },
      {
        text: "Basic networking concepts",
        note: "",
        deadline: "",
        checked: false,
      },
    ],
  },
  {
    section: "Databases",
    collapsed: false,
    items: [
      {
        text: "Relational Databases (e.g., PostgreSQL, MySQL)",
        note: "",
        deadline: "",
        checked: false,
      },
      {
        text: "NoSQL Databases (e.g., MongoDB, Redis)",
        note: "",
        deadline: "",
        checked: false,
      },
      {
        text: "ORMs and query builders",
        note: "",
        deadline: "",
        checked: false,
      },
    ],
  },
  {
    section: "APIs",
    collapsed: false,
    items: [
      { text: "RESTful API design", note: "", deadline: "", checked: false },
      {
        text: "Authentication & Authorization",
        note: "",
        deadline: "",
        checked: false,
      },
      {
        text: "API documentation (Swagger, OpenAPI)",
        note: "",
        deadline: "",
        checked: false,
      },
    ],
  },
  {
    section: "DevOps & Deployment",
    collapsed: false,
    items: [
      {
        text: "Containerization (Docker)",
        note: "",
        deadline: "",
        checked: false,
      },
      { text: "CI/CD basics", note: "", deadline: "", checked: false },
      {
        text: "Cloud providers (AWS, GCP, Azure)",
        note: "",
        deadline: "",
        checked: false,
      },
    ],
  },
];

const STORAGE_KEY = "roadmap-progress-v2";

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || INITIAL_ROADMAP;
  } catch {
    return INITIAL_ROADMAP;
  }
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export default function App() {
  const [roadmap, setRoadmap] = useState(loadProgress());
  const [selectedSection, setSelectedSection] = useState(0);
  const lastUnchecked = useRef(null);

  useEffect(() => {
    saveProgress(roadmap);
  }, [roadmap]);

  // Collapsible section toggle
  const toggleSection = (idx) => {
    setRoadmap((prev) => {
      const updated = [...prev];
      updated[idx].collapsed = !updated[idx].collapsed;
      return updated;
    });
  };

  // Checkbox logic (for future: add notes, deadline, etc.)
  const handleCheck = (sectionIdx, itemIdx) => {
    const isCurrentlyChecked = !!roadmap[sectionIdx].items[itemIdx].checked;
    setRoadmap((prev) => {
      const updated = prev.map((section, sIdx) => ({
        ...section,
        items: section.items.map((item, iIdx) =>
          sIdx === sectionIdx && iIdx === itemIdx
            ? { ...item, checked: !Boolean(item.checked) }
            : item
        ),
      }));
      return updated;
    });
    if (isCurrentlyChecked) {
      lastUnchecked.current = { sectionIdx, itemIdx };
      toast(
        <span>
          Item unchecked.{" "}
          <button className="btn btn-link btn-xs" onClick={undoUncheck}>
            Undo
          </button>
        </span>,
        { duration: 4000 }
      );
    }
  };

  const undoUncheck = () => {
    if (lastUnchecked.current) {
      const { sectionIdx, itemIdx } = lastUnchecked.current;
      setRoadmap((prev) => {
        const updated = [...prev];
        updated[sectionIdx].items[itemIdx].checked = true;
        return updated;
      });
      lastUnchecked.current = null;
      toast.success("Undo successful!");
    }
  };

  // Progress calculation
  const totalItems = roadmap.reduce((sum, sec) => sum + sec.items.length, 0);
  const completedItems = roadmap.reduce(
    (sum, sec) => sum + sec.items.filter((item) => item.checked).length,
    0
  );
  const percent = Math.round((completedItems / totalItems) * 100);

  return (
    <div className="min-h-screen flex bg-base-200">
      <Toaster position="top-center" richColors />
      {/* Sidebar */}
      <aside className="w-64 bg-base-100 shadow-lg p-4 hidden md:block">
        <h2 className="text-xl font-bold mb-6">Backend Roadmap</h2>
        <ul className="menu">
          {roadmap.map((sec, idx) => (
            <li key={sec.section}>
              <button
                className={`w-full text-left px-2 py-2 rounded-lg transition-colors
                  ${
                    selectedSection === idx
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-foreground"
                  }
                `}
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
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <button
                className="btn btn-xs btn-ghost"
                onClick={() => toggleSection(selectedSection)}
                aria-label={
                  roadmap[selectedSection].collapsed ? "Expand" : "Collapse"
                }
              >
                {roadmap[selectedSection].collapsed ? "+" : "-"}
              </button>
              {roadmap[selectedSection].section}
            </h1>
            <div className="w-full md:w-1/2">
              <Progress value={percent} className="h-4" />
              <div className="text-xs text-right mt-1">{percent}% complete</div>
            </div>
          </div>
          {!roadmap[selectedSection].collapsed && (
            <ul className="space-y-4">
              {roadmap[selectedSection].items.map((item, idx) => (
                <li
                  key={item.text}
                  className="flex items-center gap-3 p-4 bg-base-100 rounded-lg shadow border border-base-200"
                >
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={!!item.checked}
                    onChange={() => handleCheck(selectedSection, idx)}
                    id={`item-${selectedSection}-${idx}`}
                  />
                  <label
                    htmlFor={`item-${selectedSection}-${idx}`}
                    className="flex-1 cursor-pointer"
                  >
                    {item.text}
                  </label>
                  {/* Placeholder for notes and deadline UI */}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
