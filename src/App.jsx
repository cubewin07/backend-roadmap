import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";

const ENHANCED_ROADMAP = [
  {
    section: "Phase 1: Core Foundation (Your Current Roadmap)",
    priority: "HIGH",
    phase: 1,
    description: "Essential Java and Spring Boot fundamentals",
    estimatedDuration: "4-6 weeks",
    children: [
      {
        section: "Java Language & OOP Fundamentals",
        tasks: [
          {
            text: "Syntax, control structures, exception handling",
            checked: false,
            deadline: "",
            priority: "HIGH",
          },
          {
            text: "Classes, objects, inheritance, polymorphism",
            checked: false,
            deadline: "",
            priority: "HIGH",
          },
          {
            text: "Interfaces, abstract classes, access modifiers",
            checked: false,
            deadline: "",
            priority: "HIGH",
          },
          {
            text: "Packages, static vs instance, Java memory model",
            checked: false,
            deadline: "",
            priority: "MEDIUM",
          },
          {
            text: "Java 8+ features: Lambdas, Streams, Optional",
            checked: false,
            deadline: "",
            priority: "HIGH",
          },
        ],
      },
      {
        section: "DSA in Java",
        tasks: [
          {
            text: "Re-implement CP knowledge in Java",
            checked: false,
            deadline: "",
            priority: "HIGH",
          },
          {
            text: "Collections: List, Set, Map, Queue",
            checked: false,
            deadline: "",
            priority: "HIGH",
          },
          {
            text: "Generics, Comparable, Comparator",
            checked: false,
            deadline: "",
            priority: "MEDIUM",
          },
        ],
      },
      {
        section: "Databases - Foundation",
        tasks: [
          {
            text: "PostgreSQL setup and basics",
            checked: false,
            deadline: "",
            priority: "HIGH",
          },
          {
            text: "SQL basics: SELECT, JOIN, GROUP BY",
            checked: false,
            deadline: "",
            priority: "HIGH",
          },
          {
            text: "Spring Data JPA + Hibernate",
            checked: false,
            deadline: "",
            priority: "HIGH",
          },
          {
            text: "Entity relationships (OneToMany, ManyToOne)",
            checked: false,
            deadline: "",
            priority: "HIGH",
          },
        ],
      },
      {
        section: "RESTful API Design",
        tasks: [
          {
            text: "Design RESTful endpoints",
            checked: false,
            deadline: "",
            priority: "HIGH",
          },
          {
            text: "Spring Boot controllers and services",
            checked: false,
            deadline: "",
            priority: "HIGH",
          },
          {
            text: "DTOs and validation with annotations",
            checked: false,
            deadline: "",
            priority: "HIGH",
          },
          {
            text: "Exception handling with @ControllerAdvice",
            checked: false,
            deadline: "",
            priority: "HIGH",
          },
        ],
      },
      {
        section: "Basic Security",
        tasks: [
          {
            text: "Spring Security basics",
            checked: false,
            deadline: "",
            priority: "HIGH",
          },
          {
            text: "JWT authentication",
            checked: false,
            deadline: "",
            priority: "HIGH",
          },
          {
            text: "Role-based access control",
            checked: false,
            deadline: "",
            priority: "MEDIUM",
          },
          {
            text: "Password encoding with BCrypt",
            checked: false,
            deadline: "",
            priority: "HIGH",
          },
        ],
      },
      {
        section: "Testing Foundation",
        tasks: [
          {
            text: "Unit testing with JUnit 5",
            checked: false,
            deadline: "",
            priority: "HIGH",
          },
          {
            text: "Mocking with Mockito",
            checked: false,
            deadline: "",
            priority: "HIGH",
          },
          {
            text: "Integration testing with Spring Boot Test",
            checked: false,
            deadline: "",
            priority: "MEDIUM",
          },
          {
            text: "Test REST endpoints with MockMvc",
            checked: false,
            deadline: "",
            priority: "MEDIUM",
          },
        ],
      },
    ],
  },
  {
    section: "Phase 2: Production-Ready Backend",
    priority: "HIGH",
    phase: 2,
    description: "Production-ready features and optimizations",
    estimatedDuration: "3-4 weeks",
    children: [
      {
        section: "API Enhancement",
        tasks: [
          {
            text: "OpenAPI/Swagger documentation with SpringDoc",
            checked: false,
            deadline: "",
            priority: "HIGH",
          },
          {
            text: "API versioning strategies (/v1, /v2)",
            checked: false,
            deadline: "",
            priority: "MEDIUM",
          },
          {
            text: "Request/Response logging and monitoring",
            checked: false,
            deadline: "",
            priority: "HIGH",
          },
          {
            text: "Rate limiting with bucket4j",
            checked: false,
            deadline: "",
            priority: "MEDIUM",
          },
        ],
      },
      {
        section: "Advanced Database",
        tasks: [
          {
            text: "Database design principles and normalization",
            checked: false,
            deadline: "",
            priority: "HIGH",
          },
          {
            text: "Query optimization and indexing",
            checked: false,
            deadline: "",
            priority: "HIGH",
          },
          {
            text: "Database migrations with Flyway",
            checked: false,
            deadline: "",
            priority: "HIGH",
          },
          {
            text: "Connection pooling (HikariCP)",
            checked: false,
            deadline: "",
            priority: "MEDIUM",
          },
          {
            text: "Database transactions and isolation levels",
            checked: false,
            deadline: "",
            priority: "MEDIUM",
          },
        ],
      },
      {
        section: "Caching & Performance",
        tasks: [
          {
            text: "Redis for caching and sessions",
            checked: false,
            deadline: "",
            priority: "HIGH",
          },
          {
            text: "Spring Cache abstraction (@Cacheable)",
            checked: false,
            deadline: "",
            priority: "HIGH",
          },
          {
            text: "Application-level caching strategies",
            checked: false,
            deadline: "",
            priority: "MEDIUM",
          },
          {
            text: "Database query optimization",
            checked: false,
            deadline: "",
            priority: "MEDIUM",
          },
        ],
      },
      {
        section: "Configuration & Logging",
        tasks: [
          {
            text: "Spring Profiles for different environments",
            checked: false,
            deadline: "",
            priority: "HIGH",
          },
          {
            text: "Externalized configuration (application.yml)",
            checked: false,
            deadline: "",
            priority: "HIGH",
          },
          {
            text: "Logging with SLF4J and Logback",
            checked: false,
            deadline: "",
            priority: "HIGH",
          },
          {
            text: "Structured logging for production",
            checked: false,
            deadline: "",
            priority: "MEDIUM",
          },
        ],
      },
      {
        section: "Monitoring & Observability",
        tasks: [
          {
            text: "Spring Boot Actuator for health checks",
            checked: false,
            deadline: "",
            priority: "HIGH",
          },
          {
            text: "Custom metrics with Micrometer",
            checked: false,
            deadline: "",
            priority: "MEDIUM",
          },
          {
            text: "Application monitoring setup",
            checked: false,
            deadline: "",
            priority: "MEDIUM",
          },
        ],
      },
    ],
  },
  {
    section: "Phase 3: Mobile Backend Specifics",
    priority: "HIGH",
    phase: 3,
    description: "Mobile-first backend features and patterns",
    estimatedDuration: "2-3 weeks",
    children: [
      {
        section: "Mobile-First Features",
        tasks: [
          {
            text: "File upload/storage with AWS S3 or Cloudinary",
            checked: false,
            deadline: "",
            priority: "HIGH",
          },
          {
            text: "Image processing and optimization",
            checked: false,
            deadline: "",
            priority: "MEDIUM",
          },
          {
            text: "Push notifications with Firebase Cloud Messaging",
            checked: false,
            deadline: "",
            priority: "HIGH",
          },
          {
            text: "Real-time features with WebSockets",
            checked: false,
            deadline: "",
            priority: "MEDIUM",
          },
        ],
      },
      {
        section: "Mobile API Patterns",
        tasks: [
          {
            text: "Pagination for large datasets",
            checked: false,
            deadline: "",
            priority: "HIGH",
          },
          {
            text: "Offline-first API design",
            checked: false,
            deadline: "",
            priority: "MEDIUM",
          },
          {
            text: "Data synchronization strategies",
            checked: false,
            deadline: "",
            priority: "MEDIUM",
          },
          {
            text: "Mobile-optimized response formats",
            checked: false,
            deadline: "",
            priority: "MEDIUM",
          },
        ],
      },
      {
        section: "Advanced Security",
        tasks: [
          {
            text: "OAuth 2.0 / OpenID Connect",
            checked: false,
            deadline: "",
            priority: "HIGH",
          },
          {
            text: "API key management",
            checked: false,
            deadline: "",
            priority: "MEDIUM",
          },
          {
            text: "CORS configuration for web/mobile",
            checked: false,
            deadline: "",
            priority: "HIGH",
          },
          {
            text: "Input validation and sanitization",
            checked: false,
            deadline: "",
            priority: "HIGH",
          },
        ],
      },
    ],
  },
  {
    section: "Phase 4: DevOps & Deployment",
    priority: "MEDIUM",
    phase: 4,
    description: "Deployment and DevOps practices",
    estimatedDuration: "2-3 weeks",
    children: [
      {
        section: "Containerization",
        tasks: [
          {
            text: "Docker basics and concepts",
            checked: false,
            deadline: "",
            priority: "HIGH",
          },
          {
            text: "Create optimized Dockerfile for Spring Boot",
            checked: false,
            deadline: "",
            priority: "HIGH",
          },
          {
            text: "Docker Compose for local development",
            checked: false,
            deadline: "",
            priority: "MEDIUM",
          },
          {
            text: "Multi-stage builds for production",
            checked: false,
            deadline: "",
            priority: "MEDIUM",
          },
        ],
      },
      {
        section: "CI/CD Pipeline",
        tasks: [
          {
            text: "GitHub Actions for automated testing",
            checked: false,
            deadline: "",
            priority: "MEDIUM",
          },
          {
            text: "Automated deployment pipeline",
            checked: false,
            deadline: "",
            priority: "MEDIUM",
          },
          {
            text: "Environment-specific configurations",
            checked: false,
            deadline: "",
            priority: "MEDIUM",
          },
        ],
      },
      {
        section: "Cloud Deployment",
        tasks: [
          {
            text: "Deploy to Railway/Render/Heroku",
            checked: false,
            deadline: "",
            priority: "HIGH",
          },
          {
            text: "Database hosting (PostgreSQL on cloud)",
            checked: false,
            deadline: "",
            priority: "HIGH",
          },
          {
            text: "Environment variables and secrets management",
            checked: false,
            deadline: "",
            priority: "HIGH",
          },
          {
            text: "Basic AWS services (S3, RDS, EC2)",
            checked: false,
            deadline: "",
            priority: "LOW",
          },
        ],
      },
    ],
  },
  {
    section: "Phase 5: Advanced Architecture (Optional)",
    priority: "LOW",
    phase: 5,
    description: "Advanced patterns and technologies",
    estimatedDuration: "As needed",
    children: [
      {
        section: "Microservices Patterns",
        tasks: [
          {
            text: "Service decomposition strategies",
            checked: false,
            deadline: "",
            priority: "LOW",
          },
          {
            text: "Inter-service communication",
            checked: false,
            deadline: "",
            priority: "LOW",
          },
          {
            text: "API Gateway patterns",
            checked: false,
            deadline: "",
            priority: "LOW",
          },
        ],
      },
      {
        section: "Message Queues",
        tasks: [
          {
            text: "RabbitMQ for async processing",
            checked: false,
            deadline: "",
            priority: "LOW",
          },
          {
            text: "Apache Kafka for event streaming",
            checked: false,
            deadline: "",
            priority: "LOW",
          },
        ],
      },
      {
        section: "Alternative Technologies",
        tasks: [
          {
            text: "GraphQL with Spring GraphQL",
            checked: false,
            deadline: "",
            priority: "LOW",
          },
          {
            text: "NoSQL databases (MongoDB)",
            checked: false,
            deadline: "",
            priority: "LOW",
          },
          {
            text: "Reactive programming with Spring WebFlux",
            checked: false,
            deadline: "",
            priority: "LOW",
          },
        ],
      },
    ],
  },
];

