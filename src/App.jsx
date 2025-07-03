import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import { formatDate, getDeadlineStatus } from "./lib/utils";

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

  return (
    <div className="flex min-h-screen bg-base-200">
      <Sidebar
        sections={roadmap}
        selectedSection={selectedSection}
        onSelectSection={setSelectedSection}
      />
      <MainContent
        section={roadmap[selectedSection].section}
        childrenSections={roadmap[selectedSection].children}
        addingTaskIdx={addingTaskIdx}
        setAddingTaskIdx={setAddingTaskIdx}
        newTask={newTask}
        setNewTask={setNewTask}
        deadlineDraft={deadlineDraft}
        setDeadlineDraft={setDeadlineDraft}
        handleAddTask={handleAddTask}
        handleCheck={handleCheck}
        handleSetDeadline={handleSetDeadline}
      />
    </div>
  );
}
