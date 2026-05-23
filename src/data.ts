import { Skill, AdvancedTechnology, Project, Education, Certification, StatCounter } from "./types";

export const personalInfo = {
  name: "D. Ratheesh",
  fullName: "Dhanasekar Ratheesh",
  role: "AI & Data Science Student",
  degree: "B.Tech Artificial Intelligence and Data Science",
  college: "Dhanalakshmi Srinivasan Engineering College",
  location: "Erode, Tamil Nadu, India",
  email: "ratheeshratheesh18428@gmail.com",
  phone: "8778930455",
  linkedin: "ratheesh123",
  linkedinUrl: "https://www.linkedin.com/in/ratheesh123", // simulated typical portfolio format
  githubUrl: "https://github.com/ratheesh123",
  tagline: "Transforming Data into Intelligent Solutions",
  aboutText: `I am an ambitious Artificial Intelligence and Data Science pioneer, deeply committed to engineering highly automated, intelligent software and robust analytical systems. Balancing state-of-the-art academic theory at Dhanalakshmi Srinivasan Engineering College with hand-crafted neural frameworks, computer vision loops, and predictive classifiers, I build real-world systems that synthesize raw chaos into beautiful business intelligence. My journey bridges Python automation, machine learning intelligence, and generative models to create interactive systems for the future.`
};

export const statsData: StatCounter[] = [
  { value: 5, suffix: "+", label: "Core Projects", subtext: "Production-ready solutions" },
  { value: 8, suffix: "", label: "Skills Mastered", subtext: "From regression to prompt engineering" },
  { value: 92, suffix: "%", label: "Accuracy Average", subtext: "In trained predictive classifiers" },
  { value: 2027, suffix: "", label: "Graduation Year", subtext: "B.Tech AI & Data Science" }
];

export const skillsList: Skill[] = [
  { name: "Python", category: "Languages", level: 90, iconName: "Code" },
  { name: "Machine Learning", category: "Core AI & ML", level: 85, iconName: "Cpu" },
  { name: "Data Science", category: "Core AI & ML", level: 80, iconName: "Database" },
  { name: "Artificial Intelligence", category: "Core AI & ML", level: 85, iconName: "Workflow" },
  { name: "HTML/CSS", category: "Web & Others", level: 80, iconName: "Layout" },
  { name: "Data Analytics", category: "Core AI & ML", level: 82, iconName: "BarChart" },
  { name: "Prompt Engineering", category: "Web & Others", level: 92, iconName: "Sparkles" },
  { name: "Problem Solving", category: "Engineering Soft Skills", level: 88, iconName: "Target" }
];

export const technologiesData: AdvancedTechnology[] = [
  {
    title: "Generative AI",
    description: "Developing prompt workflows, fine-tuning endpoints, and orchestrating multimodal logic pipelines.",
    iconName: "Sparkles",
    glowColor: "cyan",
    features: ["LLM Prompt Optimization", "Context Grounding", "RAG Pipeline Archetype"]
  },
  {
    title: "Deep Learning",
    description: "Architecting multilayer perceptrons, deep learning backbones, and gradient propagation frameworks.",
    iconName: "BrainCircuit",
    glowColor: "purple",
    features: ["Tensorflow & PyTorch", "Weight Optimization", "Loss Contour Convergence"]
  },
  {
    title: "Neural Networks",
    description: "Designing convolutional layers, recurrent units, and deep sequence processing systems.",
    iconName: "Activity",
    glowColor: "indigo",
    features: ["CNN Architectures", "LSTM & RNN Sequences", "Hyperparameter Tuning"]
  },
  {
    title: "AI Automation",
    description: "Scripting autonomous cron services, webhook responders, and background agents with zero human drag.",
    iconName: "Zap",
    glowColor: "pink",
    features: ["Auto OS Scripting", "Async Jobs Queue", "Event Trigger APIs"]
  },
  {
    title: "Computer Vision",
    description: "Developing low-latency image processing feeds, localized box predictions, and spatial arrays.",
    iconName: "Eye",
    glowColor: "cyan",
    features: ["OpenCV Matrix Filtering", "Pretrained YOLO Models", "Face Recognition Math"]
  },
  {
    title: "Cloud AI",
    description: "Deploying and scaling inferences within sandboxed, containerized, serverless compute engines.",
    iconName: "Cloud",
    glowColor: "purple",
    features: ["Docker Ingress Containers", "Serverless API Routing", "Key-vault Orchestration"]
  },
  {
    title: "Big Data",
    description: "Structuring, cleaning, parsing, and engineering schemas for high-velocity transaction tables.",
    iconName: "Database",
    glowColor: "indigo",
    features: ["SQL Relational Schemas", "Pandas & Numpy Tensors", "Feature Pipeline Scrape"]
  },
  {
    title: "AI Chatbots",
    description: "Structuring state-authoritative chat contexts with low latency streaming and natural dialogue loops.",
    iconName: "MessageCircle",
    glowColor: "pink",
    features: ["Dialog State Persistence", "System Context Constraints", "JSON Endpoint Delivery"]
  }
];

