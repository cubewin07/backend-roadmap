import React from "react";
import RoadmapCard from "./RoadmapCard";
import { Badge } from "./ui/badge";
import { AlertTriangle, BarChart3, CheckCircle2 } from "lucide-react";

export default function MainContent({
  section,
  childrenSections,
  ...handlers
}) {
  // Calculate overall progress for the current section
  const getOverallProgress = () => {
    const allTasks = childrenSections.flatMap((child) => child.tasks);
    const total = allTasks.length;
    const completed = allTasks.filter((task) => task.checked).length;
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  // Get priority info
  const getPriorityInfo = () => {
    const priorities = childrenSections
      .map((child) => child.tasks.map((task) => task.priority))
      .flat();

    const highCount = priorities.filter((p) => p === "HIGH").length;
    const mediumCount = priorities.filter((p) => p === "MEDIUM").length;
    const lowCount = priorities.filter((p) => p === "LOW").length;

    return { highCount, mediumCount, lowCount };
  };

  const overallProgress = getOverallProgress();
  const priorityInfo = getPriorityInfo();

  return (
    <main className="flex-1 px-4 sm:px-6 pt-6 sm:pt-10 min-h-screen w-full transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header with section info */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            {section}
          </h1>

          {/* Section summary */}
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-base-content/70">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Progress:</span>
              <span className="text-primary font-bold">{overallProgress}%</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold">Tasks:</span>
              <span className="font-bold">
                {childrenSections.flatMap((child) => child.tasks).length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold">Sections:</span>
              <span className="font-bold">{childrenSections.length}</span>
            </div>
          </div>

          {/* Priority breakdown */}
          <div className="flex flex-wrap justify-center items-center gap-2 mt-3">
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
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-4">
          {childrenSections.map((child, childIdx) => (
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
