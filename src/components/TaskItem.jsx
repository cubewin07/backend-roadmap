import React from "react";
import { Calendar as CalendarIcon, AlertCircle } from "lucide-react";
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
  if (typeof daysLeft === "number") {
    if (daysLeft > 0) {
      badge = (
        <span className="ml-2 px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700">
          {daysLeft} day{daysLeft > 1 ? "s" : ""} left
        </span>
      );
    } else if (daysLeft === 0) {
      badge = (
        <span className="ml-2 px-2 py-0.5 rounded text-xs bg-yellow-100 text-yellow-800">
          Today
        </span>
      );
    } else {
      badge = (
        <span className="ml-2 px-2 py-0.5 rounded text-xs bg-red-100 text-red-700">
          Overdue by {Math.abs(daysLeft)} day{Math.abs(daysLeft) > 1 ? "s" : ""}
        </span>
      );
    }
  }
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
        {badge}
        {status === "overdue" && (
          <AlertCircle className="w-4 h-4 text-destructive" title="Overdue" />
        )}
      </div>
    </li>
  );
}
