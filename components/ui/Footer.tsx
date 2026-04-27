"use client";

import { motion } from "framer-motion";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2 }}
      className="relative z-10 mb-9 mt-8 mx-4"
    >
      <div
        className="win p-4 text-center"
        style={{ borderTop: "3px solid var(--accent)" }}
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="h-px flex-1 bg-[var(--win-dark)]" />
          <p style={{ fontFamily: "'Press Start 2P'", fontSize: 7 }} className="text-[var(--accent)] tracking-widest">
            YURI_TRICHES.EXE
          </p>
          <div className="h-px flex-1 bg-[var(--win-dark)]" />
        </div>
        <p style={{ fontFamily: "'Share Tech Mono'", fontSize: 11 }} className="text-[#666]">
          © {year} Yuri Triches — Fullstack Developer
        </p>
        <p style={{ fontFamily: "'Share Tech Mono'", fontSize: 10 }} className="text-[#888] mt-1">
          Built with Next.js · TypeScript · Framer Motion
        </p>
        <div className="mt-2 flex items-center justify-center gap-2">
          <motion.div
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-2 h-3 bg-[var(--accent)]"
          />
          <span style={{ fontFamily: "'Share Tech Mono'", fontSize: 10 }} className="text-[#555]">
            ready for new challenges_
          </span>
        </div>
      </div>
    </motion.footer>
  );
}
