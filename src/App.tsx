import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  personalInfo, 
  statsData, 
  skillsList, 
  technologiesData, 
  projectsList, 
  educationTimeline, 
  certificationsList 
} from "./data";
import { Skill, Project, ChatMessage } from "./types";
import { MatrixBackground } from "./components/MatrixBackground";
import { SkillCard } from "./components/SkillCard";
import { TechCard } from "./components/TechCard";
import { LucideIcon } from "./components/LucideIcon";

export default function App() {
  // Navigation active tab
  const [activeSection, setActiveSection] = useState("nexus");
  
  // Custom project categories
  const [selectedProjectCategory, setSelectedProjectCategory] = useState<"All" | "AI" | "Computer Vision" | "Analytics">("All");
  
  // Project description modal state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Chatbot active state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: "welcome-msg",
      role: "model",
      text: "Greetings. I am D. Ratheesh's AI Assistant. Ask me anything about his credentials, B.Tech studies at Dhanalakshmi Srinivasan Engineering College, skills in Python, ML, Computer Vision, or how to contact him!",
      timestamp: new Date()
    }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Contact form state
  const [formState, setFormState] = useState({ name: "", email: "", subject: "", message: "" });
  const [formSent, setFormSent] = useState(false);
  const [sendingForm, setSendingForm] = useState(false);

  // Interactive mouse visual feedback
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Sync scroll behavior to highlight visible sections
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "about", "skills", "projects", "education", "contact"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // For automatic smooth scroll to chat on bot launch
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isChatLoading]);

  // Handle chatbot communications
  const handleSendMessage = async (customMessage?: string) => {
    const textToSend = customMessage || chatInput;
    if (!textToSend.trim() || isChatLoading) return;

    setChatInput("");
    
    // User message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: textToSend,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      // Map history down for backend
      const historyPayload = chatHistory
        .filter(c => c.id !== "welcome-msg")
        .map(c => ({
          role: c.role,
          text: c.text
        }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload
        })
      });

      const data = await response.json();
      
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "model",
        text: data.text || "Neural connection timeout. Let me coordinate my pathways and try again.",
        timestamp: new Date(),
        isFallback: !!data.fallback
      };

      setChatHistory(prev => [...prev, botMsg]);

    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        role: "model",
        text: "My apologies. I encountered a link error. However, you can read Ratheesh's complete academic timeline, certificates, and skills directly below!",
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleQuickQuestion = (qn: string) => {
    // Open chat widget if minimized, then query
    setIsChatOpen(true);
    handleSendMessage(qn);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;
    setSendingForm(true);

    // Simulate clean network dispatch
    setTimeout(() => {
      setSendingForm(false);
      setFormSent(true);
      // Save contact inquiry to client state
      const messages = JSON.parse(localStorage.getItem("inquiries") || "[]");
      messages.push({ ...formState, timestamp: new Date().toISOString() });
      localStorage.setItem("inquiries", JSON.stringify(messages));
      
      // Clear fields
      setFormState({ name: "", email: "", subject: "", message: "" });
    }, 1400);
  };

  const downloadManifest = () => {
    // Generate a high-end futuristic JSON Manifest representing D. Ratheesh's portfolio
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      developer: personalInfo.name,
      college: personalInfo.college,
      department: "Artificial Intelligence and Data Science",
      degree: personalInfo.degree,
      contact: {
        email: personalInfo.email,
        phone: personalInfo.phone,
        linkedin: `https://linkedin.com/in/${personalInfo.linkedin}`
      },
      skills: skillsList,
      technologies: technologiesData,
      projects: projectsList,
      education: educationTimeline,
      system_status: "OPTIMAL_INFERENCE_READY"
    }, null, 2));
    
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${personalInfo.name.replace(/\s+/g, '_')}_AI_Manifest.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Safe subset render of projects matching selected tab category
  const filteredProjects = selectedProjectCategory === "All"
    ? projectsList
    : projectsList.filter(p => p.category === selectedProjectCategory);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans relative overflow-x-hidden selection:bg-indigo-500/30 selection:text-white">
      
      {/* Absolute Blurred Cosmic Orbs */}
      <div className="absolute top-[-5%] left-[-10%] w-[35rem] h-[35rem] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[35rem] h-[35rem] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[5%] w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Floating Interactive Matrix particles background */}
      <MatrixBackground />

      {/* Futuristic Mouse Shadow Spotlight */}
      <div 
        className="hidden md:block fixed pointer-events-none w-[600px] h-[600px] rounded-full bg-indigo-500/[0.015] blur-[120px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 z-50"
        style={{ left: `${mousePosition.x}px`, top: `${mousePosition.y}px` }}
      />

      {/* Scanline visual overlay effect */}
      <div className="pointer-events-none fixed inset-0 z-40 bg-gradient-to-b from-[#121010]/0 to-[#000]/25 bg-[length:100%_4px] opacity-15" />

      {/* SECTION VIEWPORT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col gap-10 py-6">
        
        {/* HEADER / NAVIGATION BAR */}
        <header className="relative flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-950/40 border border-slate-800/40 backdrop-blur-xl rounded-2xl px-6 md:px-8 py-4 z-30 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-display font-black text-xl shadow-[0_0_15px_rgba(99,102,241,0.25)] tracking-tighter">
              DR
            </div>
            <div>
              <h1 className="text-lg font-display font-extrabold tracking-tight text-white flex items-center gap-2">
                D. RATHEESH
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="System Ready" />
              </h1>
              <p className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase">
                B.Tech AI & Data Science
              </p>
            </div>
          </div>
          
          <nav className="flex flex-wrap justify-center items-center gap-4 md:gap-7 text-xs font-mono font-medium tracking-wider uppercase">
            <a 
              href="#hero" 
              onClick={() => setActiveSection("hero")}
              className={`transition-colors duration-200 cursor-pointer ${activeSection === "hero" ? "text-cyan-400 border-b-2 border-cyan-400/80 pb-1" : "text-slate-400 hover:text-white"}`}
            >
              Nexus
            </a>
            <a 
              href="#about" 
              onClick={() => setActiveSection("about")}
              className={`transition-colors duration-200 cursor-pointer ${activeSection === "about" ? "text-cyan-400 border-b-2 border-cyan-400/80 pb-1" : "text-slate-400 hover:text-white"}`}
            >
              Core Node
            </a>
            <a 
              href="#skills" 
              onClick={() => setActiveSection("skills")}
              className={`transition-colors duration-200 cursor-pointer ${activeSection === "skills" ? "text-cyan-400 border-b-2 border-cyan-400/80 pb-1" : "text-slate-400 hover:text-white"}`}
            >
              Intelligence
            </a>
            <a 
              href="#projects" 
              onClick={() => setActiveSection("projects")}
              className={`transition-colors duration-200 cursor-pointer ${activeSection === "projects" ? "text-cyan-400 border-b-2 border-cyan-400/80 pb-1" : "text-slate-400 hover:text-white"}`}
            >
              Forge
            </a>
            <a 
              href="#education" 
              onClick={() => setActiveSection("education")}
              className={`transition-colors duration-200 cursor-pointer ${activeSection === "education" ? "text-cyan-400 border-b-2 border-cyan-400/80 pb-1" : "text-slate-400 hover:text-white"}`}
            >
              Timeline
            </a>
            <a 
              href="#contact" 
              onClick={() => setActiveSection("contact")}
              className={`transition-colors duration-200 cursor-pointer ${activeSection === "contact" ? "text-cyan-400 border-b-2 border-cyan-400/80 pb-1" : "text-slate-400 hover:text-white"}`}
            >
              Signal
            </a>
          </nav>
          
          <button 
            id="download-manifest-btn"
            onClick={downloadManifest}
            className="w-full md:w-auto px-5 py-2.5 bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 font-sans font-extrabold text-xs rounded-xl uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-300 hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
          >
            <LucideIcon name="Download" size={14} /> Download Manifest
          </button>
        </header>

        {/* HERO SECTION */}
        <section id="hero" className="min-h-[80vh] flex flex-col justify-center items-center py-10 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none">
            <span className="font-display font-black text-[22vw] leading-none text-white tracking-widest">AI & DS</span>
          </div>

          <div className="text-center max-w-4xl flex flex-col items-center gap-6 relative z-10">
            {/* Pulsating system tracker status */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="px-3.5 py-1.5 rounded-full bg-indigo-500/5 border border-indigo-500/20 text-indigo-400 text-xs font-mono tracking-widest flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              NEURAL INTERFERENCE LIVE // ONLINE
            </motion.div>

            {/* Glowing Main Display Title */}
            <h1 className="text-5xl md:text-8xl font-display font-black text-white leading-tight tracking-tighter">
              INTELLIGENT <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 select-all neon-text-blue filter drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                SOLUTIONS
              </span>
            </h1>

            {/* Tags and Tagline */}
            <p className="font-sans text-lg md:text-2xl text-slate-300 font-light max-w-2xl tracking-normal leading-relaxed">
              “Transforming Data into Intelligent Solutions”
            </p>

            <p className="font-mono text-xs text-slate-400 uppercase tracking-widest bg-slate-900/40 p-2.5 rounded-xl border border-white/5 backdrop-blur-md max-w-xl">
              Python // Machine Learning // Deep Neural Nets // Vision Systems
            </p>

            {/* Call To Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full sm:w-auto">
              <a 
                href="#chat-assistant-section"
                onClick={() => setIsChatOpen(true)}
                className="px-8 py-4 bg-white text-slate-950 font-sans font-bold rounded-xl uppercase tracking-wider cursor-pointer hover:bg-cyan-300 hover:text-slate-950 transition-all duration-300 shadow-[0_4px_24px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2.5"
              >
                <LucideIcon name="MessageSquare" size={16} /> Deploy AI Assistant
              </a>
              <a 
                href="#projects"
                className="px-8 py-4 bg-slate-900/60 border border-slate-700/50 hover:border-cyan-400/50 backdrop-blur-xl text-white font-sans font-bold rounded-xl uppercase tracking-wider cursor-pointer transition-all duration-300 flex items-center justify-center gap-2.5"
              >
                <LucideIcon name="Compass" size={16} /> Explore Forge Grid
              </a>
            </div>
          </div>

          {/* Interactive Stat Metrics Counter deck */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-16 max-w-5xl">
            {statsData.map((stat, sIdx) => (
              <motion.div 
                key={sIdx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: sIdx * 0.1 }}
                whileHover={{ scale: 1.02 }}
                id={`stat-box-${sIdx}`}
                className="bg-slate-900/40 backdrop-blur-md border border-slate-800/40 hover:border-indigo-500/20 p-5 rounded-2xl flex flex-col items-center text-center group transition-all duration-300"
              >
                <p className="text-3xl md:text-4xl font-display font-black text-white group-hover:text-cyan-400 transition-colors duration-300">
                  {stat.value}{stat.suffix}
                </p>
                <p className="text-xs text-slate-300 font-semibold uppercase tracking-wider mt-1">{stat.label}</p>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed font-sans">{stat.subtext}</p>
              </motion.div>
            ))}
          </div>

          <div className="absolute bottom-[-10px] w-full flex justify-center pointer-events-none">
            <motion.div 
              animate={{ y: [0, 8, 0] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-slate-500 text-xs font-mono uppercase tracking-widest flex flex-col items-center gap-1.5"
            >
              Scroll Context
              <span className="w-1 h-3 bg-cyan-400/30 rounded-full inline-block" />
            </motion.div>
          </div>
        </section>

        {/* BENTO LAYOUT ARCHITECTURE ROUTE (ABOUT ME, TECH STACK & SYSTEM CONTROLS) */}
        <section id="about" className="py-12 relative border-t border-slate-900">
          <div className="flex flex-col mb-10">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold">// MODULE 01 //</span>
            <h2 className="text-3xl font-display font-black text-white uppercase tracking-tight mt-1">Core Node & Profile</h2>
            <div className="h-[2px] w-16 bg-gradient-to-r from-cyan-400 to-indigo-500 mt-2" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* About Narrative Block */}
            <div className="lg:col-span-8 bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 md:p-8 flex flex-col justify-between overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-slate-600 uppercase tracking-widest">
                [USER_CONTEXT_STREAM]
              </div>

              <div className="space-y-4 max-w-4xl">
                <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                  // Bio // Dhanasekar Ratheesh
                </h3>
                <h4 className="text-2xl font-bold font-sans text-white leading-snug">
                  Engineering academic precision to fuel automation and algorithmic intelligence.
                </h4>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed font-sans">
                  {personalInfo.aboutText}
                </p>
                <p className="text-slate-400 text-sm leading-relaxed font-sans">
                  Studying in Dhanalakshmi Srinivasan Engineering College, my vision is to forge high-tech systems that utilize OpenCV filters, convolutional matrix structures, and prompt mechanics to solve real organizational blockages.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center">
                    <LucideIcon name="MapPin" size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-mono">Location Context</p>
                    <p className="text-sm font-semibold text-white">{personalInfo.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl flex items-center justify-center">
                    <LucideIcon name="GraduationCap" size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-mono">Affiliation Node</p>
                    <p className="text-xs font-semibold text-white truncate">{personalInfo.college}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats sidebar details */}
            <div className="lg:col-span-4 bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-mono text-purple-400 mb-4 uppercase tracking-widest">// Quick Telemetry</h3>
                <div className="space-y-4">
                  <div className="px-4 py-3.5 bg-slate-950/40 rounded-xl border border-slate-800/60">
                    <span className="text-[10px] text-slate-500 uppercase block font-mono">Degree Program</span>
                    <span className="text-sm font-bold text-white block mt-0.5">{personalInfo.degree}</span>
                    <span className="text-xs text-indigo-400 block mt-1">Class of 2023 - 2027</span>
                  </div>

                  <div className="px-4 py-3.5 bg-slate-950/40 rounded-xl border border-slate-800/60">
                    <span className="text-[10px] text-slate-500 uppercase block font-mono">Interests & Specializations</span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-400/10 border border-cyan-400/20 text-cyan-300">Generative AI</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-400/10 border border-purple-400/20 text-purple-300">Computer Vision</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-400/10 border border-pink-400/20 text-pink-300">Deep Learning</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-400/10 border border-indigo-400/20 text-indigo-300">Data Analytics</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 space-y-3">
                <p className="text-xs text-slate-400 font-mono tracking-wide uppercase">// Signal Links</p>
                <div className="flex gap-2">
                  <a 
                    href={`https://www.linkedin.com/in/${personalInfo.linkedin}`}
                    target="_blank" 
                    rel="noreferrer"
                    className="flex-1 h-10 bg-slate-950/80 hover:bg-indigo-500/20 hover:text-white border border-slate-800/80 rounded-xl flex items-center justify-center gap-2 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer"
                  >
                    <LucideIcon name="Linkedin" size={14} className="text-[#0a66c2]" /> LinkedIn
                  </a>
                  <a 
                    href={personalInfo.githubUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex-1 h-10 bg-slate-950/80 hover:bg-cyan-500/20 hover:text-white border border-slate-800/80 rounded-xl flex items-center justify-center gap-2 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer"
                  >
                    <LucideIcon name="Github" size={14} /> GitHub
                  </a>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ADVANCED TECHNOLOGIES SECTION */}
        <section className="py-12 relative border-t border-slate-900">
          <div className="flex flex-col mb-10 md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold">// MODULE 02 //</span>
              <h2 className="text-3xl font-display font-black text-white uppercase tracking-tight mt-1">Advanced Technologies</h2>
              <div className="h-[2px] w-16 bg-gradient-to-r from-cyan-400 to-indigo-500 mt-2" />
            </div>
            <p className="text-slate-400 text-sm max-w-md font-sans">
              Deploying high-latency multi-agent frameworks, vision segmentation arrays, and clean deep learning systems.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {technologiesData.map((tech, idx) => (
              <TechCard key={tech.title} tech={tech} index={idx} />
            ))}
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" className="py-12 relative border-t border-slate-900">
          <div className="flex flex-col mb-10 md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold">// MODULE 03 //</span>
              <h2 className="text-3xl font-display font-black text-white uppercase tracking-tight mt-1">Technical Skills Base</h2>
              <div className="h-[2px] w-16 bg-gradient-to-r from-cyan-400 to-indigo-500 mt-2" />
            </div>
            <p className="text-slate-400 text-sm max-w-md font-sans">
              Continuous model tracking and mathematical problem solving on structured datasets and prompts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {skillsList.map((skill, idx) => (
              <SkillCard key={skill.name} skill={skill} index={idx} />
            ))}
          </div>
        </section>

        {/* CHATBOT ASSISTANT DEDICATED WIDGET BLOCK */}
        <section id="chat-assistant-section" className="py-12 relative border-t border-slate-900">
          <div className="flex flex-col mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold">// INTERACTIVE ENGINE //</span>
            <h2 className="text-3xl font-display font-black text-white uppercase tracking-tight mt-1">Talk to Ratheesh's Bot</h2>
            <div className="h-[2px] w-16 bg-gradient-to-r from-cyan-400 to-indigo-500 mt-2" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Guide details panel */}
            <div className="lg:col-span-4 bg-slate-900/40 backdrop-blur-xl border border-slate-800/40 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400">
                    <LucideIcon name="Terminal" size={16} />
                  </div>
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Neural Link Guide</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Prompt Optimization</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-4">
                  The artificial dialogue framework processes your queries live using Gemini. Send a unique message, or click a pre-compiled telemetry prompt below to instantly probe Ratheesh's credentials.
                </p>

                <div className="space-y-2.5 mt-4">
                  <p className="text-[10px] text-indigo-400 font-mono tracking-wider uppercase">Pre-compiled Prompts:</p>
                  {[
                    "Who is D. Ratheesh and what does he study?",
                    "What projects did he build at college?",
                    "Detail his skills in Python & ML",
                    "How can I hire or contact Ratheesh?"
                  ].map((qn, qIdx) => (
                    <button
                      key={qIdx}
                      onClick={() => handleQuickQuestion(qn)}
                      className="w-full text-left p-2.5 rounded-xl bg-slate-950/60 hover:bg-indigo-500/10 border border-slate-800/50 hover:border-indigo-500/20 text-xs font-mono text-slate-300 hover:text-white transition-all duration-200 block truncate"
                    >
                      &gt; {qn}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shrink-0" />
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">
                  Model Context: Gemini-3.5-Flash-Latest
                </span>
              </div>
            </div>

            {/* Live Chat Frame */}
            <div className="lg:col-span-8 bg-slate-950/60 backdrop-blur-xl border border-slate-800/40 rounded-2xl flex flex-col h-[460px] overflow-hidden relative">
              
              {/* Chat frame header */}
              <div className="px-5 py-3.5 bg-slate-900/30 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                  </span>
                  <div>
                    <h4 className="text-xs font-mono tracking-wider uppercase text-white font-semibold">Active Assistant Shell</h4>
                    <p className="text-[9px] text-slate-500 font-mono">[Inference Mode / Active]</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-500/5 px-2 py-0.5 rounded border border-cyan-500/20">
                    UTC 2026-05-23
                  </span>
                </div>
              </div>

              {/* Chat Message Logs Area */}
              <div className="flex-grow overflow-y-auto p-5 space-y-4">
                {chatHistory.map((msg, mIdx) => (
                  <div 
                    key={msg.id}
                    className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wide">
                        {msg.role === "user" ? "Visitor / User" : "AI Guide"}
                      </span>
                      <span className="text-[9px] font-mono text-slate-600">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div 
                      className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed border ${
                        msg.role === "user" 
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500/30 rounded-tr-none" 
                          : "bg-slate-900/70 border-slate-8 w-full rounded-tl-none font-sans"
                      }`}
                    >
                      <p className="whitespace-pre-line text-slate-200">
                        {msg.text}
                      </p>
                      {msg.isFallback && (
                        <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap gap-2">
                          <a 
                            href="#education"
                            className="text-[10px] font-mono px-2 py-1 rounded bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 transition-colors"
                          >
                            Go to Education Timeline
                          </a>
                          <a 
                            href="#skills"
                            className="text-[10px] font-mono px-2 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-300 transition-colors"
                          >
                            Check Skills
                          </a>
                          <a 
                            href="#contact"
                            className="text-[10px] font-mono px-2 py-1 rounded bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 text-pink-300 transition-colors"
                          >
                            Go to Contact
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isChatLoading && (
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wide">AI Guide</span>
                      <span className="text-[9px] font-mono text-slate-600">Processing...</span>
                    </div>
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl py-3 px-4 flex items-center gap-3">
                      <div className="flex items-center gap-1 text-cyan-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">Running Inference</span>
                    </div>
                  </div>
                )}
                
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-4 bg-slate-900/30 border-t border-white/5 flex gap-2">
                <input
                  type="text"
                  placeholder="Query system pathways (e.g. B.Tech scores? List Skills?)..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendMessage();
                  }}
                  className="flex-1 bg-slate-950/80 hover:bg-slate-950 hover:border-slate-700 focus:border-cyan-500 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-sans text-slate-100 placeholder-slate-500 outline-none transition-colors"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!chatInput.trim() || isChatLoading}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:opacity-90 active:scale-95 disabled:opacity-45 text-slate-950 font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                >
                  <LucideIcon name="Send" size={14} /> Send
                </button>
              </div>

            </div>

          </div>
        </section>

        {/* PROJECTS FORGE SHOWCASE */}
        <section id="projects" className="py-12 relative border-t border-slate-900">
          <div className="flex flex-col mb-10 md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold">// MODULE 04 //</span>
              <h2 className="text-3xl font-display font-black text-white uppercase tracking-tight mt-1">Projects Forge</h2>
              <div className="h-[2px] w-16 bg-gradient-to-r from-cyan-400 to-indigo-500 mt-2" />
            </div>

            {/* Interactive Filters */}
            <div className="flex flex-wrap items-center gap-2 bg-slate-950/50 backdrop-blur-xl border border-slate-800/60 p-1.5 rounded-xl">
              {(["All", "AI", "Computer Vision", "Analytics"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedProjectCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    selectedProjectCategory === cat
                      ? "bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-extrabold shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, idx) => (
                <motion.div
                  key={project.title}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ y: -6 }}
                  id={`project-card-${project.title.replace(/\s+/g, '-').toLowerCase()}`}
                  className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/40 hover:border-indigo-500/30 rounded-2xl p-5 flex flex-col justify-between group relative overflow-hidden transition-all duration-300"
                >
                  {/* Glowing header accent line */}
                  <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div>
                    {/* Placeholder image representation */}
                    <div className="h-44 bg-slate-950 rounded-xl mb-4 relative overflow-hidden border border-slate-800 flex flex-col items-center justify-center p-3">
                      {/* Grid representation overlay inside the placeholder */}
                      <div className="absolute inset-0 cyber-grid opacity-30 group-hover:opacity-50 transition-opacity pointer-events-none" />
                      
                      {project.featured && (
                        <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/30 text-[8px] font-mono text-indigo-400 uppercase tracking-widest">
                          FEATURED
                        </span>
                      )}

                      <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800/80 text-cyan-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                          <LucideIcon name={project.iconName} size={20} />
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wide">NODE: {project.category.toUpperCase()}</span>
                      </div>
                    </div>

                    <h3 className="font-display font-medium text-lg text-white group-hover:text-cyan-400 transition-colors duration-200">
                      {project.title}
                    </h3>
                    
                    <p className="text-slate-400 text-xs mt-2 leading-relaxed min-h-[40px] font-sans">
                      {project.description}
                    </p>
                  </div>

                  {/* Badges and action buttons */}
                  <div className="mt-6 pt-4 border-t border-slate-800/50">
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.techStack.map(tech => (
                        <span 
                          key={tech} 
                          className="px-2 py-0.5 bg-slate-950 border border-slate-800/80 rounded-md text-[9px] font-mono text-slate-400"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="flex-1 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-slate-300 hover:text-white transition-all duration-200 cursor-pointer text-center flex items-center justify-center gap-1.5"
                      >
                        <LucideIcon name="Workflow" size={12} /> Tech Spec
                      </button>
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-slate-950/80 hover:bg-indigo-500/20 border border-slate-800 hover:border-indigo-500/30 text-slate-400 hover:text-white transition-colors duration-200"
                        title="GitHub Repository"
                      >
                        <LucideIcon name="Github" size={14} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* EDU TIMELINE & CERTIFICATIONS LINK (GRID LAYOUT) */}
        <section id="education" className="py-12 relative border-t border-slate-900">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Timeline UI Column */}
            <div className="lg:col-span-8">
              <div className="flex flex-col mb-8">
                <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold">// MODULE 05 //</span>
                <h2 className="text-3xl font-display font-black text-white uppercase tracking-tight mt-1">Education Timeline</h2>
                <div className="h-[2px] w-16 bg-gradient-to-r from-cyan-400 to-indigo-500 mt-2" />
              </div>

              {/* Vertical timeline tracking lines */}
              <div className="relative border-l-2 border-slate-800/80 ml-4 md:ml-6 space-y-8 py-2">
                {educationTimeline.map((edu, eIdx) => (
                  <motion.div 
                    key={edu.institution}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: eIdx * 0.1 }}
                    className="relative pl-8 md:pl-10 group"
                    id={`edu-item-${eIdx}`}
                  >
                    {/* Glowing timeline node dot */}
                    <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-slate-950 border-2 border-slate-700 group-hover:border-cyan-400 group-hover:shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-300 flex items-center justify-center select-none">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-cyan-400 transition-colors" />
                    </div>

                    <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 group-hover:border-slate-750/80 rounded-2xl p-5 transition-all duration-300">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                        <div>
                          <span className="font-mono text-xs text-cyan-400 block tracking-widest lowercase">
                            &lt;{edu.timeline}&gt;
                          </span>
                          <h3 className="font-display font-semibold text-lg text-white group-hover:text-cyan-400 transition-all duration-300">
                            {edu.institution}
                          </h3>
                        </div>
                        <span className="px-3 py-1 self-start md:self-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs font-mono text-indigo-300">
                          {edu.score}
                        </span>
                      </div>

                      <p className="text-sm font-sans font-medium text-slate-300 uppercase tracking-wide">
                        {edu.degree}
                      </p>
                      
                      <p className="text-slate-400 text-xs leading-relaxed mt-2.5 font-sans">
                        {edu.description}
                      </p>

                      <div className="flex items-center gap-2 mt-4 text-[10px] text-slate-500 font-mono">
                        <LucideIcon name="MapPin" size={10} className="text-slate-600" />
                        <span>{edu.location}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Certifications UI Column */}
            <div className="lg:col-span-4">
              <div className="flex flex-col mb-8">
                <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold">// MICRO-CREDENTIALS //</span>
                <h2 className="text-3xl font-display font-black text-white uppercase tracking-tight mt-1">Certifications</h2>
                <div className="h-[2px] w-16 bg-gradient-to-r from-cyan-400 to-indigo-500 mt-2" />
              </div>

              {certificationsList.map((cert) => (
                <motion.div
                  key={cert.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ y: -4 }}
                  className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/40 hover:border-purple-500/30 rounded-2xl p-5 relative overflow-hidden group transition-all duration-300"
                  id="python-certification-box"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                    <LucideIcon name="Award" size={72} className="text-purple-400" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-3.5 mb-3">
                      <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                        <LucideIcon name={cert.iconName} size={18} />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-purple-400 tracking-widest uppercase">{cert.issuer}</span>
                        <h3 className="font-display font-semibold text-base text-white group-hover:text-purple-300 transition-colors">
                          {cert.title}
                        </h3>
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-3.5 mt-4">
                      <p className="text-[10px] text-slate-500 uppercase font-mono tracking-widest mb-2">Acquired Capabilities:</p>
                      <ul className="space-y-1.5">
                        {cert.skillsAcquired.map((skill, sIdx) => (
                          <li key={sIdx} className="flex items-center gap-2 text-xs text-slate-400 font-sans">
                            <LucideIcon name="Check" size={10} className="text-purple-400 shrink-0" />
                            <span>{skill}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-5 text-[10px] font-mono text-slate-600 uppercase flex items-center justify-between">
                      <span>Verification: SECURE</span>
                      <span className="text-slate-400">&lt;ACTIVE LOG&gt;</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </section>

        {/* SECURE SIGNAL CONTAINER (CONTACT ME FORM) */}
        <section id="contact" className="py-12 relative border-t border-slate-900">
          <div className="flex flex-col mb-10">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold">// SECURE TRANSMISSION //</span>
            <h2 className="text-3xl font-display font-black text-white uppercase tracking-tight mt-1">Contact Signal Station</h2>
            <div className="h-[2px] w-16 bg-gradient-to-r from-cyan-400 to-indigo-500 mt-2" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Context Telemetry info card */}
            <div className="lg:col-span-5 bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 md:p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-mono text-cyan-400 mb-4 uppercase tracking-widest">// Direct Signal Parameters</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  Ready to coordinate on internships, technical development initiatives, or dataset modeling collaborations. Initiate a direct ping using the credentials or send an end-to-end signal on the registry.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-slate-950/40 rounded-xl border border-slate-800/60">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                      <LucideIcon name="Mail" size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-500 uppercase font-mono">Email Endpoint</p>
                      <a href={`mailto:${personalInfo.email}`} className="text-sm font-semibold text-white hover:text-cyan-400 transition-colors break-all">
                        {personalInfo.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3 bg-slate-950/40 rounded-xl border border-slate-800/60">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                      <LucideIcon name="Phone" size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-mono">Mobile Signal</p>
                      <a href={`tel:${personalInfo.phone}`} className="text-sm font-semibold text-white hover:text-indigo-400 transition-colors">
                        +91 {personalInfo.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3 bg-slate-950/40 rounded-xl border border-slate-800/60">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                      <LucideIcon name="MapPin" size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-mono">Geographic Coordinate</p>
                      <span className="text-sm font-semibold text-white">Erode, Tamil Nadu, India</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-4">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Download Full Resume</span>
                <button
                  onClick={downloadManifest} 
                  className="w-full py-3 hover:bg-white hover:text-slate-950 border border-dashed border-slate-700 hover:border-transparent rounded-xl flex items-center justify-center gap-2 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer"
                >
                  <LucideIcon name="Download" size={14} /> Download Developer Record
                </button>
              </div>
            </div>

            {/* Signal transmission form */}
            <div className="lg:col-span-7 bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 md:p-8">
              <h3 className="text-xs font-mono text-indigo-400 mb-6 uppercase tracking-widest">// Dispatch Secure Form</h3>
              
              {formSent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-2xl text-center space-y-4"
                  id="form-success-container"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <LucideIcon name="CheckCircle" size={28} />
                  </div>
                  <h4 className="text-lg font-bold text-white">Signal Successfully Transmitted!</h4>
                  <p className="text-slate-400 text-sm max-w-sm mx-auto">
                    Your contact telemetry packet has been logged. D. Ratheesh's AI node will process your message shortly. Excellent timing!
                  </p>
                  <button
                    onClick={() => setFormSent(false)}
                    className="text-xs font-mono uppercase bg-slate-950 hover:bg-slate-800 border border-slate-800 px-4 py-2 rounded-xl text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Send Another Signal
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4" id="portfolio-contact-form">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Origin Sender Name</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formState.name}
                        onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-slate-950/80 hover:bg-slate-950 hover:border-slate-700 focus:border-cyan-500 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Origin Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formState.email}
                        onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-slate-950/80 hover:bg-slate-950 hover:border-slate-700 focus:border-indigo-500 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Transmission Subject</label>
                    <input
                      type="text"
                      placeholder="Collaborative Inquiry / Internship Node"
                      value={formState.subject}
                      onChange={(e) => setFormState(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full bg-slate-950/80 hover:bg-slate-950 hover:border-slate-700 focus:border-purple-500 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Payload Information</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Compile your secure transmission here..."
                      value={formState.message}
                      onChange={(e) => setFormState(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full bg-slate-950/80 hover:bg-slate-950 hover:border-slate-700 focus:border-cyan-500 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sendingForm}
                    className="w-full py-3 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 hover:opacity-90 disabled:opacity-45 text-white font-sans font-bold text-xs rounded-xl uppercase tracking-wider shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all duration-300 hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {sendingForm ? (
                      <>
                        <LucideIcon name="Activity" className="animate-spin text-white" size={14} /> Transmitting Packet...
                      </>
                    ) : (
                      <>
                        <LucideIcon name="Send" size={14} className="text-white" /> Transmit Signal Packet
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>
        </section>

      </div>

      {/* FOOTER BAR */}
      <footer className="mt-16 bg-slate-950/80 border-t border-slate-900/60 py-8 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="uppercase tracking-widest text-[10px]">
              System Status: Optimal // Core Nodes Sync Completed
            </span>
          </div>

          <div className="text-center">
            <p className="text-slate-400 font-sans">
              D. Ratheesh © {new Date().getFullYear()} — B.Tech Artificial Intelligence & Data Science
            </p>
          </div>

          <div className="flex gap-4 font-mono select-none">
            <span className="text-cyan-400/80">41° 24' 12.2" N</span>
            <span className="text-purple-400/80">76% INFERENCE_RATE</span>
            <span className="text-slate-600">v2.1.2-LATEST</span>
          </div>
        </div>
      </footer>

      {/* DETAILED PROJECT SPECIFICATIONS MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop blur clickoff */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ duration: 0.3 }}
              id="selected-project-modal"
              className="relative w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(99,102,241,0.2)] overflow-hidden z-10"
            >
              {/* Abs decoration light stream */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600" />

              {/* Close Button cursor feedback */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-400 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <LucideIcon name="X" size={16} />
              </button>

              <div className="flex items-center gap-3.5 mb-5 mt-1">
                <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/20">
                  <LucideIcon name={selectedProject.iconName} size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                    Project Blueprint // {selectedProject.category}
                  </span>
                  <h3 className="font-display font-extrabold text-2xl text-white">
                    {selectedProject.title}
                  </h3>
                </div>
              </div>

              {/* Content Description */}
              <div className="space-y-5 font-sans mt-2">
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  {selectedProject.detailedDescription || selectedProject.description}
                </p>

                {/* Simulated Interactive Architecture Specs */}
                <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl mt-4">
                  <h4 className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider mb-2">Technical Flow Hierarchy</h4>
                  
                  <div className="flex flex-col md:flex-row items-center justify-between gap-1 text-[11px] font-mono text-slate-400 uppercase mt-1">
                    <span className="px-3 py-1 bg-slate-950 border border-slate-850 rounded">RAW INFERENCE DATA</span>
                    <LucideIcon name="ChevronRight" size={14} className="text-indigo-500 hidden md:inline shrink-0" />
                    <span className="px-3 py-1 bg-indigo-500/5 text-cyan-400 border border-indigo-500/20 rounded">OPENCV MATRIX FILTER</span>
                    <LucideIcon name="ChevronRight" size={14} className="text-indigo-500 hidden md:inline shrink-0" />
                    <span className="px-3 py-1 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded">PREDICTION OUTLET</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block w-full mb-1">Target Engine Tech:</span>
                  {selectedProject.techStack.map(tech => (
                    <span 
                      key={tech}
                      className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions inside Modal */}
              <div className="mt-8 pt-5 border-t border-slate-900 flex justify-end gap-3 font-sans">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-5 py-2 hover:bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel spec
                </button>
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2 bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-sans font-bold text-xs rounded-xl uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-1.5"
                >
                  <LucideIcon name="Github" size={12} /> Access Repository
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOAT CHAT LAUNCHER WIDGET BUTTON (FIXED CORNER) */}
      <div 
        onClick={() => {
          setIsChatOpen(!isChatOpen);
          // Auto scroll on first load
          setTimeout(() => {
            if (chatBottomRef.current) chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-tr from-cyan-400 to-indigo-500 rounded-full flex items-center justify-center shadow-[0_4px_25px_rgba(6,182,212,0.4)] cursor-pointer z-40 transition-all duration-300 hover:scale-110 active:scale-95 group"
        title="Interactive AI Assistant"
        id="floating-ai-launcher"
      >
        <div className="relative">
          <LucideIcon name={isChatOpen ? "X" : "MessageCircle"} className="text-slate-950 group-hover:rotate-12 transition-transform duration-300" size={24} />
          <span className="absolute top-[-4px] right-[-4px] flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
        </div>
      </div>

    </div>
  );
}
