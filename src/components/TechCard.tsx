import { motion } from "motion/react";
import { AdvancedTechnology } from "../types";
import { LucideIcon } from "./LucideIcon";

interface TechCardProps {
  key?: string | number;
  tech: AdvancedTechnology;
  index: number;
}

export function TechCard({ tech, index }: TechCardProps) {
  // Map color strings to active Tailwind boundaries
  const colorMap = {
    cyan: {
      shadow: "hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]",
      border: "hover:border-cyan-500/50",
      text: "text-cyan-400",
      bg: "bg-cyan-500/10",
      glow: "from-cyan-500/10 to-transparent",
    },
    purple: {
      shadow: "hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]",
      border: "hover:border-purple-500/50",
      text: "text-purple-400",
      bg: "bg-purple-500/10",
      glow: "from-purple-500/10 to-transparent",
    },
    indigo: {
      shadow: "hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]",
      border: "hover:border-indigo-500/50",
      text: "text-indigo-400",
      bg: "bg-indigo-500/10",
      glow: "from-indigo-500/10 to-transparent",
    },
    pink: {
      shadow: "hover:shadow-[0_0_20px_rgba(236,72,153,0.15)]",
      border: "hover:border-pink-500/50",
      text: "text-pink-400",
      bg: "bg-pink-500/10",
      glow: "from-pink-500/10 to-transparent",
    },
  };

  const currentStyle = colorMap[tech.glowColor] || colorMap.indigo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -6, scale: 1.01 }}
      id={`tech-card-${tech.title.replace(/\s+/g, '-').toLowerCase()}`}
      className={`relative group bg-[#0d0f22]/60 backdrop-blur-md rounded-xl border border-white/5 p-6 transition-all duration-300 ${currentStyle.shadow} ${currentStyle.border}`}
    >
      {/* Animated Glowing Accent */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentStyle.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none`} />

      <div className="relative z-10 flex flex-col h-full">
        {/* Header Icon block */}
        <div className="flex items-center gap-4 mb-4">
          <div className={`p-3 rounded-lg ${currentStyle.bg} ${currentStyle.text} group-hover:scale-110 transition-transform duration-300`}>
            <LucideIcon name={tech.iconName} className="w-6 h-6" />
          </div>
          <h3 className="font-display font-medium text-lg text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all duration-300">
            {tech.title}
          </h3>
        </div>

        {/* Description body */}
        <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow font-sans">
          {tech.description}
        </p>

        {/* Feature Points list */}
        <div className="border-t border-white/5 pt-4">
          <ul className="space-y-2">
            {tech.features.map((feature, fIdx) => (
              <li key={fIdx} className="flex items-center gap-2 text-xs font-mono text-gray-500 group-hover:text-gray-300 transition-colors duration-300">
                <span className={`w-1.5 h-1.5 rounded-full ${tech.glowColor === "cyan" ? "bg-cyan-500" : tech.glowColor === "purple" ? "bg-purple-500" : "bg-indigo-500"}`} />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