// Suggested Learning Path Priority:
// 1. Complete Phase 1 (Your current roadmap) - 4-6 weeks
// 2. Phase 2 (Production basics) - 3-4 weeks
// 3. Phase 3 (Mobile specifics) - 2-3 weeks
// 4. Phase 4 (DevOps basics) - 2-3 weeks
// 5. Phase 5 (Advanced topics) - As needed for specific projects

// Key Projects to Build:
// After Phase 1: Simple REST API with authentication
// After Phase 2: Production-ready API with caching and monitoring
// After Phase 3: Mobile backend with file upload and push notifications
// After Phase 4: Fully deployed application with CI/CD

const STORAGE_KEY = "roadmap-progress-v4";

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || ENHANCED_ROADMAP;
  } catch {
    return ENHANCED_ROADMAP;
  }
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export default function App() {
  const [roadmap, setRoadmap] = useState(loadProgress());
  const [selectedPhaseIdx, setSelectedPhaseIdx] = useState(0);
  const [selectedSectionIdx, setSelectedSectionIdx] = useState(null); // null = show all sections in phase
  const [newTask, setNewTask] = useState("");
  const [addingTaskIdx, setAddingTaskIdx] = useState(null);
  const [deadlineDraft, setDeadlineDraft] = useState("");

  // Initialize theme from localStorage or default to dark
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme ? savedTheme === "dark" : true;
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    saveProgress(roadmap);
  }, [roadmap]);

  // Calculate overall progress for the entire roadmap
  const getOverallProgress = () => {
    const allTasks = roadmap.flatMap((phase) =>
      phase.children.flatMap((section) => section.tasks)
    );
    const total = allTasks.length;
    const completed = allTasks.filter((task) => task.checked).length;
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  // Get phase completion status
  const getPhaseCompletion = (phase) => {
    const allTasks = phase.children.flatMap((section) => section.tasks);
    const total = allTasks.length;
    const completed = allTasks.filter((task) => task.checked).length;
    return {
      total,
      completed,
      percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
      isCompleted: total > 0 && completed === total,
    };
  };

  // Add new task to a subtask
  const handleAddTask = (childIdx) => {
    if (!newTask.trim()) return;
    setRoadmap((prev) =>
      prev.map((sec, sIdx) => {
        if (sIdx !== selectedPhaseIdx) return sec;
        return {
          ...sec,
          children: sec.children.map((child, cIdx) => {
            if (cIdx !== childIdx) return child;
            return {
              ...child,
              tasks: [
                ...child.tasks,
                {
                  text: newTask,
                  checked: false,
                  deadline: deadlineDraft,
                  priority: "MEDIUM",
                },
              ],
            };
          }),
        };
      })
    );
    setNewTask("");
    setDeadlineDraft("");
    setAddingTaskIdx(null);
  };

  // Toggle task checked
  const handleCheck = (childIdx, taskIdx) => {
    setRoadmap((prev) =>
      prev.map((sec, sIdx) => {
        if (sIdx !== selectedPhaseIdx) return sec;
        return {
          ...sec,
          children: sec.children.map((child, cIdx) => {
            if (cIdx !== childIdx) return child;
            return {
              ...child,
              tasks: child.tasks.map((task, tIdx) =>
                tIdx === taskIdx ? { ...task, checked: !task.checked } : task
              ),
            };
          }),
        };
      })
    );
  };

  // Set deadline for a task
  const handleSetDeadline = (childIdx, taskIdx, date) => {
    setRoadmap((prev) =>
      prev.map((sec, sIdx) => {
        if (sIdx !== selectedPhaseIdx) return sec;
        return {
          ...sec,
          children: sec.children.map((child, cIdx) => {
            if (cIdx !== childIdx) return child;
            return {
              ...child,
              tasks: child.tasks.map((task, tIdx) =>
                tIdx === taskIdx ? { ...task, deadline: date } : task
              ),
            };
          }),
        };
      })
    );
  };

  // Robust handler to select phase and section together
  const handleSelectSection = (phaseIdx, sectionIdx) => {
    setSelectedPhaseIdx(phaseIdx);
    setSelectedSectionIdx(sectionIdx);
  };

  const currentPhase = roadmap[selectedPhaseIdx];
  const phaseCompletion = getPhaseCompletion(currentPhase);
  const overallProgress = getOverallProgress();

  return (
    <div className="flex min-h-screen bg-base-200">
      <Sidebar
        sections={roadmap}
        selectedPhaseIdx={selectedPhaseIdx}
        selectedSectionIdx={selectedSectionIdx}
        onSelectPhase={setSelectedPhaseIdx} // for keyboard nav, optional
        onSelectSection={setSelectedSectionIdx} // for keyboard nav, optional
        onSelectPhaseSection={handleSelectSection}
        overallProgress={overallProgress}
      />
      <MainContent
        phase={currentPhase}
        phaseIdx={selectedPhaseIdx}
        selectedSectionIdx={selectedSectionIdx}
        phaseCompletion={phaseCompletion}
        addingTaskIdx={addingTaskIdx}
        setAddingTaskIdx={setAddingTaskIdx}
        newTask={newTask}
        setNewTask={setNewTask}
        deadlineDraft={deadlineDraft}
        setDeadlineDraft={setDeadlineDraft}
        handleAddTask={handleAddTask}
        handleCheck={handleCheck}
        handleSetDeadline={handleSetDeadline}
      />
    </div>
  );
}
