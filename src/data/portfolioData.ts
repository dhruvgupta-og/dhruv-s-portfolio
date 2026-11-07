import { ProjectItem, SkillItem } from '@/types/portfolio';

export const CANDIDATE_INFO = {
  name: "Dhruv Gupta",
  role: "Full-Stack Software Engineer & Co-Founder",
  tagline: "Co-founder of Zappit · B.Tech CSE at ITM Gwalior · SDE Candidate 2025",
  location: "Gwalior, Madhya Pradesh, India",
  institution: "ITM Gwalior",
  degree: "B.Tech in Computer Science & Engineering",
  period: "2024 — 2028",
  headline: "Campus Startup Founder & Full-Stack Architect Building High-Utility Software Systems",
  leadParagraph: "I am a full-stack engineer and co-founder of Zappit (zappit.shop), where I architected and deployed a live campus food delivery platform serving university students and merchants in real time. My engineering focus combines reactive frontend development and distributed cloud databases with rigorous Data Structures & Algorithms in C++.",
  secondaryParagraph: "Beyond Zappit, I built and scaled RGPV Resources (rgpvpaper.in), an academic exam repository that has served over 10,000+ engineering students. I care deeply about building software that eliminates real friction—with clean architecture, sub-150ms latency, and thoughtful human ergonomics.",
  quote: "“Good software engineering isn't about buzzwords—it's about understanding real user bottlenecks, designing resilient data contracts, and delivering sub-150ms reliability under load.”",
  email: "dhruvedition@gmail.com",
  github: "https://github.com/dhruvgupta-og",
  githubUser: "dhruvgupta-og",
  leetcode: "https://leetcode.com/u/dhruvhereyo/",
  leetcodeUser: "dhruvhereyo",
  linkedin: "https://linkedin.com/in/dhruv-hereyo0",
  linkedinUser: "dhruv-hereyo0",
  availability: "Summer / Fall 2025 SDE Internships",
  ticketSerial: "DG-SDE-2025",
  badge: "SDE CANDIDATE '25",
  stats: [
    { label: "Production Platforms", value: "3 Shipped" },
    { label: "Active Student Reach", value: "10,000+" },
    { label: "Core Technical Stack", value: "React · Node · Firebase · C++" },
    { label: "Academic Standing", value: "B.Tech CSE (2024–2028)" }
  ]
};

