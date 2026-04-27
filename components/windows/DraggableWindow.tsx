"use client";

import { useState, ReactNode } from "react";
import { motion, useDragControls, AnimatePresence } from "framer-motion";
import { Minus, Square, X } from "lucide-react";
import clsx from "clsx";

interface Props {
  title: string;
  children: ReactNode;
  initialX?: number;
  initialY?: number;
  zIndex?: number;
  onFocus?: () => void;
  className?: string;
  delay?: number;
}

export default function DraggableWindow({
  title, children,
  initialX = 40, initialY = 40,
  zIndex = 10, onFocus,
  className, delay = 0,
}: Props) {
  const controls = useDragControls();
  const [isDragging, setIsDragging] = useState(false);
  const [minimized, setMinimized] = useState(false);

  return (
    <motion.div
      drag
      dragControls={controls}
      dragMomentum={false}
      dragListener={false}
      dragElastic={0}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      onPointerDown={onFocus}
      initial={{ x: initialX, y: initialY, opacity: 0, scale: 0.96 }}
      animate={{
        opacity: 1,
        scale: 1,
        boxShadow: isDragging
          ? "0 28px 60px rgba(0,0,0,0.9), 0 4px 12px rgba(0,0,0,0.6)"
          : "0 8px 40px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.4)",
      }}
      transition={{ type: "spring", stiffness: 280, damping: 24, delay }}
      style={{ zIndex, position: "absolute", touchAction: "none" }}
      className={clsx("win", className)}
    >
      {/* Title bar */}
      <div
        className="win-titlebar"
        onPointerDown={(e) => { e.preventDefault(); controls.start(e); }}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
        title="Arraste para mover"
      >
        <span
          className="text-white select-none"
          style={{ fontFamily: "'Press Start 2P'", fontSize: 7, letterSpacing: "0.08em" }}
        >
          {title}
        </span>
        <div className="flex gap-1">
          <button
            className="win-btn"
            onClick={() => setMinimized(!minimized)}
            title={minimized ? "Restaurar" : "Minimizar"}
          >
            <Minus size={7} />
          </button>
          <button className="win-btn" title="Maximizar"><Square size={7} /></button>
          <button className="win-btn" title="Fechar"><X size={7} /></button>
        </div>
      </div>

      {/* Content with collapse animation */}
      <AnimatePresence initial={false}>
        {!minimized && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="p-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
