import React from "react";
import { Progress } from "../components/ui/progress";
import {
  Plus,
  BookOpen,
  ListOrdered,
  Database,
  Cloud,
  ShieldCheck,
  FlaskConical,
  Rocket,
  X,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import TaskItem from "./TaskItem";

const cardIcons = [
  BookOpen, // Fundamentals
  ListOrdered, // DSA
  Database, // Databases
  Cloud, // APIs
  ShieldCheck, // Security
  FlaskConical, // Testing
  Rocket, // DevOps
];

export default function RoadmapCard({
  child,
  childIdx,
  addingTaskIdx,
  newTask,
  deadlineDraft,
  setNewTask,
  setDeadlineDraft,
  setAddingTaskIdx,
  handleAddTask,
  handleCheck,
  handleSetDeadline,
  priority,
}) {
  // Progress calculation for a subtask
  const total = child.tasks.length;
  const done = child.tasks.filter((t) => t.checked).length;
  const progress = total === 0 ? 0 : Math.round((done / total) * 100);
  const isCompleted = total > 0 && done === total;

  // Pick icon based on section index, fallback to BookOpen
  const Icon = cardIcons[childIdx % cardIcons.length] || BookOpen;

  // Priority badge color
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-500 text-white";
      case "MEDIUM":
        return "bg-yellow-400 text-black";
      case "LOW":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  return (
    <div
      className={`relative group card shadow-xl rounded-2xl border-2 p-0 flex flex-col h-full min-h-[340px] transition-all duration-500 overflow-hidden ${
        isCompleted
          ? "bg-gradient-to-br from-emerald-400/30 via-green-300/20 to-teal-400/30 border-emerald-400/60 shadow-2xl hover:shadow-emerald-500/25 hover:-translate-y-2 animate-pulse"
          : "bg-gradient-to-br from-indigo-900/40 via-indigo-800/30 to-blue-900/30 border-indigo-700/40 hover:shadow-2xl hover:-translate-y-1 hover:border-indigo-500/80"
      }`}
    >
      {/* Accent bar */}
      <div
        className={`absolute left-0 top-0 h-full w-2 rounded-l-2xl ${
          isCompleted
            ? "bg-gradient-to-b from-emerald-500 via-green-400 to-teal-500 animate-pulse"
            : "bg-gradient-to-b from-indigo-500 via-purple-500 to-blue-500"
        }`}
      />

      {/* Priority badge top right */}
      <div
        className={`absolute top-4 right-6 z-20 px-3 py-1 rounded-full text-xs font-bold shadow ${getPriorityBadge(
          priority
        )}`}
      >
        {priority}
      </div>

      {/* Completion celebration overlay */}
      {isCompleted && (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-transparent to-teal-400/10 animate-pulse pointer-events-none" />
      )}

      {/* Sparkles effect for completed cards */}
      {isCompleted && (
        <div className="absolute top-2 right-2 text-emerald-500 animate-bounce">
          <Sparkles className="w-5 h-5" />
        </div>
      )}

      {/* Card header */}
      <div
        className={`flex items-center justify-between px-6 pt-6 pb-3 mb-2 rounded-t-2xl ${
          isCompleted
            ? "bg-gradient-to-r from-emerald-500/40 to-teal-400/30"
            : "bg-gradient-to-r from-indigo-700/80 to-blue-900/60"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-full shadow-lg transition-all duration-300 ${
              isCompleted
                ? "bg-emerald-500 text-white animate-pulse"
                : "bg-indigo-500/20"
            }`}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-7 h-7" />
            ) : (
              <Icon className="w-7 h-7 text-indigo-300 drop-shadow" />
            )}
          </div>
          <h2
            className={`card-title text-xl font-extrabold tracking-tight drop-shadow-sm ${
              isCompleted ? "text-emerald-100" : "text-white"
            }`}
          >
            {child.section}
            {isCompleted && (
              <span className="ml-2 text-sm font-normal text-emerald-200">
                ✓ Complete!
              </span>
            )}
          </h2>
        </div>
        <div className="flex flex-col items-end">
          <div className="relative flex items-center">
            <Progress
              value={progress}
              className={`w-28 h-2 rounded-full ${
                isCompleted ? "bg-emerald-200" : "bg-blue-200"
              }`}
            />
            <span
              className={`ml-2 text-xs font-bold ${
                isCompleted ? "text-emerald-100" : "text-indigo-200"
              }`}
            >
              {progress}%
            </span>
          </div>
          {isCompleted && (
            <div className="text-xs text-emerald-100 font-semibold mt-1 animate-pulse">
              🎉 All Done!
            </div>
          )}
        </div>
      </div>

      {/* Task list */}
      <ul
        className={`flex-1 space-y-3 mb-4 px-6 rounded-b-2xl pt-2 pb-2 ${
          isCompleted ? "bg-emerald-50/30" : "bg-indigo-900/20"
        }`}
      >
        {child.tasks.map((task, taskIdx) => (
          <TaskItem
            key={task.text}
            task={task}
            childIdx={childIdx}
            taskIdx={taskIdx}
            handleCheck={handleCheck}
            handleSetDeadline={handleSetDeadline}
          />
        ))}
      </ul>

      {/* Add new task */}
      <div className="px-6 pb-6">
        {addingTaskIdx === childIdx ? (
          <div
            className={`flex flex-col gap-3 mt-2 p-4 rounded-lg border ${
              isCompleted
                ? "bg-emerald-50/50 border-emerald-200/50"
                : "bg-base-100/50 border-indigo-200/30"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3
                className={`text-sm font-semibold ${
                  isCompleted ? "text-emerald-700" : "text-indigo-200"
                }`}
              >
                Add New Task
              </h3>
              <button
                onClick={() => {
                  setAddingTaskIdx(null);
                  setNewTask("");
                  setDeadlineDraft("");
                }}
                className={`btn btn-ghost btn-xs btn-circle ${
                  isCompleted
                    ? "hover:bg-emerald-100 hover:text-emerald-600"
                    : "hover:bg-red-100 hover:text-red-600"
                }`}
                title="Cancel"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <input
              className="input input-bordered input-sm w-full"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter task description..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && newTask.trim()) {
                  handleAddTask(childIdx);
                }
              }}
            />
            <input
              type="date"
              className="input input-bordered input-xs w-full"
              value={deadlineDraft}
              onChange={(e) => setDeadlineDraft(e.target.value)}
              placeholder="Set deadline (optional)"
            />
            <div className="flex gap-2">
              <button
                className={`btn btn-sm flex-1 ${
                  isCompleted ? "btn-success" : "btn-primary"
                }`}
                onClick={() => handleAddTask(childIdx)}
                disabled={!newTask.trim()}
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Task
              </button>
              <button
                className="btn btn-outline btn-sm flex-1 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
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
            className={`btn btn-outline btn-md mt-2 w-full flex items-center justify-center gap-2 transition-all hover:scale-[1.02] ${
              isCompleted
                ? "border-emerald-300 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-400 group-hover:btn-success"
                : "group-hover:btn-primary"
            }`}
            onClick={() => setAddingTaskIdx(childIdx)}
          >
            <Plus className="w-4 h-4" /> Add Task
          </button>
        )}
      </div>
    </div>
  );
}