export const projectsList: Project[] = [
  {
    title: "AI Chatbot",
    description: "Intelligent conversational interface grounding state-of-the-art NLP models with strict custom system guidance instructions.",
    detailedDescription: "A gorgeous, modular chatbot interface demonstrating natural dialogue loops, persistent session arrays, and contextual prompt constraints. Employs advanced client-side state managers alongside lazy-loaded backend integration to bypass traditional UI latency.",
    techStack: ["Node.js", "Express", "Gemini-3.5-Flash", "TypeScript", "Tailwind CSS"],
    githubUrl: "https://github.com/ratheesh123/ai-portfolio-chatbot",
    liveUrl: "#chat",
    category: "AI",
    iconName: "MessageSquare",
    featured: true
  },
  {
    title: "Face Detection System",
    description: "Real-time face tracking, cascade-localization, and spatial box classification streaming through video inputs.",
    detailedDescription: "An advanced computer vision script parsing low-latency video matrix inputs using OpenCV frame buffering. Applies cascade-classifier matrices and deep prediction blocks to detect and locate faces instantly with minimal CPU overhead.",
    techStack: ["Python", "OpenCV", "NumPy", "Deep Neural Networks"],
    githubUrl: "https://github.com/ratheesh123/face-detection-system",
    liveUrl: "#",
    category: "Computer Vision",
    iconName: "Eye",
    featured: true
  },
  {
    title: "Student Performance Prediction",
    description: "Predictive regression analytics studying historical datasets to forecast academic grades accurately.",
    detailedDescription: "A rigorous mathematical predictive model engineered using Scikit-Learn pipelines. Analyzes student study habits, attendance ratios, and pre-test metric scores to output highly accurate continuous grade forecasts and trigger automatic early intervention reports.",
    techStack: ["Python", "Scikit-Learn", "Pandas", "Matplotlib"],
    githubUrl: "https://github.com/ratheesh123/student-perf-predictor",
    liveUrl: "#",
    category: "Analytics",
    iconName: "Binary",
    featured: false
  },
  {
    title: "Smart Attendance System",
    description: "Fully automated computer vision registry marking database logs via deep face embedding math.",
    detailedDescription: "A commercial-grade automated registrar system. Streams network IP cameras, translates contours into 128-dimensional biometric embedding coordinates, correlates records with database instances, and registers attendance stamps in real time.",
    techStack: ["Python", "OpenCV", "Face-Recognition Classifiers", "SQLite3"],
    githubUrl: "https://github.com/ratheesh123/smart-attendance-vision",
    liveUrl: "#",
    category: "Computer Vision",
    iconName: "Scan",
    featured: true
  },
  {
    title: "Data Analytics Dashboard",
    description: "Interactive visual analytics suite processing high-density transactional data into beautiful corporate intelligence charts.",
    detailedDescription: "A responsive data visualization command deck rendering multi-axis distribution graphs, correlation matrices, and live trend monitors. Decouples heavy CSV parse operations to maintain fluid 60FPS UI transitions during deep filtering queries.",
    techStack: ["Python", "Dash/Streamlit", "Plotly Tensors", "Pandas Core"],
    githubUrl: "https://github.com/ratheesh123/data-analytics-dashboard",
    liveUrl: "#",
    category: "Analytics",
    iconName: "LineChart",
    featured: false
  }
];

export const educationTimeline: Education[] = [
  {
    institution: "Dhanalakshmi Srinivasan Engineering College",
    degree: "B.Tech - Artificial Intelligence and Data Science",
    timeline: "2023 – 2027",
    score: "Active Learner",
    location: "Erode, Tamil Nadu, India",
    description: "Specializing in statistical inference, machine learning, neuro-architectures, data mining pipelines, and cloud computing architectures. Active participant in engineering hackathons and software automation workshops.",
    iconName: "GraduationCap"
  },
  {
    institution: "Higher Secondary Education (Class 12)",
    degree: "State Board Science & Mathematics",
    timeline: "Completed 2023",
    score: "76% Aggregate Score",
    location: "Tamil Nadu, India",
    description: "Concentrated studies in Core Physics, Advanced Mathematics, Chemistry, and Computer Science algorithms. Developed a solid logical foundation that triggered an interest in computing systems.",
    iconName: "Award"
  },
  {
    institution: "Secondary School Leaving Certificate (Class 10)",
    degree: "State Board General Studies",
    timeline: "Completed 2021",
    score: "All Pass",
    location: "Tamil Nadu, India",
    description: "Initial foundational education with early focus on mathematics, logical theorems, and basic scientific frameworks.",
    iconName: "CheckCircle"
  }
];

export const certificationsList: Certification[] = [
  {
    title: "Python Programming Certification",
    issuer: "Industry Verified Program / Technical Academy",
    date: "Completed",
    skillsAcquired: ["Object Oriented Python", "File Automation APIs", "Data Schemas & Dataframe Slicing", "Functional Programming"],
    iconName: "Award"
  }
];
