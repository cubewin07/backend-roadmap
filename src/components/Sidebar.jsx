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
  AlertTriangle,
  CheckCircle2,
  Target,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";

const sectionIcons = [
  BookOpen, // Phase 1: Core Foundation
  Database, // Phase 2: Production-Ready
  Cloud, // Phase 3: Mobile Backend
  Rocket, // Phase 4: DevOps
  ShieldCheck, // Phase 5: Advanced Architecture
];

export default function Sidebar({
  sections,
  selectedPhaseIdx,
  selectedSectionIdx,
  onSelectPhase,
  onSelectSection,
  overallProgress,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [expandedPhase, setExpandedPhase] = useState(0); // Track which phase is expanded

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedIsDark = savedTheme ? savedTheme === "dark" : true;
    setIsDark(savedIsDark);
  }, []);

  // Calculate progress for each phase
  const getPhaseProgress = (phase) => {
    const allTasks = phase.children.flatMap((child) => child.tasks);
    const total = allTasks.length;
    const completed = allTasks.filter((task) => task.checked).length;
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  // Calculate progress for each section within a phase
  const getSectionProgress = (section) => {
    const total = section.tasks.length;
    const completed = section.tasks.filter((task) => task.checked).length;
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
        return <BarChart3 className="w-3 h-3" />;
    }
  };

  // Get overdue tasks count
  const getOverdueCount = (phase) => {
    const allTasks = phase.children.flatMap((child) => child.tasks);
    return allTasks.filter((task) => {
      if (!task.deadline || task.checked) return false;
      const deadline = new Date(task.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return deadline < today;
    }).length;
  };

  // Check if phase is completed
  const isPhaseCompleted = (phase) => {
    const allTasks = phase.children.flatMap((child) => child.tasks);
    const total = allTasks.length;
    const completed = allTasks.filter((task) => task.checked).length;
    return total > 0 && completed === total;
  };

  // Check if section is completed
  const isSectionCompleted = (section) => {
    const total = section.tasks.length;
    const completed = section.tasks.filter((task) => task.checked).length;
    return total > 0 && completed === total;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        onSelectSection(Math.min(selectedSectionIdx + 1, sections.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        onSelectSection(Math.max(selectedSectionIdx - 1, 0));
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedSectionIdx, sections.length, onSelectSection]);

  // Toggle theme
  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem("theme", newIsDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark");
  };

  // Toggle phase expansion
  const togglePhaseExpansion = (phaseIndex) => {
    setExpandedPhase(expandedPhase === phaseIndex ? -1 : phaseIndex);
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
              <Target className="w-6 h-6 text-primary-foreground" />
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

          {/* Overall Progress */}
          {!isCollapsed && (
            <div className="mt-4 p-3 bg-primary/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-primary-foreground">
                  Overall Progress
                </span>
                <span className="text-xs font-bold text-primary-foreground">
                  {overallProgress}%
                </span>
              </div>
              <Progress value={overallProgress} className="h-2 bg-primary/30" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 pb-4 overflow-y-auto">
          <div className="join join-vertical w-full">
            {sections.map((phase, phaseIdx) => {
              const Icon =
                sectionIcons[phaseIdx % sectionIcons.length] || BookOpen;
              const progress = getPhaseProgress(phase);
              const overdueCount = getOverdueCount(phase);
              const isSelected = selectedPhaseIdx === phaseIdx;
              const isCompleted = isPhaseCompleted(phase);
              const isExpanded = expandedPhase === phaseIdx;

              return (
                <div
                  key={phase.section}
                  className={`collapse collapse-arrow join-item mb-2 shadow-sm border border-base-200 rounded-xl transition-all duration-200 ${
                    isExpanded ? "collapse-open" : ""
                  } ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary/80 shadow-lg"
                      : isCompleted
                      ? "bg-emerald-500/20 text-emerald-800 border-emerald-400/60"
                      : "bg-card/80 text-foreground backdrop-blur-sm"
                  }`}
                >
                  {/* Phase Header */}
                  <input
                    type="radio"
                    name="sidebar-accordion"
                    checked={isExpanded}
                    onChange={() =>
                      setExpandedPhase(isExpanded ? -1 : phaseIdx)
                    }
                    className="peer"
                    readOnly
                  />
                  <div
                    className={`collapse-title flex items-center gap-3 p-4 cursor-pointer select-none relative ${
                      isSelected ? "bg-primary/20" : ""
                    }`}
                    onClick={() => {
                      onSelectPhase(phaseIdx);
                      setExpandedPhase(isExpanded ? -1 : phaseIdx);
                      onSelectSection(null); // Reset section selection when phase changes
                    }}
                  >
                    {/* Animated background for selected */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent animate-pulse pointer-events-none" />
                    )}
                    {/* Completion celebration for completed phases */}
                    {isCompleted && !isSelected && (
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-transparent animate-pulse pointer-events-none" />
                    )}
                    <div className="relative z-10 flex items-center gap-3 w-full">
                      <div
                        className={`p-2 rounded-full shadow-lg transition-all duration-300 ${
                          isCompleted
                            ? "bg-emerald-500 text-white"
                            : isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-primary/20"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="truncate font-semibold">
                              Phase {phase.phase}
                            </span>
                            <Badge
                              variant="outline"
                              className={`${getPriorityColor(
                                phase.priority
                              )} text-xs px-1.5 py-0.5`}
                            >
                              {getPriorityIcon(phase.priority)}
                              {phase.priority}
                            </Badge>
                            {overdueCount > 0 && (
                              <Badge
                                variant="destructive"
                                className="text-xs px-1.5 py-0.5"
                              >
                                {overdueCount} overdue
                              </Badge>
                            )}
                            {isCompleted && (
                              <Badge
                                variant="outline"
                                className="badge-success text-xs px-1.5 py-0.5"
                              >
                                ✓ Complete
                              </Badge>
                            )}
                          </div>
                          {/* Progress bar */}
                          <div className="flex items-center gap-2">
                            <Progress
                              value={progress}
                              className={`flex-1 h-1.5 ${
                                isCompleted ? "bg-emerald-200" : "bg-primary/20"
                              }`}
                            />
                            <span className="text-xs font-bold min-w-[2.5rem]">
                              {progress}%
                            </span>
                          </div>
                          {/* Phase duration */}
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3 text-base-content/50" />
                            <span className="text-xs text-base-content/50">
                              {phase.estimatedDuration}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-1.5 rounded-r bg-accent shadow-lg" />
                    )}
                  </div>
                  {/* Phase Sections (Accordion Content) */}
                  <div className="collapse-content p-0">
                    {!isCollapsed && isExpanded && (
                      <ul className="space-y-1 p-2">
                        {phase.children.map((section, sectionIdx) => {
                          const sectionProgress = getSectionProgress(section);
                          const sectionDone = section.tasks.filter(
                            (t) => t.checked
                          ).length;
                          const isSectionDone = isSectionCompleted(section);
                          const isSectionSelected =
                            selectedPhaseIdx === phaseIdx &&
                            selectedSectionIdx === sectionIdx;
                          return (
                            <li key={section.section} className="relative">
                              <button
                                className={`w-full text-left p-3 rounded-lg transition-all text-sm flex flex-col focus:outline-none relative ${
                                  isSectionSelected
                                    ? "bg-transparent text-accent-foreground border-2 border-accent"
                                    : isSectionDone
                                    ? "bg-emerald-100/50 text-emerald-800 border-emerald-200/50 border"
                                    : "bg-base-200 text-base-content border-base-300 hover:bg-base-300/60 border"
                                }`}
                                onClick={() => {
                                  onSelectPhase(phaseIdx);
                                  onSelectSection(sectionIdx);
                                  setExpandedPhase(phaseIdx);
                                }}
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <div
                                    className={`p-1 rounded-full ${
                                      isSectionDone
                                        ? "bg-emerald-500 text-white"
                                        : "bg-primary/20"
                                    }`}
                                  >
                                    {isSectionDone ? (
                                      <CheckCircle2 className="w-3 h-3" />
                                    ) : (
                                      <BookOpen className="w-3 h-3" />
                                    )}
                                  </div>
                                  <span
                                    className="font-medium truncate max-w-[12rem] block text-ellipsis whitespace-nowrap"
                                    title={section.section}
                                  >
                                    {section.section}
                                  </span>
                                  {isSectionDone && (
                                    <Badge
                                      variant="outline"
                                      className="badge-success text-xs px-1 py-0 ml-auto"
                                    >
                                      ✓
                                    </Badge>
                                  )}
                                </div>
                                {/* Section progress */}
                                <div className="flex items-center gap-2">
                                  <Progress
                                    value={sectionProgress}
                                    className={`flex-1 h-1 ${
                                      isSectionDone
                                        ? "bg-emerald-200"
                                        : "bg-primary/20"
                                    }`}
                                  />
                                  <span className="text-xs font-bold min-w-[2rem]">
                                    {sectionProgress}%
                                  </span>
                                </div>
                                {/* Task count */}
                                <div className="text-xs text-base-content/60 mt-1">
                                  {sectionDone}/{section.tasks.length} tasks
                                </div>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
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
