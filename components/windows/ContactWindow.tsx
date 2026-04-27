"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, MessageSquare } from "lucide-react";
import { SOCIALS } from "@/lib/data";
import DraggableWindow from "./DraggableWindow";

const ICON_MAP: Record<string, React.ReactNode> = {
  Github:        <Github size={24} />,
  Linkedin:      <Linkedin size={24} />,
  Mail:          <Mail size={24} />,
  MessageSquare: <MessageSquare size={24} />,
};

interface Props { zIndex: number; onFocus: () => void; initialX?: number; initialY?: number; }

export default function ContactWindow({ zIndex, onFocus, initialX, initialY }: Props) {
  return (
    <DraggableWindow title="contact.exe" zIndex={zIndex} onFocus={onFocus} initialX={initialX} initialY={initialY} className="w-[320px]" delay={0.2}>
      <p
        className="tracking-[2px] mb-3 text-[var(--text)]"
        style={{ fontFamily: "'Press Start 2P'", fontSize: 7 }}
      >
        CONTATO & REDES
      </p>
      <div className="grid grid-cols-2 gap-2">
        {SOCIALS.map((s, i) => (
          <motion.a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.08 * i }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="b-out bg-[var(--stat-bg)] p-3 flex flex-col items-center gap-2 hover:bg-[#b8b8a4] active:b-in transition-colors"
            style={{ textDecoration: "none" }}
          >
            <div className="b-in bg-[var(--win-bg)] w-12 h-12 flex items-center justify-center text-[var(--accent)]">
              {ICON_MAP[s.icon]}
            </div>
            <p style={{ fontFamily: "'Press Start 2P'", fontSize: 6 }} className="text-[var(--text)] tracking-wider">{s.label}</p>
          </motion.a>
        ))}
      </div>
    </DraggableWindow>
  );
}
