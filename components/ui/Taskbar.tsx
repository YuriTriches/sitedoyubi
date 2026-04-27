"use client";

import { useEffect, useState } from "react";
import { Terminal, Code2, FolderOpen, User } from "lucide-react";

const TABS = [
  { icon: User,       label: "profile.exe" },
  { icon: Code2,      label: "skills.exe" },
  { icon: FolderOpen, label: "projects.exe" },
  { icon: Terminal,   label: "contact.exe" },
];

export default function Taskbar() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      setTime(`${h}:${m}`);
      setDate(now.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 h-9 z-[9999] flex items-center px-2 gap-1.5"
      style={{
        background: "var(--win-bg)",
        borderTop: "2px solid var(--win-light)",
        boxShadow: "inset 0 2px 0 var(--win-light), inset 0 -1px 0 var(--win-dark)",
      }}
    >
      {/* Start */}
      <button
        className="b-out bg-[var(--stat-bg)] px-3 py-1 flex items-center gap-1.5 hover:bg-[#b8b8a4] active:b-in font-bold"
        style={{ fontFamily: "'Press Start 2P'", fontSize: 7 }}
      >
        <span>⊞</span> START
      </button>

      <div className="w-px h-6 bg-[var(--win-dark)] mx-1" />

      {/* Window tabs */}
      {TABS.map(({ icon: Icon, label }) => (
        <button
          key={label}
          className="b-out bg-[var(--stat-bg)] px-2 py-1 flex items-center gap-1.5 hover:bg-[#b8b8a4] active:b-in"
          style={{ fontFamily: "'Share Tech Mono'", fontSize: 11 }}
        >
          <Icon size={11} />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}

      {/* Clock */}
      <div className="ml-auto flex items-center gap-1.5">
        <div
          className="b-in bg-[var(--stat-bg)] px-2.5 py-1 text-center"
          style={{ fontFamily: "'Share Tech Mono'", fontSize: 12 }}
        >
          {date} {time}
        </div>
      </div>
    </div>
  );
}
