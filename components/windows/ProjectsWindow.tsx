"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { PROJECTS } from "@/lib/data";
import DraggableWindow from "./DraggableWindow";

interface Props { zIndex: number; onFocus: () => void; initialX?: number; initialY?: number; }

export default function ProjectsWindow({ zIndex, onFocus, initialX, initialY }: Props) {
  return (
    <DraggableWindow title="projects.exe" zIndex={zIndex} onFocus={onFocus} initialX={initialX} initialY={initialY} className="w-[680px]" delay={0.15}>
      <p
        className="tracking-[3px] border-b-[3px] border-[var(--accent)] pb-1 inline-block mb-3"
        style={{ fontFamily: "'Press Start 2P'", fontSize: 9 }}
      >
        PROJETOS
      </p>

      <div className="grid grid-cols-3 gap-3">
        {PROJECTS.map((p, i) => (
          <motion.a
            key={p.name}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08, type: "spring", stiffness: 260, damping: 22 }}
            whileHover={{ y: -3, transition: { duration: 0.15 } }}
            className="bg-[var(--card)] border-2 border-[var(--accent)] relative overflow-visible block no-underline group"
            style={{ textDecoration: "none" }}
          >
            {/* EXE tag top-left */}
            <div
              className="absolute -top-[11px] left-2 bg-[var(--card)] border-2 border-[var(--accent)] px-1.5 py-0.5"
              style={{ fontFamily: "'Press Start 2P'", fontSize: 6, color: "var(--accent)", letterSpacing: 2 }}
            >
              EXE
            </div>

            {/* Thumb */}
            <div className="w-full h-28 bg-gradient-to-br from-[#0d1b4e] to-[#1a0d2e] flex items-center justify-center text-4xl relative overflow-hidden">
              <span className="z-10">{p.emoji}</span>
              {/* Animated grid lines */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: "linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              {/* Status badge */}
              <div
                className="absolute top-2 right-2 px-1.5 py-0.5"
                style={{
                  fontFamily: "'Press Start 2P'",
                  fontSize: 5,
                  background: p.status === "LIVE" ? "#145a32" : "#7d6608",
                  color: p.status === "LIVE" ? "#2ecc71" : "#f1c40f",
                  border: `1px solid ${p.status === "LIVE" ? "#2ecc71" : "#f1c40f"}`,
                }}
              >
                {p.status}
              </div>
              {/* Date */}
              <div
                className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-[rgba(0,0,0,0.7)] text-[var(--accent)]"
                style={{ fontFamily: "'Share Tech Mono'", fontSize: 9 }}
              >
                {p.date}
              </div>
            </div>

            {/* Info */}
            <div className="p-2.5">
              <div className="flex items-start justify-between gap-1 mb-1.5">
                <p
                  className="text-white leading-tight"
                  style={{ fontFamily: "'Press Start 2P'", fontSize: 7, letterSpacing: "0.05em" }}
                >
                  {p.name.replace(".exe", "")}
                </p>
                <ExternalLink size={10} className="text-[var(--accent)] flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p
                className="text-[#aaa] leading-snug mb-2"
                style={{ fontFamily: "'Share Tech Mono'", fontSize: 10 }}
              >
                {p.desc}
              </p>
              <div className="flex flex-wrap gap-1">
                {p.stack.map((t) => (
                  <span
                    key={t}
                    className="bg-[#1a1a3e] text-[#88aaff] px-1.5 py-0.5"
                    style={{ fontFamily: "'Share Tech Mono'", fontSize: 9, border: "1px solid #2a2a6e" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-right px-2 py-1 border-t border-[#222] text-[var(--accent)]" style={{ fontFamily: "'Press Start 2P'", fontSize: 6 }}>
              EXE
            </div>
          </motion.a>
        ))}
      </div>
    </DraggableWindow>
  );
}
