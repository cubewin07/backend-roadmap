import React, { useState, useEffect } from "react";
import { Progress } from "./components/ui/progress";
import { Calendar } from "./components/ui/calendar";
import { formatDate, getDeadlineStatus } from "./lib/utils";
import { Plus, Calendar as CalendarIcon, AlertCircle } from "lucide-react";
import "./App.css";

const INITIAL_ROADMAP = [
  {
    section: "Fundamentals",
    children: [
      {
        section: "Java Language & OOP Fundamentals",
        tasks: [
          {
            text: "Syntax, control structures, exception handling",
            checked: false,
            deadline: "",
          },
          {
            text: "Classes, objects, inheritance, polymorphism",
            checked: false,
            deadline: "",
          },
        ],
      },
      {
        section: "DSA in Java",
        tasks: [
          {
            text: "Re-implement CP knowledge in Java",
            checked: false,
            deadline: "",
          },
        ],
      },
    ],
  },
  {
    section: "Databases",
    children: [
      {
        section: "Relational Databases",
        tasks: [{ text: "PostgreSQL", checked: false, deadline: "" }],
      },
    ],
  },
  {
    section: "APIs",
    children: [
      {
        section: "RESTful API Design",
        tasks: [
          { text: "Design RESTful endpoints", checked: false, deadline: "" },
        ],
      },
    ],
  },
  {
    section: "DevOps & Deployment",
    children: [
      {
        section: "Containerization",
        tasks: [{ text: "Docker", checked: false, deadline: "" }],
      },
    ],
  },
];

const STORAGE_KEY = "roadmap-progress-v3";

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
  const [newTask, setNewTask] = useState("");
  const [addingTaskIdx, setAddingTaskIdx] = useState(null);
  const [deadlineDraft, setDeadlineDraft] = useState("");

  useEffect(() => {
    saveProgress(roadmap);
  }, [roadmap]);

  // Add new task to a subtask
  const handleAddTask = (childIdx) => {
    if (!newTask.trim()) return;
    setRoadmap((prev) =>
      prev.map((sec, sIdx) => {
        if (sIdx !== selectedSection) return sec;
        return {
          ...sec,
          children: sec.children.map((child, cIdx) => {
            if (cIdx !== childIdx) return child;
            return {
              ...child,
              tasks: [
                ...child.tasks,
                { text: newTask, checked: false, deadline: deadlineDraft },
              ],
            };
          }),
        };
      })
    );
    setNewTask("");
    setDeadlineDraft("");
    setAddingTaskIdx(null);
  };

  // Toggle task checked
  const handleCheck = (childIdx, taskIdx) => {
    setRoadmap((prev) =>
      prev.map((sec, sIdx) => {
        if (sIdx !== selectedSection) return sec;
        return {
          ...sec,
          children: sec.children.map((child, cIdx) => {
            if (cIdx !== childIdx) return child;
            return {
              ...child,
              tasks: child.tasks.map((task, tIdx) =>
                tIdx === taskIdx ? { ...task, checked: !task.checked } : task
              ),
            };
          }),
        };
      })
    );
  };

  // Set deadline for a task
  const handleSetDeadline = (childIdx, taskIdx, date) => {
    setRoadmap((prev) =>
      prev.map((sec, sIdx) => {
        if (sIdx !== selectedSection) return sec;
        return {
          ...sec,
          children: sec.children.map((child, cIdx) => {
            if (cIdx !== childIdx) return child;
            return {
              ...child,
              tasks: child.tasks.map((task, tIdx) =>
                tIdx === taskIdx ? { ...task, deadline: date } : task
              ),
            };
          }),
        };
      })
    );
  };

  // Progress calculation for a subtask
  const getSubtaskProgress = (child) => {
    const total = child.tasks.length;
    const done = child.tasks.filter((t) => t.checked).length;
    return total === 0 ? 0 : Math.round((done / total) * 100);
  };

  return (
    <div className="flex min-h-screen bg-base-200">
      <aside className="w-64 flex-shrink-0 bg-base-100 shadow-xl border-r border-base-300 p-8 flex flex-col z-20">
        <h2 className="text-2xl font-bold mb-10 tracking-tight">
          Backend Roadmap
        </h2>
        <ul className="menu space-y-2">
          {roadmap.map((sec, idx) => (
            <li key={sec.section}>
              <button
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors text-base ${
                  selectedSection === idx
                    ? "bg-primary text-primary-foreground shadow"
                    : "bg-card text-foreground hover:bg-base-200"
                }`}
                onClick={() => setSelectedSection(idx)}
              >
                {sec.section}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <main className="flex-1 px-6 pt-10 min-h-screen w-full">
        <h1 className="text-3xl font-bold mb-10 text-center tracking-tight">
          {roadmap[selectedSection].section}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-4">
          {roadmap[selectedSection].children.map((child, childIdx) => {
            const progress = getSubtaskProgress(child);
            return (
              <div
                key={child.section}
                className="card bg-white dark:bg-base-100 shadow-md rounded-2xl border border-base-300 p-6 flex flex-col h-full min-h-[320px] transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="card-title text-lg font-semibold tracking-tight">
                    {child.section}
                  </h2>
                  <div className="w-28">
                    <Progress value={progress} />
                    <div className="text-xs text-right mt-1">{progress}%</div>
                  </div>
                </div>
                <ul className="flex-1 space-y-3 mb-4">
                  {child.tasks.map((task, taskIdx) => {
                    const status = getDeadlineStatus(task.deadline);
                    return (
                      <li
                        key={task.text}
                        className={`flex items-center gap-3 p-3 rounded border ${
                          status === "overdue"
                            ? "border-destructive bg-red-100/10"
                            : "border-base-200"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary"
                          checked={!!task.checked}
                          onChange={() => handleCheck(childIdx, taskIdx)}
                          id={`task-${childIdx}-${taskIdx}`}
                        />
                        <label
                          htmlFor={`task-${childIdx}-${taskIdx}`}
                          className="flex-1 cursor-pointer text-base"
                        >
                          {task.text}
                        </label>
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          <input
                            type="date"
                            className="input input-xs input-bordered"
                            value={task.deadline || ""}
                            onChange={(e) =>
                              handleSetDeadline(
                                childIdx,
                                taskIdx,
                                e.target.value
                              )
                            }
                          />
                          {status === "overdue" && (
                            <AlertCircle
                              className="w-4 h-4 text-destructive"
                              title="Overdue"
                            />
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
                {/* Add new task */}
                {addingTaskIdx === childIdx ? (
                  <div className="flex flex-col gap-2 mt-2">
                    <input
                      className="input input-bordered"
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      placeholder="New task..."
                    />
                    <input
                      type="date"
                      className="input input-xs input-bordered"
                      value={deadlineDraft}
                      onChange={(e) => setDeadlineDraft(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleAddTask(childIdx)}
                      >
                        Add
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => {
                          setAddingTaskIdx(null);
                          setNewTask("");
                          setDeadlineDraft("");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="btn btn-outline btn-sm mt-2"
                    onClick={() => setAddingTaskIdx(childIdx)}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Task
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
