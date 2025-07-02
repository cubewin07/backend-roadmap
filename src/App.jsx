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
  // Note/Deadline dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editSectionIdx, setEditSectionIdx] = useState(null);
  const [editItemIdx, setEditItemIdx] = useState(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [deadlineDraft, setDeadlineDraft] = useState("");

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
  const openEditDialog = (sectionIdx, itemIdx) => {
    setEditSectionIdx(sectionIdx);
    setEditItemIdx(itemIdx);
    setNoteDraft(roadmap[sectionIdx].items[itemIdx].note || "");
    setDeadlineDraft(roadmap[sectionIdx].items[itemIdx].deadline || "");
    setDialogOpen(true);
  };

  // Save note/deadline
  const saveNoteDeadline = () => {
    setRoadmap((prev) => {
      const updated = prev.map((section, sIdx) => ({
        ...section,
        items: section.items.map((item, iIdx) =>
          sIdx === editSectionIdx && iIdx === editItemIdx
            ? { ...item, note: noteDraft, deadline: deadlineDraft }
            : item
        ),
      }));
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
                    {/* Note & Deadline UI */}
                    <div className="flex items-center gap-2">
                      {item.note && (
                        <Badge variant="secondary" className="text-xs">
                          Note
                        </Badge>
                      )}
                      {item.deadline && (
                        <Badge
                          variant={
                            status === "overdue"
                              ? "destructive"
                              : status === "today"
                              ? "warning"
                              : status === "soon"
                              ? "outline"
                              : "secondary"
                          }
                          className="text-xs flex items-center gap-1"
                        >
                          <CalendarIcon className="w-3 h-3" />
                          {formatDate(item.deadline)}
                        </Badge>
                      )}
                      {status === "overdue" && (
                        <Badge variant="destructive" className="text-xs">
                          Overdue
                        </Badge>
                      )}
                      {status === "today" && (
                        <Badge variant="warning" className="text-xs">
                          Due Today
                        </Badge>
                      )}
                      {status === "soon" && (
                        <Badge variant="outline" className="text-xs">
                          Soon
                        </Badge>
                      )}
                      <Dialog
                        open={
                          dialogOpen &&
                          editSectionIdx === selectedSection &&
                          editItemIdx === idx
                        }
                        onOpenChange={setDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <button
                            className="btn btn-xs btn-ghost"
                            aria-label="Edit note and deadline"
                            onClick={() => openEditDialog(selectedSection, idx)}
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
                                deadlineDraft
                                  ? new Date(deadlineDraft)
                                  : undefined
                              }
                              onSelect={(date) =>
                                setDeadlineDraft(
                                  date ? date.toISOString().slice(0, 10) : ""
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
                    </div>
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
