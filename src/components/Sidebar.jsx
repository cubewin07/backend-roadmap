import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Database,
  Cloud,
  ShieldCheck,
  FlaskConical,
  Rocket,
  ChevronLeft,
  ChevronRight,
  User,
  Settings,
  Sun,
  Moon,
  BarChart3,
  Calendar,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";

const sectionIcons = [
  BookOpen, // Fundamentals
  Database, // Databases
  Cloud, // APIs
  ShieldCheck, // Security
  FlaskConical, // Testing
  Rocket, // DevOps & Deployment
];

export default function Sidebar({
  sections,
  selectedSection,
  onSelectSection,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedIsDark = savedTheme ? savedTheme === "dark" : true;
    setIsDark(savedIsDark);
  }, []);

  // Calculate progress for each section
  const getSectionProgress = (section) => {
    const allTasks = section.children.flatMap((child) => child.tasks);
    const total = allTasks.length;
    const completed = allTasks.filter((task) => task.checked).length;
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH":
        return "badge-error";
      case "MEDIUM":
        return "badge-warning";
      case "LOW":
        return "badge-success";
      default:
        return "badge-secondary";
    }
  };

  // Get priority icon
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "HIGH":
        return <AlertTriangle className="w-3 h-3" />;
      case "MEDIUM":
        return <BarChart3 className="w-3 h-3" />;
      case "LOW":
        return <CheckCircle2 className="w-3 h-3" />;
      default:
        return <Calendar className="w-3 h-3" />;
    }
  };

  // Get overdue tasks count
  const getOverdueCount = (section) => {
    const allTasks = section.children.flatMap((child) => child.tasks);
    return allTasks.filter((task) => {
      if (!task.deadline || task.checked) return false;
      const deadline = new Date(task.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return deadline < today;
    }).length;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        onSelectSection(Math.min(selectedSection + 1, sections.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        onSelectSection(Math.max(selectedSection - 1, 0));
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedSection, sections.length, onSelectSection]);

  // Toggle theme
  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem("theme", newIsDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark");
  };

  return (
    <aside
      className={`${
        isCollapsed ? "w-20" : "w-80"
      } flex-shrink-0 bg-gradient-to-b from-primary/90 via-primary/70 to-base-100 shadow-2xl border-r border-base-300 flex flex-col z-20 min-h-screen transition-all duration-300 ease-in-out relative overflow-hidden`}
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/5 backdrop-blur-sm pointer-events-none" />

      {/* Collapse toggle button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg hover:shadow-xl transition-all z-30 border-2 border-base-100 hover:scale-110"
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="p-6 pb-4">
          <div
            className={`flex items-center gap-3 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="bg-primary rounded-full p-2 shadow-lg hover:shadow-xl transition-all">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-primary-foreground">
                  Backend Roadmap
                </h2>
                <p className="text-xs text-primary-foreground/70 mt-1">
                  Your learning journey
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 pb-4">
          <ul className="space-y-2">
            {sections.map((sec, idx) => {
              const Icon = sectionIcons[idx % sectionIcons.length] || BookOpen;
              const progress = getSectionProgress(sec);
              const overdueCount = getOverdueCount(sec);
              const isSelected = selectedSection === idx;

              return (
                <li key={sec.section} className="relative group">
                  <button
                    className={`w-full text-left p-4 rounded-xl font-semibold flex items-center gap-3 transition-all text-base shadow-sm border border-transparent hover:border-primary/40 hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/40 relative overflow-hidden ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary/80 shadow-lg scale-[1.02]"
                        : "bg-card/80 text-foreground backdrop-blur-sm"
                    }`}
                    onClick={() => onSelectSection(idx)}
                    title={isCollapsed ? sec.section : undefined}
                  >
                    {/* Animated background for selected */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent animate-pulse" />
                    )}

                    <div className="relative z-10 flex items-center gap-3 w-full">
                      <Icon
                        className={`w-6 h-6 flex-shrink-0 ${
                          isSelected
                            ? "text-primary-foreground"
                            : "text-primary"
                        }`}
                      />

                      {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="truncate font-semibold">
                              {sec.section.split(":")[0]}
                            </span>
                            <Badge
                              variant="outline"
                              className={`${getPriorityColor(
                                sec.priority
                              )} text-xs px-1.5 py-0.5`}
                            >
                              {getPriorityIcon(sec.priority)}
                              {sec.priority}
                            </Badge>
                            {overdueCount > 0 && (
                              <Badge
                                variant="destructive"
                                className="text-xs px-1.5 py-0.5"
                              >
                                {overdueCount} overdue
                              </Badge>
                            )}
                          </div>

                          {/* Progress bar */}
                          <div className="flex items-center gap-2">
                            <Progress
                              value={progress}
                              className="flex-1 h-1.5 bg-primary/20"
                            />
                            <span className="text-xs font-bold min-w-[2.5rem]">
                              {progress}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-1.5 rounded-r bg-accent shadow-lg" />
                    )}
                  </button>

                  {/* Hover tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-base-300 text-base-content px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 min-w-[200px]">
                      <div className="font-semibold mb-1">{sec.section}</div>
                      <div className="text-xs text-base-content/70">
                        Progress: {progress}% | Priority: {sec.priority}
                      </div>
                      {overdueCount > 0 && (
                        <div className="text-xs text-error mt-1">
                          {overdueCount} overdue tasks
                        </div>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-base-300/50">
          <div
            className={`flex items-center gap-3 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="bg-primary/20 hover:bg-primary/30 rounded-full p-2 transition-colors"
                title="User menu"
              >
                <User className="w-5 h-5 text-primary" />
              </button>

              {/* User menu dropdown */}
              {showUserMenu && !isCollapsed && (
                <div className="absolute bottom-full left-0 mb-2 bg-base-200 rounded-lg shadow-lg border border-base-300 p-2 min-w-[180px] z-50">
                  <div className="flex items-center gap-2 p-2 rounded hover:bg-base-300 cursor-pointer">
                    <User className="w-4 h-4" />
                    <span className="text-sm">Profile</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded hover:bg-base-300 cursor-pointer">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Settings</span>
                  </div>
                  <div className="border-t border-base-300 my-1" />
                  <button
                    onClick={toggleTheme}
                    className="flex items-center gap-2 p-2 rounded hover:bg-base-300 cursor-pointer w-full text-left"
                  >
                    {isDark ? (
                      <>
                        <Sun className="w-4 h-4" />
                        <span className="text-sm">Light Mode</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-4 h-4" />
                        <span className="text-sm">Dark Mode</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <div className="flex-1">
                <div className="text-sm font-semibold">Developer</div>
                <div className="text-xs text-base-content/70">
                  Backend Learning
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </aside>
  );
}
