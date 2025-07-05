import React from "react";
import RoadmapCard from "./RoadmapCard";

export default function MainContent({
  section,
  childrenSections,
  ...handlers
}) {
  return (
    <main className="flex-1 px-4 sm:px-6 pt-6 sm:pt-10 min-h-screen w-full transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 text-center tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {section}
        </h1>
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
