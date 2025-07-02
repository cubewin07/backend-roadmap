import React, { useState, useEffect, useRef } from "react";
import { Progress } from "./components/ui/progress";
import { Toaster, toast } from "sonner";
import { Pencil, Calendar as CalendarIcon, AlertCircle } from "lucide-react";
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
    items: [
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
    children: [
      {
        section: "Java Language & OOP Fundamentals",
        collapsed: false,
        items: [
          {
            text: "Syntax, control structures, exception handling",
            note: "",
            deadline: "",
            checked: false,
          },
          {
            text: "Classes, objects, inheritance, polymorphism",
            note: "",
            deadline: "",
            checked: false,
          },
          {
            text: "Interfaces, abstract classes",
            note: "",
            deadline: "",
            checked: false,
          },
          {
            text: "Collections (List, Map, Set, Stack, Queue)",
            note: "",
            deadline: "",
            checked: false,
          },
          {
            text: "Java 8+ features: Lambdas, Streams, Optional",
            note: "",
            deadline: "",
            checked: false,
          },
        ],
      },
      {
        section: "DSA in Java",
        collapsed: false,
        items: [
          {
            text: "Re-implement CP knowledge in Java using: ArrayList, LinkedList, HashMap, TreeMap, HashSet, PriorityQueue",
            note: "",
            deadline: "",
            checked: false,
          },
          {
            text: "Solve LeetCode or HackerRank problems in Java to get used to syntax",
            note: "",
            deadline: "",
            checked: false,
          },
        ],
      },
    ],
  },
  {
    section: "Java Backend Tools",
    collapsed: false,
    items: [
      {
        text: "Maven / Gradle: Dependency management",
        note: "",
        deadline: "",
        checked: false,
      },
      { text: "JUnit: Unit testing", note: "", deadline: "", checked: false },
      {
        text: "Lombok: Reduce boilerplate",
        note: "",
        deadline: "",
        checked: false,
      },
      {
        text: "Logback/SLF4J: Logging",
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
  // Note/Deadline dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItemIdx, setEditItemIdx] = useState(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [deadlineDraft, setDeadlineDraft] = useState("");
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [modalSectionIdx, setModalSectionIdx] = useState(null);
  const [editNoteIdx, setEditNoteIdx] = useState(null);

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

  // Checkbox logic
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
        const updated = prev.map((section, sIdx) => ({
          ...section,
          items: section.items.map((item, iIdx) =>
            sIdx === sectionIdx && iIdx === itemIdx
              ? { ...item, checked: true }
              : item
          ),
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
    setNoteDraft(roadmap[selectedSection].items[itemIdx].note || "");
    setDeadlineDraft(roadmap[selectedSection].items[itemIdx].deadline || "");
    setDialogOpen(true);
  };

  // Save note/deadline for the correct item in the selected section
  const saveNoteDeadline = () => {
    setRoadmap((prev) => {
      const updated = prev.map((section, sIdx) => {
        if (sIdx !== selectedSection) return section;
        return {
          ...section,
          items: section.items.map((item, iIdx) =>
            iIdx === editItemIdx
              ? { ...item, note: noteDraft, deadline: deadlineDraft }
              : item
          ),
        };
      });
      return updated;
    });
    setDialogOpen(false);
  };

  // Progress calculation
  const totalItems = roadmap.reduce((sum, sec) => sum + sec.items.length, 0);
  const completedItems = roadmap.reduce(
    (sum, sec) => sum + sec.items.filter((item) => item.checked).length,
    0
  );
  const percent = Math.round((completedItems / totalItems) * 100);

  // Toast for items due today
  useEffect(() => {
    roadmap.forEach((section) => {
      section.items.forEach((item) => {
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
    // eslint-disable-next-line
  }, [roadmap]);

  // Open section modal
  const openSectionModal = (sectionIdx) => {
    setModalSectionIdx(sectionIdx);
    setSectionModalOpen(true);
    setEditNoteIdx(null);
    setNoteDraft("");
  };

  // Save note for item in modal
  const saveModalNote = (itemIdx) => {
    setRoadmap((prev) => {
      const updated = prev.map((section, sIdx) => {
        if (sIdx !== modalSectionIdx) return section;
        return {
          ...section,
          items: section.items.map((item, iIdx) =>
            iIdx === itemIdx ? { ...item, note: noteDraft } : item
          ),
        };
      });
      return updated;
    });
    setEditNoteIdx(null);
    setNoteDraft("");
  };

  return (
    <div className="min-h-screen flex bg-base-200">
      <Toaster position="top-center" richColors />
      {/* Sidebar */}
      <aside className="w-64 bg-base-100 shadow-lg p-4 hidden md:block">
        <h2 className="text-xl font-bold mb-6">Backend Roadmap</h2>
        <ul className="menu">
          {roadmap.map((sec, idx) => (
            <li key={sec.section} className="flex items-center gap-2 mb-2">
              <button
                className={`flex-1 text-left px-2 py-2 rounded-lg transition-colors
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
              <button
                className="btn btn-xs btn-outline ml-2"
                onClick={() => openSectionModal(idx)}
              >
                Show Notes
              </button>
            </li>
          ))}
        </ul>
      </aside>
      {/* Section Modal */}
      <Dialog open={sectionModalOpen} onOpenChange={setSectionModalOpen}>
        <DialogContent className="max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle>
              {modalSectionIdx !== null ? roadmap[modalSectionIdx].section : ""}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {modalSectionIdx !== null &&
              roadmap[modalSectionIdx].items.map((item, idx) => (
                <div
                  key={item.text}
                  className="p-4 rounded-lg bg-base-100 shadow border border-base-200"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={!!item.checked}
                      onChange={() => handleCheck(modalSectionIdx, idx)}
                      id={`modal-item-${modalSectionIdx}-${idx}`}
                    />
                    <label
                      htmlFor={`modal-item-${modalSectionIdx}-${idx}`}
                      className="flex-1 font-semibold text-lg cursor-pointer"
                    >
                      {item.text}
                    </label>
                    <button
                      className="btn btn-xs btn-outline"
                      onClick={() => {
                        setEditNoteIdx(idx);
                        setNoteDraft(item.note || "");
                      }}
                    >
                      {editNoteIdx === idx
                        ? "Cancel"
                        : item.note
                        ? "Edit Note"
                        : "Add Note"}
                    </button>
                  </div>
                  {/* Note Card */}
                  {editNoteIdx === idx ? (
                    <div className="mt-3 p-3 rounded bg-base-200 border border-primary flex flex-col gap-2">
                      <textarea
                        className="textarea textarea-bordered w-full"
                        value={noteDraft}
                        onChange={(e) => setNoteDraft(e.target.value)}
                        rows={3}
                        placeholder="Add your note here..."
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => saveModalNote(idx)}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => {
                            setEditNoteIdx(null);
                            setNoteDraft("");
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    item.note && (
                      <div className="mt-3 p-3 rounded bg-base-200 border border-base-300 text-sm">
                        <span className="font-semibold text-primary">
                          Note:
                        </span>{" "}
                        {item.note}
                      </div>
                    )
                  )}
                </div>
              ))}
          </div>
          <DialogFooter>
            <button
              className="btn btn-ghost"
              onClick={() => setSectionModalOpen(false)}
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
              {roadmap[selectedSection].items.map((item, idx) => {
                const status = getDeadlineStatus(item.deadline);
                return (
                  <li
                    key={item.text}
                    className={`flex items-center gap-3 p-4 bg-base-100 rounded-lg shadow border border-base-200 relative
                      ${
                        status === "overdue"
                          ? "border-destructive"
                          : status === "soon"
                          ? "border-warning"
                          : ""
                      }
                    `}
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
                    <Dialog
                      open={dialogOpen && editItemIdx === idx}
                      onOpenChange={setDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <button
                          className="btn btn-xs btn-ghost"
                          aria-label="Edit note and deadline"
                          onClick={() => openEditDialog(idx)}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Note & Deadline</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium">
                            Note
                          </label>
                          <Textarea
                            value={noteDraft}
                            onChange={(e) => setNoteDraft(e.target.value)}
                            placeholder="Add your note here..."
                            rows={3}
                          />
                          <label className="block text-sm font-medium mt-2">
                            Deadline
                          </label>
                          <Calendar
                            mode="single"
                            selected={
                              deadlineDraft && !isNaN(new Date(deadlineDraft))
                                ? new Date(deadlineDraft)
                                : undefined
                            }
                            onSelect={(date) =>
                              setDeadlineDraft(
                                date ? date.toLocaleDateString("en-CA") : ""
                              )
                            }
                            className="rounded-md border"
                          />
                          {deadlineDraft && (
                            <div className="text-xs mt-1">
                              Selected: {formatDate(deadlineDraft)}
                            </div>
                          )}
                        </div>
                        <DialogFooter>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={saveNoteDeadline}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => setDialogOpen(false)}
                          >
                            Cancel
                          </button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
