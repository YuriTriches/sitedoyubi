"use client";

import { motion } from "framer-motion";
import { MapPin, Mail } from "lucide-react";
import { PROFILE } from "@/lib/data";
import DraggableWindow from "./DraggableWindow";

function StatBox({ label, value, mod, tip }: { label: string; value: number; mod: string; tip: string }) {
  return (
    <motion.div
      className="b-in bg-[var(--stat-bg)] p-2 text-center group relative"
      whileHover={{ scale: 1.04 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      <div
        className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#1a1a6e] text-white px-2 py-0.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
        style={{ fontFamily: "'Share Tech Mono'", fontSize: 9 }}
      >
        {tip}
      </div>
      <p style={{ fontFamily: "'Press Start 2P'", fontSize: 6 }} className="text-[#666] tracking-widest mb-1">{label}</p>
      <p style={{ fontFamily: "'Press Start 2P'", fontSize: 16 }} className="text-[var(--text)] mb-0.5">{value}</p>
      <p style={{ fontFamily: "'VT323'", fontSize: 14 }} className="text-[var(--accent2)]">{mod}</p>
    </motion.div>
  );
}

interface Props { zIndex: number; onFocus: () => void; initialX?: number; initialY?: number; }

export default function ProfileWindow({ zIndex, onFocus, initialX, initialY }: Props) {
  return (
    <DraggableWindow title="profile.exe" zIndex={zIndex} onFocus={onFocus} initialX={initialX} initialY={initialY} className="w-[340px]" delay={0.05}>
      {/* Avatar + Name */}
      <div className="flex gap-3 mb-3">
        <div className="b-in w-[108px] h-[108px] flex-shrink-0 overflow-hidden bg-gradient-to-br from-[#0d1b4e] to-[#1a3a8e] flex items-center justify-center relative">
          <span className="text-5xl">👨‍💻</span>
          <div
            className="absolute bottom-0 left-0 right-0 py-0.5 text-center"
            style={{ background: "rgba(0,0,64,0.7)", fontFamily: "'Press Start 2P'", fontSize: 5, color: "#88aaff" }}
          >
            DEV_MODE
          </div>
        </div>
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <p style={{ fontFamily: "'Press Start 2P'", fontSize: 11 }} className="text-[var(--text)] leading-tight tracking-wide">
            {PROFILE.name}
          </p>
          <p style={{ fontFamily: "'VT323'", fontSize: 17 }} className="text-[var(--accent2)] tracking-[2px]">
            {PROFILE.title}
          </p>
          <p style={{ fontFamily: "'Share Tech Mono'", fontSize: 10 }} className="text-[#666] leading-snug">
            {PROFILE.role}
          </p>
          <div className="b-in bg-[var(--stat-bg)] px-2 py-1 flex items-center gap-1.5 mt-auto">
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-emerald-400"
              style={{ boxShadow: "0 0 6px #2ecc71" }}
            />
            <span style={{ fontFamily: "'Press Start 2P'", fontSize: 6 }} className="text-[var(--text)]">DISPONÍVEL</span>
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="flex gap-2 mb-3">
        <div className="b-in bg-[var(--stat-bg)] px-2 py-1 flex items-center gap-1 flex-1">
          <MapPin size={9} className="text-[var(--accent)]" />
          <span style={{ fontFamily: "'Share Tech Mono'", fontSize: 10 }} className="text-[var(--text)]">{PROFILE.location}</span>
        </div>
        <div className="b-in bg-[var(--stat-bg)] px-2 py-1 flex items-center gap-1 flex-1">
          <Mail size={9} className="text-[var(--accent)]" />
          <span style={{ fontFamily: "'Share Tech Mono'", fontSize: 9 }} className="text-[var(--text)] truncate">{PROFILE.email}</span>
        </div>
      </div>

      <div className="border-t-2 border-[var(--win-dark)] border-b border-b-[var(--win-light)] my-2" />

      {/* Level + Stats */}
      <div className="flex gap-2 mb-2">
        <div className="b-in bg-[var(--stat-bg)] p-2 text-center flex-1">
          <p style={{ fontFamily: "'Press Start 2P'", fontSize: 6 }} className="text-[#666] tracking-widest mb-1">LEVEL</p>
          <p style={{ fontFamily: "'Press Start 2P'", fontSize: 22 }} className="text-[var(--text)]">{PROFILE.level}</p>
        </div>
        <div className="grid grid-cols-4 gap-1 flex-[3]">
          {PROFILE.stats.map((s) => <StatBox key={s.label} {...s} />)}
        </div>
      </div>

      {/* HP / SP bars */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <div className="flex justify-between mb-1">
            <span style={{ fontFamily: "'Press Start 2P'", fontSize: 5 }} className="text-[#666]">HP</span>
            <span style={{ fontFamily: "'Press Start 2P'", fontSize: 5 }} className="text-[var(--text)]">{PROFILE.hp}</span>
          </div>
          <div className="b-in h-3 bg-[#1a1a1a] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${PROFILE.hp}%` }}
              transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-pink-400 to-red-500"
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span style={{ fontFamily: "'Press Start 2P'", fontSize: 5 }} className="text-[#666]">SP</span>
            <span style={{ fontFamily: "'Press Start 2P'", fontSize: 5 }} className="text-[var(--text)]">{PROFILE.sp}</span>
          </div>
          <div className="b-in h-3 bg-[#1a1a1a] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${PROFILE.sp}%` }}
              transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-blue-300 to-indigo-500"
            />
          </div>
        </div>
      </div>
    </DraggableWindow>
  );
}
