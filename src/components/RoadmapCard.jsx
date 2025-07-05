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
}) {
  // Progress calculation for a subtask
  const total = child.tasks.length;
  const done = child.tasks.filter((t) => t.checked).length;
  const progress = total === 0 ? 0 : Math.round((done / total) * 100);

  // Pick icon based on section index, fallback to BookOpen
  const Icon = cardIcons[childIdx % cardIcons.length] || BookOpen;

  return (
    <div className="relative group card bg-gradient-to-br from-indigo-500/20 via-purple-400/10 to-blue-400/10 shadow-xl rounded-2xl border-2 border-indigo-400/40 p-0 flex flex-col h-full min-h-[340px] transition-all hover:shadow-2xl hover:-translate-y-1 hover:border-indigo-500/80 overflow-hidden">
      {/* Accent bar */}
      <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-indigo-500 via-purple-500 to-blue-500 rounded-l-2xl" />
      {/* Card header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-3 mb-2 bg-gradient-to-r from-indigo-500/30 to-blue-400/10 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <Icon className="w-7 h-7 text-indigo-600 drop-shadow" />
          <h2 className="card-title text-xl font-extrabold tracking-tight text-indigo-700 drop-shadow-sm">
            {child.section}
          </h2>
        </div>
        <div className="flex flex-col items-end">
          <div className="relative flex items-center">
            <Progress
              value={progress}
              className="w-28 h-2 rounded-full bg-blue-200"
            />
            <span className="ml-2 text-xs font-bold text-indigo-700">
              {progress}%
            </span>
          </div>
        </div>
      </div>
      {/* Task list */}
      <ul className="flex-1 space-y-3 mb-4 px-6 bg-indigo-100/10 rounded-b-2xl pt-2 pb-2">
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
          <div className="flex flex-col gap-3 mt-2 p-4 bg-base-100/50 rounded-lg border border-indigo-200/30">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-indigo-700">
                Add New Task
              </h3>
              <button
                onClick={() => {
                  setAddingTaskIdx(null);
                  setNewTask("");
                  setDeadlineDraft("");
                }}
                className="btn btn-ghost btn-xs btn-circle hover:bg-red-100 hover:text-red-600"
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
                className="btn btn-primary btn-sm flex-1"
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
            className="btn btn-outline btn-md mt-2 w-full flex items-center justify-center gap-2 group-hover:btn-primary transition-all hover:scale-[1.02]"
            onClick={() => setAddingTaskIdx(childIdx)}
          >
            <Plus className="w-4 h-4" /> Add Task
          </button>
        )}
      </div>
    </div>
  );
}
