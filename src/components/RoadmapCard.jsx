import React from "react";
import { Progress } from "../components/ui/progress";
import { Plus, Calendar as CalendarIcon, AlertCircle } from "lucide-react";
import TaskItem from "./TaskItem";
import { getDeadlineStatus } from "../lib/utils";

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

  return (
    <div className="card bg-white dark:bg-base-100 shadow-md rounded-2xl border border-base-300 p-6 flex flex-col h-full min-h-[320px] transition-all hover:shadow-lg hover:-translate-y-1">
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
}
