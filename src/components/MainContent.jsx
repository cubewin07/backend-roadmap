import React from "react";
import RoadmapCard from "./RoadmapCard";

export default function MainContent({
  section,
  childrenSections,
  ...handlers
}) {
  return (
    <main className="flex-1 px-6 pt-10 min-h-screen w-full">
      <h1 className="text-3xl font-bold mb-10 text-center tracking-tight">
        {section}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-4">
        {childrenSections.map((child, childIdx) => (
          <RoadmapCard
            key={child.section}
            child={child}
            childIdx={childIdx}
            {...handlers}
          />
        ))}
      </div>
    </main>
  );
}