export const PROJECTS: ProjectItem[] = [
  {
    id: "zappit",
    dispatchNo: "FLAGSHIP STARTUP • PRODUCTION SYSTEM",
    title: "Zappit — Campus Food Delivery Platform",
    subtitle: "Hyper-local ordering engine connecting university students directly with campus dining merchants in real time.",
    category: "Production Web Platform",
    status: "LIVE IN PRODUCTION",
    liveUrl: "https://zappit.shop",
    githubUrl: "https://github.com/dhruvgupta-og",
    metrics: ["Live at zappit.shop", "<150ms Live Order Sync", "Zero Kitchen Lag", "Role-Based Security"],
    techTags: ["React.js", "Firebase Firestore", "Firebase Auth", "Express.js", "Tailwind CSS"],
    bulletPoints: [
      {
        heading: "The Real-World Bottleneck",
        description: "Campus canteens suffer extreme congestion during brief 15-minute lecture breaks, causing students to wait in 20-minute physical queues and merchants to lose track of peak orders."
      },
      {
        heading: "Real-Time Event Architecture",
        description: "Architected reactive frontend state with Firestore real-time snapshot listeners. Order submissions propagate to merchant kitchen display terminals in under 150ms with zero manual polling."
      },
      {
        heading: "Multi-Role Access Control",
        description: "Implemented Firebase Auth with strict RBAC rules isolating student ordering flows, cafe kitchen dispatch boards, and store catalog inventory updates."
      },
      {
        heading: "Production Operations",
        description: "Shipped live to production at zappit.shop, continuously monitoring uptime and optimizing mobile responsiveness for student devices."
      }
    ],
    specSnippet: `// Zappit Real-Time Order Dispatch Pipeline
export const dispatchCampusOrder = async (orderPayload: OrderPayload) => {
  const batch = db.batch();
  const orderRef = db.collection('orders').doc();
  
  batch.set(orderRef, {
    ...orderPayload,
    status: 'PLACED',
    timestamp: serverTimestamp(),
    fulfillmentEstimateMinutes: 12
  });
  
  await batch.commit();
  return { orderId: orderRef.id, status: 'DISPATCHED' };
};`,
    architectureDiagram: `[Student Mobile Web] ──(Order Stream)──> [Firebase Firestore /orders] ──(Sub-150ms Snapshot)──> [Merchant Kitchen Screen]`
  },
  {
    id: "codexa",
    dispatchNo: "DEVELOPER TOOLING • ALGORITHMIC ANALYTICS",
    title: "Codexa — Placement & DSA Tracker",
    subtitle: "Interactive developer dashboard engineered to structure algorithmic problem-solving routines and track interview readiness.",
    category: "Analytics & Tooling",
    status: "ACTIVE ARCHITECTURE",
    liveUrl: "https://github.com/dhruvgupta-og",
    githubUrl: "https://github.com/dhruvgupta-og",
    metrics: ["84% Benchmark Met", "450+ Curated Problems", "Topic Readiness Gauge", "Local State Persistence"],
    techTags: ["React.js", "TypeScript", "Tailwind CSS", "Chart.js", "Data Structures"],
    bulletPoints: [
      {
        heading: "Algorithmic Progress Visualizer",
        description: "Built modular milestone meters tracking mastery across core DSA categories: Arrays, Two Pointers, Trees, Graphs, Dynamic Programming, and System Design."
      },
      {
        heading: "Retention & Spaced Repetition",
        description: "Implemented review intervals flagging complex problems when retention thresholds expire, ensuring structured retention for technical rounds."
      },
      {
        heading: "High-Density Clean UX",
        description: "Engineered a distraction-free developer interface providing instant visual metric feedback without external clutter or slow dependencies."
      }
    ],
    specSnippet: `// Codexa Problem Categorization Metric
export interface DSATopicMetric {
  topic: 'Arrays' | 'Trees' | 'Graphs' | 'DP' | 'SystemDesign';
  completed: number;
  benchmarkGoal: number;
  readinessPercentage: number;
}`,
    architectureDiagram: `[Daily LeetCode Problem] ──(State Dispatch)──> [Codexa Engine] ──(Readiness Calculation)──> [Visual Skill Matrix]`
  },
  {
    id: "rgpv-resources",
    dispatchNo: "COLLEGIATE PLATFORM • 10K+ USERS",
    title: "RGPV Resources — Academic Exam Hub",
    subtitle: "Centralized examination prep engine providing semester-wise curricula, vetted professor notes, and previous year question papers.",
    category: "Academic Infrastructure",
    status: "10,000+ USERS SERVED",
    liveUrl: "https://rgpvpaper.in",
    githubUrl: "https://github.com/dhruvgupta-og",
    metrics: ["10k+ Student Reach", "Multi-Semester Index", "<100ms Query Latency", "RBAC Uploads"],
    techTags: ["React.js", "Firebase Firestore", "Firebase Auth", "CDN Storage", "REST APIs"],
    bulletPoints: [
      {
        heading: "Tangible Campus Impact",
        description: "Reached over 10,000+ university engineering students across semesters seeking verified exam blueprints and professor study materials."
      },
      {
        heading: "Hierarchical NoSQL Schema",
        description: "Organized Firestore collections by department, semester, and course code (/departments/{dept}/semesters/{sem}/subjects/{code}/papers) reducing document lookups by 70%."
      },
      {
        heading: "Role-Based Resource Uploads",
        description: "Enforced Firebase Auth RBAC to verify faculty and student contributor uploads before distributing documents across the student network."
      }
    ],
    specSnippet: `// RGPV Firestore Resource Security Rule
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /departments/{dept}/semesters/{sem}/subjects/{subCode}/papers/{paperId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }
  }
}`,
    architectureDiagram: `[10,000+ University Students] ──(Filtered Query)──> [rgpvpaper.in API] ──(Fast Cache CDN)──> [Curated Exam Materials]`
  }
];

