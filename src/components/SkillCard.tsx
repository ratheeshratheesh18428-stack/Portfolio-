import { motion } from "motion/react";
import { Skill } from "../types";
import { LucideIcon } from "./LucideIcon";

interface SkillCardProps {
  key?: string | number;
  skill: Skill;
  index: number;
}

export function SkillCard({ skill, index }: SkillCardProps) {
  // Determine gradient color depending on category
  const colors = {
    Languages: {
      bar: "bg-gradient-to-r from-cyan-400 to-blue-500",
      text: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5",
    },
    "Core AI & ML": {
      bar: "bg-gradient-to-r from-purple-400 to-indigo-500",
      text: "text-purple-400 border-purple-500/20 bg-purple-500/5",
    },
    "Web & Others": {
      bar: "bg-gradient-to-r from-blue-400 to-indigo-500",
      text: "text-indigo-400 border-indigo-500/20 bg-indigo-500/5",
    },
    "Engineering Soft Skills": {
      bar: "bg-gradient-to-r from-pink-400 to-rose-500",
      text: "text-pink-400 border-pink-500/20 bg-pink-500/5",
    }
  };

  const currentCategory = colors[skill.category] || colors.Languages;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="p-5 bg-[#090b16]/80 rounded-xl border border-white/5 shadow-2xl relative hover:border-white/10 group overflow-hidden transition-all duration-300"
      id={`skill-${skill.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
    >
      {/* Light scanner sweep */}
      <div className="absolute inset-0 w-[400%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg border ${currentCategory.text}`}>
              <LucideIcon name={skill.iconName} className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-sans font-semibold text-white group-hover:text-cyan-400 transition-colors duration-300">
                {skill.name}
              </h4>
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                {skill.category}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="font-mono text-xs text-gray-400 group-hover:neon-text-blue transition-all duration-300">
              {skill.level}%
            </span>
          </div>
        </div>

        {/* Level Track Bar */}
        <div className="w-full h-1.5 bg-[#121324] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${skill.level}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 + index * 0.05, ease: "easeOut" }}
            className={`h-full rounded-full ${currentCategory.bar} relative`}
          >
            {/* Pulsating glowing point */}
            <div className="absolute right-0 top-0 h-full w-2 bg-white blur-sm opacity-80" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
