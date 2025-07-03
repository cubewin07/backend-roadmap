import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format a date string as YYYY-MM-DD
export function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Check if a date is today, overdue, or soon (within 3 days)
export function getDeadlineStatus(dateStr) {
  if (!dateStr) return null;
  const now = new Date();
  const date = new Date(dateStr);
  const diff = (date - now) / (1000 * 60 * 60 * 24);
  if (diff < 0) return "overdue";
  if (diff < 1) return "today";
  if (diff < 4) return "soon";
  return null;
}

export function getDaysLeft(deadline) {
  if (!deadline) return null;
  const today = new Date();
  const due = new Date(deadline);
  if (isNaN(due.getTime())) return null;
  // Zero out time for both dates
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  const diff = Math.round((due - today) / (1000 * 60 * 60 * 24));
  return diff;
}
