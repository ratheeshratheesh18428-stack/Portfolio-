export interface Skill {
  name: string;
  category: "Languages" | "Core AI & ML" | "Web & Others" | "Engineering Soft Skills";
  level: number; // percentage (e.g., 90)
  iconName: string; // Lucide icon alias
}

export interface AdvancedTechnology {
  title: string;
  description: string;
  iconName: string;
  glowColor: "cyan" | "purple" | "indigo" | "pink";
  features: string[];
}

export interface Project {
  title: string;
  description: string;
  detailedDescription?: string;
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
  category: "AI" | "Computer Vision" | "Analytics";
  iconName: string;
  featured: boolean;
}

export interface Education {
  institution: string;
  degree: string;
  timeline: string;
  score: string;
  location: string;
  description: string;
  iconName: string;
}

export interface Certification {
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  skillsAcquired: string[];
  iconName: string;
}

export interface StatCounter {
  value: number;
  suffix: string;
  label: string;
  subtext: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model" | "system";
  text: string;
  timestamp: Date;
  isFallback?: boolean;
}
