import React, { useState, useEffect, useRef } from "react";
import { Progress } from "./components/ui/progress";
import { Toaster, toast } from "sonner";
import {
  Pencil,
  Calendar as CalendarIcon,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./components/ui/dialog";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Calendar } from "./components/ui/calendar";
import { Badge } from "./components/ui/badge";
import { formatDate, getDeadlineStatus } from "./lib/utils";
import "./App.css";

const INITIAL_ROADMAP = [
  {
    section: "Fundamentals",
    collapsed: false,
    children: [
      {
        section: "Java Language & OOP Fundamentals",
        items: [
          {
            text: "Syntax, control structures, exception handling",
            checked: false,
          },
          {
            text: "Classes, objects, inheritance, polymorphism",
            checked: false,
          },
          { text: "Interfaces, abstract classes", checked: false },
          {
            text: "Collections (List, Map, Set, Stack, Queue)",
            checked: false,
          },
          {
            text: "Java 8+ features: Lambdas, Streams, Optional",
            checked: false,
          },
        ],
      },
      {
        section: "DSA in Java",
        items: [
          {
            text: "Re-implement CP knowledge in Java using: ArrayList, LinkedList, HashMap, TreeMap, HashSet, PriorityQueue",
            checked: false,
          },
          {
            text: "Solve LeetCode or HackerRank problems in Java to get used to syntax",
            checked: false,
          },
        ],
      },
      {
        section: "General Fundamentals",
        items: [
          { text: "Version control with Git", checked: false },
          { text: "Basic networking concepts", checked: false },
        ],
      },
    ],
  },
  {
    section: "Databases",
    collapsed: false,
    children: [
      {
        section: "Relational Databases",
        items: [
          { text: "PostgreSQL", checked: false },
          { text: "MySQL", checked: false },
        ],
      },
      {
        section: "NoSQL Databases",
        items: [
          { text: "MongoDB", checked: false },
          { text: "Redis", checked: false },
        ],
      },
      {
        section: "ORMs and Query Builders",
        items: [
          { text: "Learn an ORM (e.g., Hibernate, JPA)", checked: false },
        ],
      },
    ],
  },
  {
    section: "APIs",
    collapsed: false,
    children: [
      {
        section: "RESTful API Design",
        items: [{ text: "Design RESTful endpoints", checked: false }],
      },
      {
        section: "Authentication & Authorization",
        items: [{ text: "Implement JWT or OAuth", checked: false }],
      },
      {
        section: "API Documentation",
        items: [{ text: "Swagger/OpenAPI", checked: false }],
      },
    ],
  },
  {
    section: "DevOps & Deployment",
    collapsed: false,
    children: [
      {
        section: "Containerization",
        items: [{ text: "Docker", checked: false }],
      },
      {
        section: "CI/CD",
        items: [{ text: "Set up CI/CD pipeline", checked: false }],
      },
      {
        section: "Cloud Providers",
        items: [
          { text: "AWS", checked: false },
          { text: "GCP", checked: false },
          { text: "Azure", checked: false },
        ],
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
  const lastUnchecked = useRef(null);
  // Note/Deadline dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItemIdx, setEditItemIdx] = useState(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [deadlineDraft, setDeadlineDraft] = useState("");

  useEffect(() => {
    saveProgress(roadmap);
  }, [roadmap]);

  // Checkbox logic
  const handleCheck = (sectionIdx, itemIdx) => {
    const isCurrentlyChecked =
      !!roadmap[sectionIdx].children[itemIdx].items[itemIdx].checked;
    setRoadmap((prev) => {
      const updated = prev.map((section, sIdx) => ({
        ...section,
        children: section.children.map((child, cIdx) => ({
          ...child,
          items: child.items.map((item, iIdx) =>
            sIdx === sectionIdx && cIdx === itemIdx && iIdx === itemIdx
              ? { ...item, checked: !Boolean(item.checked) }
              : item
          ),
        })),
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
        const updated = prev.map((section, sIdx) => ({
          ...section,
          children: section.children.map((child, cIdx) => ({
            ...child,
            items: child.items.map((item, iIdx) =>
              sIdx === sectionIdx && cIdx === itemIdx && iIdx === itemIdx
                ? { ...item, checked: true }
                : item
            ),
          })),
        }));
        return updated;
      });
      lastUnchecked.current = null;
      toast.success("Undo successful!");
    }
  };

  // Open dialog for editing note/deadline
  const openEditDialog = (itemIdx) => {
    setEditItemIdx(itemIdx);
    setNoteDraft(roadmap[itemIdx].children[itemIdx].items[itemIdx].note || "");
    setDeadlineDraft(
      roadmap[itemIdx].children[itemIdx].items[itemIdx].deadline || ""
    );
    setDialogOpen(true);
  };

  // Save note/deadline for the correct item in the selected section
  const saveNoteDeadline = () => {
    setRoadmap((prev) => {
      const updated = prev.map((section, sIdx) => {
        if (sIdx !== itemIdx) return section;
        return {
          ...section,
          children: section.children.map((child, cIdx) => ({
            ...child,
            items: child.items.map((item, iIdx) =>
              iIdx === editItemIdx
                ? { ...item, note: noteDraft, deadline: deadlineDraft }
                : item
            ),
          })),
        };
      });
      return updated;
    });
    setDialogOpen(false);
  };

  // Progress calculation
  const totalItems = roadmap.reduce(
    (sum, sec) =>
      sum + sec.children.reduce((sum, child) => sum + child.items.length, 0),
    0
  );
  const completedItems = roadmap.reduce(
    (sum, sec) =>
      sum +
      sec.children.reduce(
        (sum, child) => sum + child.items.filter((item) => item.checked).length,
        0
      ),
    0
  );
  const percent = Math.round((completedItems / totalItems) * 100);

  // Toast for items due today
  useEffect(() => {
    roadmap.forEach((section) => {
      section.children.forEach((child) => {
        child.items.forEach((item) => {
          if (
            item.deadline &&
            getDeadlineStatus(item.deadline) === "today" &&
            !item.checked
          ) {
            toast(
              <span>
                <AlertCircle className="inline w-4 h-4 text-warning mr-1" />"
                {item.text}" is due today!
              </span>,
              { duration: 5000 }
            );
          }
        });
      });
    });
    // eslint-disable-next-line
  }, [roadmap]);

  return (
    <div className="min-h-screen flex bg-base-200">
      <Toaster position="top-center" richColors />
      {/* Main Content */}
      <main className="flex-1 p-6 max-w-3xl mx-auto w-full">
        <div className="max-w-3xl mx-auto w-full p-6">
          <h1 className="text-3xl font-bold mb-8">Backend Roadmap</h1>
          <div className="space-y-4">
            {roadmap.map((section, sectionIdx) => {
              // Gather all tasks (parent + children)
              const allTasks = [
                ...section.children.flatMap((child) => child.items),
              ];
              const allChecked =
                allTasks.length > 0 && allTasks.every((item) => item.checked);
              return (
                <div
                  className="collapse collapse-arrow bg-base-200"
                  key={section.section}
                >
                  <input type="checkbox" className="peer" />
                  <div className="collapse-title text-xl font-medium flex items-center gap-2">
                    {section.section}
                    {allChecked && (
                      <CheckCircle className="w-5 h-5 text-success ml-2" />
                    )}
                  </div>
                  <div className="collapse-content space-y-4">
                    {/* Parent tasks */}
                    {section.children.map((child, cIdx) => (
                      <div key={child.section} className="mt-4">
                        <div className="font-bold text-lg mb-2">
                          {child.section}
                        </div>
                        <div className="space-y-3">
                          {child.items.map((item, idx) => (
                            <div
                              key={item.text}
                              className="flex items-center gap-3 p-3 bg-base-100 rounded shadow border border-base-200"
                            >
                              <input
                                type="checkbox"
                                className="checkbox checkbox-primary"
                                checked={!!item.checked}
                                onChange={() => {
                                  setRoadmap((prev) =>
                                    prev.map((sec, sIdx) => {
                                      if (sIdx !== sectionIdx) return sec;
                                      return {
                                        ...sec,
                                        children: sec.children.map(
                                          (ch, chIdx) => {
                                            if (chIdx !== cIdx) return ch;
                                            return {
                                              ...ch,
                                              items: ch.items.map((it, iIdx) =>
                                                iIdx === idx
                                                  ? {
                                                      ...it,
                                                      checked: !it.checked,
                                                    }
                                                  : it
                                              ),
                                            };
                                          }
                                        ),
                                      };
                                    })
                                  );
                                }}
                                id={`section-${sectionIdx}-child-${cIdx}-item-${idx}`}
                              />
                              <label
                                htmlFor={`section-${sectionIdx}-child-${cIdx}-item-${idx}`}
                                className="flex-1 cursor-pointer"
                              >
                                {item.text}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
