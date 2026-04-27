export const PROFILE = {
  name: "YURI TRICHES",
  title: "FULLSTACK DEVELOPER",
  role: "React · Node · TypeScript · PostgreSQL",
  level: 23,
  online: true,
  location: "Brasil",
  email: "yuri@example.com",
  stats: [
    { label: "STR", value: 14, mod: "+2", tip: "Problem Solving" },
    { label: "DEX", value: 18, mod: "+4", tip: "Clean Code" },
    { label: "INT", value: 20, mod: "+5", tip: "Architecture" },
    { label: "LCK", value: 7,  mod: "-2", tip: "Deployments" },
  ],
  hp: 80,
  sp: 65,
};

export const SKILLS = [
  { category: "FRONTEND",  items: ["React", "Next.js", "TypeScript", "Tailwind", "Framer Motion"] },
  { category: "BACKEND",   items: ["Node.js", "Express", "NestJS", "REST", "GraphQL"] },
  { category: "DATABASE",  items: ["PostgreSQL", "MongoDB", "Redis", "Prisma", "Drizzle"] },
  { category: "DEVOPS",    items: ["Docker", "AWS", "CI/CD", "Linux", "Git"] },
];

export const PROJECTS = [
  {
    name: "PROJECT_ALPHA.exe",
    desc: "SaaS de gestão com dashboard em tempo real, autenticação OAuth e notificações por WebSocket.",
    stack: ["Next.js", "PostgreSQL", "Redis"],
    emoji: "🚀",
    status: "LIVE",
    href: "#",
    date: "2026",
  },
  {
    name: "PROJECT_BETA.exe",
    desc: "API RESTful com rate limiting, cache inteligente e documentação Swagger auto-gerada.",
    stack: ["NestJS", "MongoDB", "Docker"],
    emoji: "⚡",
    status: "LIVE",
    href: "#",
    date: "2025",
  },
  {
    name: "PROJECT_GAMMA.exe",
    desc: "App mobile-first com PWA, modo offline e sincronização em background.",
    stack: ["React", "Node", "AWS"],
    emoji: "🛸",
    status: "WIP",
    href: "#",
    date: "2025",
  },
];

export const SOCIALS = [
  { label: "GITHUB",   href: "https://github.com/",   icon: "Github" },
  { label: "LINKEDIN", href: "https://linkedin.com/",  icon: "Linkedin" },
  { label: "EMAIL",    href: "mailto:yuri@example.com",icon: "Mail" },
  { label: "DISCORD",  href: "#",                       icon: "MessageSquare" },
];
