import React from "react";
import RoadmapCard from "./RoadmapCard";
import { Badge } from "./ui/badge";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock,
  Target,
} from "lucide-react";

export default function MainContent({
  phase,
  phaseIdx,
  selectedSectionIdx,
  phaseCompletion,
  ...handlers
}) {
  // Calculate overall progress for the current phase
  const getOverallProgress = () => {
    const allTasks = phase.children.flatMap((child) => child.tasks);
    const total = allTasks.length;
    const completed = allTasks.filter((task) => task.checked).length;
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  // Get priority info
  const getPriorityInfo = () => {
    const priorities = phase.children
      .map((child) => child.tasks.map((task) => task.priority))
      .flat();

    const highCount = priorities.filter((p) => p === "HIGH").length;
    const mediumCount = priorities.filter((p) => p === "MEDIUM").length;
    const lowCount = priorities.filter((p) => p === "LOW").length;

    return { highCount, mediumCount, lowCount };
  };

  const overallProgress = getOverallProgress();
  const priorityInfo = getPriorityInfo();

  // Determine which sections to show
  const sectionsToShow =
    selectedSectionIdx !== null
      ? [phase.children[selectedSectionIdx]]
      : phase.children;

  return (
    <main className="flex-1 px-4 sm:px-6 pt-6 sm:pt-10 min-h-screen w-full transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header with phase info */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className={`p-3 rounded-full shadow-lg ${
                phaseCompletion.isCompleted
                  ? "bg-emerald-500 text-white"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              {phaseCompletion.isCompleted ? (
                <CheckCircle2 className="w-8 h-8" />
              ) : (
                <Target className="w-8 h-8" />
              )}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {phase.section}
              </h1>
              {phaseCompletion.isCompleted && (
                <div className="text-emerald-600 font-semibold text-sm mt-1 animate-pulse">
                  🎉 Phase Completed!
                </div>
              )}
            </div>
          </div>

          {/* Phase description */}
          {phase.description && (
            <p className="text-base-content/70 text-sm sm:text-base max-w-2xl mx-auto mb-4">
              {phase.description}
            </p>
          )}

          {/* Phase summary */}
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-base-content/70 mb-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Progress:</span>
              <span className="text-primary font-bold">{overallProgress}%</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold">Tasks:</span>
              <span className="font-bold">
                {phase.children.flatMap((child) => child.tasks).length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold">Sections:</span>
              <span className="font-bold">{phase.children.length}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="font-semibold">Duration:</span>
              <span className="font-bold">{phase.estimatedDuration}</span>
            </div>
          </div>

          {/* Priority breakdown */}
          <div className="flex flex-wrap justify-center items-center gap-2 mb-4">
            {priorityInfo.highCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                <AlertTriangle className="w-3 h-3 mr-1" />
                {priorityInfo.highCount} High Priority
              </Badge>
            )}
            {priorityInfo.mediumCount > 0 && (
              <Badge variant="outline" className="text-xs badge-warning">
                <BarChart3 className="w-3 h-3 mr-1" />
                {priorityInfo.mediumCount} Medium Priority
              </Badge>
            )}
            {priorityInfo.lowCount > 0 && (
              <Badge variant="outline" className="text-xs badge-success">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                {priorityInfo.lowCount} Low Priority
              </Badge>
            )}
          </div>

          {/* Phase completion status */}
          {phaseCompletion.isCompleted && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <div>
                  <h3 className="font-semibold text-emerald-800">
                    Phase {phase.phase} Complete!
                  </h3>
                  <p className="text-sm text-emerald-700">
                    Congratulations! You've completed all{" "}
                    {phaseCompletion.total} tasks in this phase.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 px-2 sm:px-4">
          {sectionsToShow.map((child, childIdx) => (
            <RoadmapCard
              key={child.section}
              child={child}
              childIdx={childIdx}
              {...handlers}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
