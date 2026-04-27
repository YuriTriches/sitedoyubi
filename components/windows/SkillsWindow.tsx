"use client";

import { motion } from "framer-motion";
import { SKILLS } from "@/lib/data";
import DraggableWindow from "./DraggableWindow";

interface Props { zIndex: number; onFocus: () => void; initialX?: number; initialY?: number; }

export default function SkillsWindow({ zIndex, onFocus, initialX, initialY }: Props) {
  return (
    <DraggableWindow title="skills.exe" zIndex={zIndex} onFocus={onFocus} initialX={initialX} initialY={initialY} className="w-[360px]" delay={0.1}>
      <div className="grid grid-cols-2 gap-2">
        {SKILLS.map((group, gi) => (
          <div key={group.category} className="b-in bg-[var(--stat-bg)] p-2">
            <p
              style={{ fontFamily: "'Press Start 2P'", fontSize: 6, color: "var(--accent)" }}
              className="tracking-widest mb-2 pb-1 border-b border-[var(--win-dark)]"
            >
              {group.category}
            </p>
            <div className="flex flex-col gap-1">
              {group.items.map((item, ii) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + gi * 0.08 + ii * 0.04 }}
                  className="flex items-center gap-1.5"
                >
                  <span className="text-[var(--accent)]" style={{ fontFamily: "'Share Tech Mono'", fontSize: 9 }}>›</span>
                  <span style={{ fontFamily: "'Share Tech Mono'", fontSize: 11 }} className="text-[var(--text)]">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DraggableWindow>
  );
}
