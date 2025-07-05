import React from "react";
import {
  Calendar as CalendarIcon,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { getDeadlineStatus, getDaysLeft } from "../lib/utils";

export default function TaskItem({
  task,
  childIdx,
  taskIdx,
  handleCheck,
  handleSetDeadline,
}) {
  const status = getDeadlineStatus(task.deadline);
  const daysLeft = getDaysLeft(task.deadline);
  let badge = null;
  if (!task.checked && typeof daysLeft === "number") {
    if (daysLeft > 0) {
      badge = (
        <span className="ml-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 whitespace-nowrap">
          {daysLeft} day{daysLeft > 1 ? "s" : ""} left
        </span>
      );
    } else if (daysLeft === 0) {
      badge = (
        <span className="ml-1 px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 whitespace-nowrap">
          Today
        </span>
      );
    } else {
      badge = (
        <span className="ml-1 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700 whitespace-nowrap">
          Overdue by {Math.abs(daysLeft)} day{Math.abs(daysLeft) > 1 ? "s" : ""}
        </span>
      );
    }
  }

  let rowClass = "";
  if (task.checked) {
    if (status === "overdue") {
      rowClass = "border-green-600 bg-green-100/40"; // Overdue but finished
    } else {
      rowClass = "border-green-400 bg-green-100/20"; // Finished on time
    }
  } else if (status === "overdue") {
    rowClass = "border-destructive bg-red-100/10"; // Overdue and not finished
  } else {
    rowClass = "border-base-200"; // Default
  }

  return (
    <li
      className={`flex items-center gap-3 p-3 rounded transition-colors ${rowClass}`}
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
        className={`flex-1 cursor-pointer text-base ${
          task.checked ? "line-through text-green-700/80" : ""
        }`}
      >
        {task.text}
      </label>
      <div className="flex items-center gap-2 min-w-[180px] justify-end">
        <div className="flex items-center gap-1">
          <CalendarIcon className="w-4 h-4" />
          <input
            type="date"
            className="input input-xs input-bordered"
            value={task.deadline || ""}
            onChange={(e) =>
              handleSetDeadline(childIdx, taskIdx, e.target.value)
            }
          />
        </div>
        {badge}
        {task.checked && (
          <CheckCircle2
            className="w-5 h-5 text-green-600 ml-1"
            title="Completed"
          />
        )}
        {!task.checked && status === "overdue" && (
          <AlertCircle className="w-4 h-4 text-destructive" title="Overdue" />
        )}
      </div>
    </li>
  );
}