export const SKILLS_CATEGORIES = [
  {
    title: "Programming Languages",
    code: "01",
    skills: [
      { name: "C++", detail: "Primary DSA (LeetCode, Algorithms, Memory Model)" },
      { name: "JavaScript", detail: "ES6+, Async/Await, DOM, Event Loop" },
      { name: "TypeScript", detail: "Type Systems, Generics, Component Contracts" },
      { name: "Python", detail: "Automation, Scripting & Algorithmic Prototyping" }
    ]
  },
  {
    title: "Frontend Engineering",
    code: "02",
    skills: [
      { name: "React.js", detail: "Custom Hooks, Context, Virtual DOM, Performance" },
      { name: "Next.js", detail: "App Router, SSR, Static Prerendering, Turbopack" },
      { name: "Tailwind CSS", detail: "Design Systems, Responsive Layouts, Fluid Typography" },
      { name: "HTML5 / CSS3", detail: "Semantic Web, CSS Grid, Modern Layout Architectures" }
    ]
  },
  {
    title: "Backend & Cloud",
    code: "03",
    skills: [
      { name: "Node.js & Express", detail: "REST APIs, Middleware, Route Handlers, Async I/O" },
      { name: "Firebase Firestore", detail: "Real-time Listeners, Document Schemas, Indexing" },
      { name: "Firebase Auth", detail: "Session Handling, Role-Based Access Control (RBAC)" },
      { name: "PostgreSQL & MongoDB", detail: "Relational Queries, Normalization & NoSQL Aggregations" }
    ]
  },
  {
    title: "Computer Science Fundamentals",
    code: "04",
    skills: [
      { name: "Data Structures & Algorithms", detail: "Trees, Graphs, DP, Heaps, Complexity Analysis" },
      { name: "Object-Oriented Design", detail: "Abstraction, Polymorphism, SOLID Principles" },
      { name: "Database Systems (DBMS)", detail: "ACID Guarantees, Indexing, Transactions, SQL" },
      { name: "Git & Version Control", detail: "Branching Workflows, Code Review, GitHub Actions" }
    ]
  }
];

export const SKILLS: SkillItem[] = [
  { id: "cpp", name: "C++", category: "languages", specialty: "DSA Primary (LeetCode)", noticeNo: "SKILL-01", level: "Advanced" },
  { id: "js", name: "JavaScript (ES6+)", category: "languages", specialty: "Modern Asynchronous Web", noticeNo: "SKILL-02", level: "Proficient" },
  { id: "react", name: "React.js", category: "frontend", specialty: "Component State & Hooks", noticeNo: "SKILL-03", level: "Advanced" },
  { id: "next", name: "Next.js", category: "frontend", specialty: "Server Components & App Router", noticeNo: "SKILL-04", level: "Proficient" },
  { id: "node", name: "Node.js", category: "backend", specialty: "RESTful Runtimes & Middleware", noticeNo: "SKILL-05", level: "Proficient" },
  { id: "firebase", name: "Firebase Firestore", category: "databases", specialty: "Real-Time Cloud Database", noticeNo: "SKILL-06", level: "Advanced" },
  { id: "system_design", name: "System Design", category: "core_cs", specialty: "Modular & Scalable Architectures", noticeNo: "SKILL-07", level: "Practiced" },
  { id: "dsa", name: "DSA in C++", category: "core_cs", specialty: "Data Structures & Problem Solving", noticeNo: "SKILL-08", level: "Heavy Focus" },
];
