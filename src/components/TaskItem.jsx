import React from "react";
import { Calendar as CalendarIcon, AlertCircle } from "lucide-react";
import { getDeadlineStatus } from "../lib/utils";

export default function TaskItem({
  task,
  childIdx,
  taskIdx,
  handleCheck,
  handleSetDeadline,
}) {
  const status = getDeadlineStatus(task.deadline);
  return (
    <li
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
          onChange={(e) => handleSetDeadline(childIdx, taskIdx, e.target.value)}
        />
        {status === "overdue" && (
          <AlertCircle className="w-4 h-4 text-destructive" title="Overdue" />
        )}
      </div>
    </li>
  );
}
