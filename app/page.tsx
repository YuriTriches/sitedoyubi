"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
const WIN_IDS = ["profile", "skills", "projects", "contact", "music", "now"] as const;
type WinId = (typeof WIN_IDS)[number];

interface WinState {
  x: number; y: number;
  w: number;
  minimized: boolean;
  maximized: boolean;
  prevX: number; prevY: number; prevW: number;
}

/* ─────────────────────────────────────────────
   HOOK — viewport
───────────────────────────────────────────── */
function useViewport() {
  const [vp, setVp] = useState({ w: 1280, h: 720 });
  useEffect(() => {
    const update = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return vp;
}

/* ─────────────────────────────────────────────
   BOOT SCREEN
───────────────────────────────────────────── */
function BootScreen({ onDone }: { onDone(): void }) {
  const [line, setLine] = useState(0);
  const [progress, setProgress] = useState(0);
  const lines = [
    "PORTFOLIO OS v2.0 — Loading...",
    "Initializing RAM... OK",
    "Loading assets... OK",
    "Starting window manager... OK",
    "Mounting projects partition... OK",
    "> System ready.",
  ];
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i++;
      setLine(i);
      setProgress(Math.min(100, Math.round((i / lines.length) * 100)));
      if (i >= lines.length) {
        clearInterval(t);
        setTimeout(onDone, 700);
      }
    }, 320);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="boot-screen">
      <div className="boot-inner">
        <div className="boot-logo">PORTFOLIO<span>.EXE</span></div>
        <div className="boot-lines">
          {lines.slice(0, line).map((l, i) => <div key={i} className="boot-line">{l}</div>)}
          {line < lines.length && <span className="boot-cursor">_</span>}
        </div>
        <div className="boot-bar-wrap">
          <div className="boot-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="boot-pct">{progress}%</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   START MENU
───────────────────────────────────────────── */
function StartMenu({ onOpen, onClose }: { onOpen(id: WinId): void; onClose(): void }) {
  return (
    <div className="startmenu" onMouseLeave={onClose}>
      <div className="startmenu-side">
        <span className="startmenu-brand">PORTFOLIO<br />OS</span>
      </div>
      <div className="startmenu-items">
        {WIN_IDS.map(id => (
          <button key={id} className="startmenu-item" onClick={() => { onOpen(id); onClose(); }}>
            <span className="startmenu-ico">{CFG[id].icon}</span>
            <span>{CFG[id].title}.exe</span>
          </button>
        ))}
        <div className="startmenu-divider" />
        <button className="startmenu-item startmenu-item-red" onClick={onClose}>
          <span className="startmenu-ico">⏻</span>
          <span>Shut Down</span>
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   WIN98 WINDOW
───────────────────────────────────────────── */
interface WinProps {
  id: WinId; title: string; icon: string;
  zIndex: number; state: WinState; isFocused: boolean;
  onFocus(): void;
  onMove(id: WinId, x: number, y: number): void;
  onMinimize(id: WinId): void;
  onMaximize(id: WinId): void;
  onRestore(id: WinId): void;
  children: React.ReactNode;
  animDelay?: number;
}

function Win98Window({
  id, title, icon, zIndex, state, isFocused,
  onFocus, onMove, onMinimize, onMaximize, onRestore,
  children, animDelay = 0,
}: WinProps) {
  const drag = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), animDelay);
    return () => clearTimeout(t);
  }, [animDelay]);

  const onTitleDown = useCallback((e: React.MouseEvent) => {
    if (state.maximized || (e.target as HTMLElement).closest(".wctrl")) return;
    onFocus();
    drag.current = { sx: e.clientX, sy: e.clientY, ox: state.x, oy: state.y };
    const mv = (ev: MouseEvent) => {
      if (!drag.current) return;
      onMove(id, drag.current.ox + ev.clientX - drag.current.sx,
                  drag.current.oy + ev.clientY - drag.current.sy);
    };
    const up = () => { drag.current = null; window.removeEventListener("mousemove", mv); window.removeEventListener("mouseup", up); };
    window.addEventListener("mousemove", mv);
    window.addEventListener("mouseup", up);
    e.preventDefault();
  }, [state, id, onFocus, onMove]);

  if (state.minimized) return null;

  const fixed = state.maximized;
  const style: React.CSSProperties = fixed
    ? { position: "fixed", inset: 0, width: "100dvw", height: "calc(100dvh - 44px)", zIndex: 9000 }
    : { position: "absolute", left: state.x, top: state.y, width: state.w, zIndex };

  return (
    <div
      className="w98win"
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1) translateY(0px)" : "scale(0.88) translateY(20px)",
        transition: `opacity .22s ease ${animDelay}ms, transform .28s cubic-bezier(.34,1.5,.64,1) ${animDelay}ms`,
      }}
      onMouseDown={onFocus}
    >
      {/* ── Title bar ── */}
      <div className={`w98title ${isFocused ? "focused" : "blurred"}`} onMouseDown={onTitleDown}>
        <div className="w98title-left">
          <span className="w98title-ico">{icon}</span>
          <span className="w98title-txt">{title}.exe</span>
        </div>
        <div className="w98title-ctrls">
          <button className="wctrl w98btn w98min" onClick={e => { e.stopPropagation(); onMinimize(id); }} title="Minimizar"><span>_</span></button>
          <button className="wctrl w98btn w98max" onClick={e => { e.stopPropagation(); state.maximized ? onRestore(id) : onMaximize(id); }} title={state.maximized ? "Restaurar" : "Maximizar"}><span>{state.maximized ? "❐" : "□"}</span></button>
          <button className="wctrl w98btn w98cls" onClick={e => { e.stopPropagation(); onMinimize(id); }} title="Fechar"><span>✕</span></button>
        </div>
      </div>

      {/* ── Menu bar ── */}
      <div className="w98menu">
        {["Arquivo","Editar","Exibir","Ajuda"].map(m => <span key={m} className="w98menu-item">{m}</span>)}
      </div>

      {/* ── Body ── */}
      <div className="w98body">{children}</div>

      {/* ── Status bar ── */}
      <div className="w98status">
        <span className="w98status-cell">Pronto</span>
        <span className="w98status-cell">{new Date().toLocaleDateString("pt-BR")}</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CONTENTS
───────────────────────────────────────────── */
function ProfileContent() {
  return (
    <div className="c-profile">
      <div className="c-profile-left">
        <div className="photo-frame">
          <Image src="/images/eus.PNG" alt="Foto de perfil" width={120} height={145} className="photo-img" priority />
          <div className="photo-cap">eu.PNG</div>
        </div>
        <div className="stat-grid">
          {[["LEVEL","23"],["XP","9999"]].map(([l,v]) => (
            <div key={l} className="stat-cell">
              <div className="stat-l">{l}</div>
              <div className="stat-v">{v}</div>
            </div>
          ))}
          <div className="stat-cell stat-cell-online">
            <div className="stat-l">STATUS</div>
            <div className="stat-v green"><span className="blink-dot">●</span> ONLINE</div>
          </div>
        </div>
      </div>
      <div className="c-profile-right">
        <div className="p-eyebrow">// DESENVOLVEDOR</div>
        <div className="p-name">Yuri Triches</div>
        <div className="p-role">FULL-STACK DEVELOPER</div>
        <div className="p-sep" />

        {/* RPG Stats — inspired by Grifo */}
        <div className="rpg-stats">
          {[["STR","Força de Código","12","+3"],["DEX","Velocidade de Ship","14","+2"],["INT","Arquitetura","20","+8"],["LCK","Bugs em Prod","5","-4"]].map(([s,n,v,b]) => (
            <div key={s} className="rpg-stat">
              <div className="rpg-stat-top">
                <span className="rpg-stat-abbr">{s}</span>
                <span className="rpg-stat-name">{n}</span>
              </div>
              <div className="rpg-stat-val">{v}</div>
              <div className={`rpg-stat-bonus ${b.startsWith("-") ? "neg" : "pos"}`}>{b}</div>
            </div>
          ))}
        </div>

        <p className="p-bio">
          Construo Websites e Softwares e faço musica.
        </p>
        <div className="p-links">
          <a href="https://github.com"   target="_blank" rel="noreferrer" className="p-btn">GitHub</a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-btn">LinkedIn</a>
          <a href="/resume.pdf"          target="_blank" rel="noreferrer" className="p-btn p-btn-primary">Currículo ↗</a>
        </div>
      </div>
    </div>
  );
}

function SkillsContent() {
  const groups = [
    { cat: "STR — Frontend", items: ["React","Next.js","TypeScript","Tailwind CSS","Framer Motion"] },
    { cat: "INT — Backend",  items: ["Node.js","Python","PostgreSQL","Redis","Docker"] },
    { cat: "DEX — Ferramentas", items: ["Git","Figma","Vercel","AWS","Linux"] },
  ];
  const bars = [
    { label: "Frontend", pct: 80, color: "#1535c8" },
    { label: "Backend",  pct: 90, color: "#1535c8" },
    { label: "Design",   pct: 68, color: "#1535c8" },
    { label: "DevOps",   pct: 68, color: "#1535c8" },
  ];
  return (
    <div className="c-skills">
      {groups.map(g => (
        <div key={g.cat} className="sk-group">
          <div className="sk-cat">{g.cat}</div>
          <div className="sk-tags">
            {g.items.map(i => <span key={i} className="sk-tag">{i}</span>)}
          </div>
        </div>
      ))}
      <div className="sk-bars">
        <div className="sk-cat" style={{marginBottom:"8px"}}>// PROFICIÊNCIA</div>
        {bars.map(b => (
          <div key={b.label} className="sk-bar-row">
            <span className="sk-bar-label">{b.label}</span>
            <div className="sk-bar-track">
              <div className="sk-bar-fill" style={{ width: `${b.pct}%`, background: b.color }} />
            </div>
            <span className="sk-bar-pct">{b.pct}%</span>
          </div>
        ))}
      </div>
      <div className="sk-bar-wrap">
        <div className="sk-bar-label-total">OVERALL RATING</div>
        <div className="sk-bar-track sk-bar-track-main"><div className="sk-bar-fill-main" /></div>
        <div className="sk-bar-sub">88 / 100 pts</div>
      </div>
    </div>
  );
}

function ProjectsContent() {
  const projects = [
    { n:"Project", d:"Em Breve.", s:["Next.js","PostgreSQL","Stripe"], href:"#", status:"LIVE" },
    { n:"Project",  d:"Em Breve.",           s:["Node.js","TypeScript"],        href:"#", status:"LIVE" },
    { n:"Project", d:"Em Breve.",    s:["React","Shopify"],             href:"#", status:"WIP"  },
    { n:"Project", d:"Em Breve.",            s:["Python","FastAPI","LLM"],      href:"#", status:"LIVE" },
  ];
  return (
    <div className="c-projects">
      {projects.map((p, i) => (
        <a key={p.n} href={p.href} className="pj-card" target="_blank" rel="noreferrer">
          <div>
            <div className="pj-top">
              <span className="pj-num">{String(i+1).padStart(2,"0")}</span>
              <span className="pj-name">{p.n}</span>
              <span className={`pj-status ${p.status === "WIP" ? "wip" : ""}`}>{p.status}</span>
              <span className="pj-arrow">↗</span>
            </div>
            <p className="pj-desc">{p.d}</p>
            <div className="pj-tags">{p.s.map(t => <span key={t} className="pj-tag">{t}</span>)}</div>
          </div>
        </a>
      ))}
    </div>
  );
}

function ContactContent() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name:"", email:"", msg:"" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="c-contact">
      {sent ? (
        <div className="ct-success">
          <div>
            <div className="ct-ok-icon">✓</div>
            <div className="ct-ok-title">MENSAGEM ENVIADA!</div>
            <div className="ct-ok-sub">Responderei o mais breve possível.</div>
          </div>
        </div>
      ) : (
        <>
          <div className="ct-intro">&gt; Nova mensagem para: <strong>yuritriches66@gmail.com</strong></div>
          {(["name","email","msg"] as const).map(k => (
            <div key={k} className="ct-field">
              <label className="ct-label">{k === "name" ? "NOME:" : k === "email" ? "EMAIL:" : "MENSAGEM:"}</label>
              {k === "msg"
                ? <textarea className="ct-input ct-ta" placeholder="Descreva seu projeto ou oportunidade…" rows={4} value={form.msg} onChange={set("msg")} />
                : <input className="ct-input" type={k === "email" ? "email" : "text"} placeholder={k === "name" ? "Seu nome completo" : "voce@exemplo.com"} value={form[k]} onChange={set(k)} />
              }
            </div>
          ))}
          <div className="ct-links">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="ct-social">GitHub ↗</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="ct-social">LinkedIn ↗</a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="ct-social">Twitter ↗</a>
          </div>
          <div className="ct-foot">
            <button className="ct-btn" onClick={() => setSent(true)}>[ ENVIAR MENSAGEM ]</button>
          </div>
        </>
      )}
    </div>
  );
}

function MusicContent() {
  const [playing, setPlaying] = useState<number|null>(null);
  const tracks = [
    { t:"Lofi Study Session", a:"Playlist Pessoal", d:"2:34:00", genre:"Lo-fi" },
    { t:"Synthwave Drive",     a:"Playlist Pessoal", d:"1:12:00", genre:"Synth" },
    { t:"Tokyo Rain",          a:"Playlist Pessoal", d:"0:58:00", genre:"City Pop" },
    { t:"OST Mode",            a:"Game Soundtracks", d:"3:01:00", genre:"Game" },
    { t:"Deep Focus",          a:"Playlist Pessoal", d:"2:00:00", genre:"Ambient" },
  ];
  return (
    <div className="c-music">
      <div className="music-player">
        <div className="music-display">
          <div className="music-title">{playing !== null ? tracks[playing].t : "— PARADO —"}</div>
          <div className="music-artist">{playing !== null ? tracks[playing].a : "Selecione uma faixa"}</div>
          <div className="music-eq">
            {Array.from({length:12}).map((_,i) => (
              <div key={i} className={`music-bar ${playing !== null ? "active" : ""}`} style={{ animationDelay:`${i*80}ms`, height:`${8+Math.random()*18}px` }} />
            ))}
          </div>
        </div>
        <div className="music-controls">
          <button className="music-btn" onClick={() => setPlaying(p => p !== null ? Math.max(0,p-1) : 0)}>⏮</button>
          <button className="music-btn music-btn-play" onClick={() => setPlaying(p => p !== null ? null : 0)}>{playing !== null ? "⏸" : "▶"}</button>
          <button className="music-btn" onClick={() => setPlaying(p => p !== null ? Math.min(tracks.length-1,p+1) : 0)}>⏭</button>
        </div>
      </div>
      <div className="music-list">
        {tracks.map((tr, i) => (
          <div key={i} className={`music-track ${playing === i ? "active" : ""}`} onClick={() => setPlaying(i)}>
            <span className="music-num">{String(i+1).padStart(2,"0")}</span>
            <div className="music-info">
              <span className="music-name">{tr.t}</span>
              <span className="music-genre">{tr.genre}</span>
            </div>
            <span className="music-dur">{tr.d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function NowContent() {
  const items = [
    { emoji:"💻", label:"Trabalhando em", val:"Projeto secreto (em breve)" },
    { emoji:"📚", label:"Aprendendo",     val:"Rust & WebAssembly" },
    { emoji:"🎮", label:"Jogando",        val:"Outer Wilds (pela 3ª vez)" },
    { emoji:"🎵", label:"Ouvindo",        val:"City Pop, Lo-fi" },
    { emoji:"📍", label:"Localização",   val:"Brasil" },
    { emoji:"☕", label:"Café hoje",      val:"3 xícaras (normal)" },
  ];
  const log = [
    { date:"Abr 2026", ev:"Lançamento do portfolio v2" },
    { date:"Mar 2026", ev:"Contribuição open-source aceita" },
    { date:"Fev 2026", ev:"Project Alpha em produção" },
    { date:"Jan 2026", ev:"Novo cliente: fintech startup" },
  ];
  return (
    <div className="c-now">
      <div className="now-header">// O QUE ESTOU FAZENDO AGORA</div>
      <div className="now-items">
        {items.map(it => (
          <div key={it.label} className="now-item">
            <span className="now-emoji">{it.emoji}</span>
            <div>
              <div className="now-label">{it.label}</div>
              <div className="now-val">{it.val}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="now-log-title">// LOG RECENTE</div>
      {log.map(l => (
        <div key={l.date} className="now-log-row">
          <span className="now-log-date">{l.date}</span>
          <span className="now-log-ev">{l.ev}</span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   DESKTOP ICONS
───────────────────────────────────────────── */
const ICON_LIST: { id: WinId; icon: string; label: string }[] = [
  { id:"profile",  icon:"👤", label:"profile.exe"  },
  { id:"skills",   icon:"⚙️", label:"skills.exe"   },
  { id:"projects", icon:"📁", label:"projects.exe" },
  { id:"contact",  icon:"✉️", label:"contact.exe"  },
  { id:"music",    icon:"🎵", label:"music.exe"    },
  { id:"now",      icon:"📌", label:"now.exe"      },
];
function DesktopIcons({ onOpen, openWindows }: { onOpen(id:WinId):void; openWindows: Set<WinId> }) {
  const [selected, setSelected] = useState<WinId|null>(null);

  return (
    <div className="desk-icons" onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
      {ICON_LIST.map((ic,i) => (
        <div
          key={ic.id}
          className={`desk-ico ${selected === ic.id ? "selected" : ""} ${openWindows.has(ic.id) ? "open" : ""}`}
          style={{ animationDelay:`${i*90}ms` }}
          onClick={e => { e.stopPropagation(); setSelected(ic.id); }}
          onDoubleClick={e => { e.stopPropagation(); setSelected(null); onOpen(ic.id); }}
        >
          <div className="desk-ico-img">{ic.icon}</div>
          <div className="desk-ico-lbl">{ic.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   MOBILE NAV
───────────────────────────────────────────── */
function MobileNav({ active, onSelect }: { active: WinId; onSelect(id:WinId):void }) {
  return (
    <div className="mob-nav">
      {ICON_LIST.map(ic => (
        <button key={ic.id} className={`mob-nav-btn ${active === ic.id ? "active" : ""}`} onClick={() => onSelect(ic.id)}>
          <span className="mob-nav-ico">{ic.icon}</span>
          <span className="mob-nav-lbl">{ic.label.replace(".exe","")}</span>
        </button>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   TASKBAR
───────────────────────────────────────────── */
function Taskbar({ items, onToggle, time, onStartClick }: {
  items: { id:WinId; label:string; icon:string; minimized:boolean; active:boolean }[];
  onToggle(id:WinId):void;
  time:string;
  onStartClick():void;
}) {
  return (
    <div className="taskbar">
      <button className="tb-start" onClick={onStartClick}><span>⊞</span><span className="tb-start-txt">Start</span></button>
      <div className="tb-divider" />
      <div className="tb-apps">
        {items.map(it => (
          <button key={it.id} className={`tb-app ${it.active?"active":""} ${it.minimized?"minimized":""}`} onClick={() => onToggle(it.id)}>
            <span className="tb-app-ico">{it.icon}</span>
            <span className="tb-app-lbl">{it.label}.exe</span>
          </button>
        ))}
      </div>
      <div className="tb-clock-box"><span className="tb-clock">{time}</span></div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   WINDOW CONFIG
───────────────────────────────────────────── */
const CFG: Record<WinId,{ title:string; icon:string; w:number; x:number; y:number; delay:number }> = {
  profile:  { title:"profile",  icon:"👤", w:520, x:24,  y:30,  delay:60  },
  skills:   { title:"skills",   icon:"⚙️", w:340, x:560, y:30,  delay:180 },
  contact:  { title:"contact",  icon:"✉️", w:340, x:560, y:340, delay:300 },
  projects: { title:"projects", icon:"📁", w:500, x:24,  y:370, delay:420 },
  music:    { title:"music",    icon:"🎵", w:320, x:920, y:30,  delay:540 },
  now:      { title:"now",      icon:"📌", w:320, x:920, y:280, delay:660 },
};

const CONTENTS: Record<WinId, React.ReactNode> = {
  profile:  <ProfileContent />,
  skills:   <SkillsContent />,
  projects: <ProjectsContent />,
  contact:  <ContactContent />,
  music:    <MusicContent />,
  now:      <NowContent />,
};

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default function Page() {
  const vp = useViewport();
  const isMobile = vp.w < 700;
  const [booted, setBooted] = useState(false);
  const [startOpen, setStartOpen] = useState(false);

  const [order, setOrder] = useState<WinId[]>([...WIN_IDS]);
  const [states, setStates] = useState<Record<WinId,WinState>>(() =>
    Object.fromEntries(WIN_IDS.map(id => [id, {
      x: CFG[id].x, y: CFG[id].y, w: CFG[id].w,
      minimized: false, maximized: false,
      prevX: CFG[id].x, prevY: CFG[id].y, prevW: CFG[id].w,
    }])) as Record<WinId,WinState>
  );

  const [mobileActive, setMobileActive] = useState<WinId>("profile");
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}));
    tick(); const t = setInterval(tick, 30000); return () => clearInterval(t);
  }, []);

  const focus = useCallback((id: WinId) => setOrder(p => [...p.filter(w => w !== id), id]), []);
  const z = (id: WinId) => 10 + order.indexOf(id);
  const focused = order[order.length - 1];

  const move = useCallback((id: WinId, x: number, y: number) => {
    setStates(p => ({ ...p, [id]: { ...p[id], x: Math.max(0,x), y: Math.max(0,y) } }));
  }, []);

  const minimize = useCallback((id: WinId) =>
    setStates(p => ({ ...p, [id]: { ...p[id], minimized:true, maximized:false } })), []);

  const maximize = useCallback((id: WinId) => {
    focus(id);
    setStates(p => ({ ...p, [id]: { ...p[id], prevX:p[id].x, prevY:p[id].y, prevW:p[id].w, maximized:true, minimized:false } }));
  }, [focus]);

  const restore = useCallback((id: WinId) => {
    focus(id);
    setStates(p => ({ ...p, [id]: { ...p[id], x:p[id].prevX, y:p[id].prevY, w:p[id].prevW, maximized:false, minimized:false } }));
  }, [focus]);

  const toggle = useCallback((id: WinId) => {
    if (states[id].minimized) restore(id);
    else if (focused === id) minimize(id);
    else focus(id);
  }, [states, focused, restore, minimize, focus]);

  const tbItems = WIN_IDS.map(id => ({ id, label:CFG[id].title, icon:CFG[id].icon, minimized:states[id].minimized, active:!states[id].minimized && focused === id }));

  if (!booted) return (
    <>
      <style>{css}</style>
      <BootScreen onDone={() => setBooted(true)} />
    </>
  );

  /* ── Mobile ── */
  if (isMobile) {
    return (
      <>
        <style>{css}</style>
        <div className="mob-root">
          <div className="mob-header">
            <span className="mob-title">portfolio.exe</span>
            <span className="mob-clock">{time}</span>
          </div>
          <div className="mob-win">
            <div className="w98title focused">
              <div className="w98title-left">
                <span className="w98title-ico">{CFG[mobileActive].icon}</span>
                <span className="w98title-txt">{CFG[mobileActive].title}.exe</span>
              </div>
              <div className="w98title-ctrls">
                <button className="w98btn w98max" onClick={() => {}}><span>□</span></button>
              </div>
            </div>
            <div className="w98menu">
              {["Arquivo","Editar","Exibir","Ajuda"].map(m => <span key={m} className="w98menu-item">{m}</span>)}
            </div>
            <div className="w98body mob-body">{CONTENTS[mobileActive]}</div>
            <div className="w98status">
              <span className="w98status-cell">Pronto</span>
              <span className="w98status-cell">{new Date().toLocaleDateString("pt-BR")}</span>
            </div>
          </div>
          <MobileNav active={mobileActive} onSelect={setMobileActive} />
        </div>
      </>
    );
  }

  /* ── Desktop ── */
  return (
    <>
      <style>{css}</style>
      <div className="desk-root" onClick={() => startOpen && setStartOpen(false)}>
        <div className="desk-noise" />
        <div className="desk-scanlines" />
        <DesktopIcons onOpen={id => { restore(id); focus(id); }} openWindows={new Set(WIN_IDS.filter(id => !states[id].minimized))} />
        {startOpen && <StartMenu onOpen={id => { restore(id); focus(id); }} onClose={() => setStartOpen(false)} />}
        <div className="desk-canvas">
          {WIN_IDS.map(id => (
            <Win98Window
              key={id} id={id} title={CFG[id].title} icon={CFG[id].icon}
              zIndex={z(id)} state={states[id]} isFocused={focused === id}
              onFocus={() => focus(id)} onMove={move}
              onMinimize={minimize} onMaximize={maximize} onRestore={restore}
              animDelay={CFG[id].delay}
            >
              {CONTENTS[id]}
            </Win98Window>
          ))}
        </div>
        <Taskbar items={tbItems} onToggle={toggle} time={time} onStartClick={() => setStartOpen(v => !v)} />
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   CSS
───────────────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Share+Tech+Mono&family=VT323&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --bg:          #111118;
  --bg2:         #18181f;
  --win-face:    #d8d3c4;
  --win-inner:   #f2f0e8;   /* brighter inner for easier reading */
  --title-a1:    #1535c8;
  --title-a2:    #2a5cd6;
  --title-blur:  #6b6b7a;
  --bevel-lt:    #f4f0e4;
  --bevel-dk:    #3a3830;
  --bevel-md:    #7a776a;
  --text:        #0e0c08;   /* darker text = more contrast */
  --text-muted:  #4a4438;   /* darker muted = still readable */
  --accent:      #1535c8;
  --accent-lite: #2a5cd6;
  --green:       #005500;
  --red:         #cc0000;
  --taskbar-h:   44px;
  --font-px:     'Press Start 2P', monospace;
  --font-mn:     'Share Tech Mono', monospace;
  --font-vt:     'VT323', monospace;
}

html{
  cursor:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 22 22'%3E%3Cpolygon points='3,1 3,18 7,14 10,20 12,19 9,13 15,13' fill='white' stroke='%23111' stroke-width='1.5' stroke-linejoin='round'/%3E%3C/svg%3E") 3 1,auto
}
button,a,[class*="desk-ico"],[class*="tb-"],[class*="mob-nav-btn"]{
  cursor:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 22 22'%3E%3Cpolygon points='3,1 3,18 7,14 10,20 12,19 9,13 15,13' fill='%23f5e050' stroke='%23111' stroke-width='1.5' stroke-linejoin='round'/%3E%3C/svg%3E") 3 1,pointer
}

html,body{height:100%;overflow:hidden;font-family:var(--font-mn);background:var(--bg)}

/* ═══ BOOT SCREEN ═══ */
.boot-screen{
  position:fixed;inset:0;background:#000;z-index:99999;
  display:flex;align-items:center;justify-content:center;
}
.boot-inner{width:480px;padding:32px}
.boot-logo{
  font-family:var(--font-px);font-size:20px;color:#fff;margin-bottom:28px;
  letter-spacing:.04em;
}
.boot-logo span{color:var(--accent-lite)}
.boot-lines{font-family:var(--font-mn);font-size:13px;color:#00cc44;margin-bottom:24px;min-height:120px;line-height:2}
.boot-line{animation:boot-fade .18s ease}
@keyframes boot-fade{from{opacity:0}to{opacity:1}}
.boot-cursor{display:inline-block;color:#00cc44;font-family:var(--font-mn);font-size:13px;animation:blink .6s step-end infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
.boot-bar-wrap{height:16px;background:#1a1a1a;border:2px inset #444;overflow:hidden;margin-bottom:8px}
.boot-bar-fill{height:100%;background:linear-gradient(90deg,#0a1888,var(--accent-lite));transition:width .3s ease}
.boot-pct{font-family:var(--font-mn);font-size:11px;color:#666;text-align:right}

/* ═══ DESKTOP ROOT ═══ */
.desk-root{
  position:fixed;inset:0;
  background:radial-gradient(ellipse 90% 80% at 20% 60%, #181d3a 0%, var(--bg) 65%);
  overflow:hidden;display:flex;flex-direction:column;
}
.desk-noise{
  position:absolute;inset:0;pointer-events:none;z-index:1;opacity:.45;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.08'/%3E%3C/svg%3E");
  background-repeat:repeat;background-size:180px 180px;
  mix-blend-mode:overlay;
}
.desk-scanlines{
  position:absolute;inset:0;pointer-events:none;z-index:2;
  background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.06) 2px,rgba(0,0,0,.06) 4px);
}

/* ═══ DESKTOP ICONS ═══ */
.desk-icons{
  position:absolute;top:14px;right:14px;z-index:5;
  display:flex;flex-direction:column;gap:8px;pointer-events:all;
}
.desk-ico{
  display:flex;flex-direction:column;align-items:center;gap:3px;
  width:70px;padding:5px 3px;border-radius:1px;
  opacity:0;animation:ico-in .35s ease forwards;
  transition:background .1s;
}
.desk-ico:hover{background:rgba(30,60,200,.35);outline:1px dotted rgba(255,255,255,.55)}
.desk-ico.selected{background:rgba(30,60,200,.55);outline:1px dotted rgba(255,255,255,.9)}
.desk-ico.open .desk-ico-lbl{text-decoration:underline}
@keyframes ico-in{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
.desk-ico-img{font-size:26px;filter:drop-shadow(1px 2px 0 rgba(0,0,0,.7))}
.desk-ico-lbl{
  font-family:var(--font-mn);font-size:9.5px;color:#fff;text-align:center;
  text-shadow:1px 1px 3px #000,-1px -1px 2px #000;line-height:1.3;word-break:break-all;
}

.desk-canvas{position:absolute;inset:0;bottom:var(--taskbar-h);z-index:10}

/* ═══ START MENU ═══ */
.startmenu{
  position:fixed;bottom:var(--taskbar-h);left:0;z-index:9998;
  display:flex;
  border:2px solid;border-color:var(--bevel-lt) var(--bevel-dk) var(--bevel-dk) var(--bevel-lt);
  box-shadow:3px 3px 0 var(--bevel-dk);
  background:var(--win-face);
  min-width:200px;
  animation:menu-in .12s cubic-bezier(.34,1.5,.64,1);
}
@keyframes menu-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.startmenu-side{
  width:28px;background:linear-gradient(180deg,var(--title-a1),var(--title-a2));
  display:flex;align-items:flex-end;justify-content:center;padding-bottom:8px;
  writing-mode:vertical-rl;transform:rotate(180deg);
}
.startmenu-brand{
  font-family:var(--font-px);font-size:8px;color:#fff;letter-spacing:.08em;
  text-align:center;
}
.startmenu-items{display:flex;flex-direction:column;flex:1;padding:2px}
.startmenu-item{
  display:flex;align-items:center;gap:8px;padding:5px 10px;
  font-family:var(--font-mn);font-size:12px;color:var(--text);
  background:transparent;border:none;text-align:left;width:100%;
  transition:background .08s;
}
.startmenu-item:hover{background:var(--accent);color:#fff}
.startmenu-ico{font-size:15px;flex-shrink:0}
.startmenu-divider{height:1px;background:var(--bevel-dk);margin:3px 6px}
.startmenu-item-red:hover{background:var(--red)}

/* ═══ WIN98 WINDOW ═══ */
.w98win{
  display:flex;flex-direction:column;min-width:220px;
  background:var(--win-face);
  border:2px solid;
  border-color:var(--bevel-lt) var(--bevel-dk) var(--bevel-dk) var(--bevel-lt);
  box-shadow:2px 2px 0 var(--bevel-dk),inset -1px -1px 0 var(--bevel-md);
  will-change:transform,opacity;
}
.w98title{
  height:26px;display:flex;align-items:center;
  padding:2px 3px 2px 4px;user-select:none;flex-shrink:0;
}
.w98title.focused{background:linear-gradient(90deg,var(--title-a1),var(--title-a2))}
.w98title.blurred{background:var(--title-blur)}
.w98title-left{display:flex;align-items:center;gap:4px;flex:1;overflow:hidden}
.w98title-ico{font-size:13px;flex-shrink:0}
.w98title-txt{
  font-family:var(--font-mn);font-size:12px;font-weight:700;color:#fff;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:.01em;
}
.w98title-ctrls{display:flex;gap:2px;align-items:center}
.w98btn{
  width:18px;height:18px;padding:0;line-height:1;font-size:9px;font-weight:700;
  color:var(--text);background:var(--win-face);
  border:1.5px solid;border-color:var(--bevel-lt) var(--bevel-dk) var(--bevel-dk) var(--bevel-lt);
  display:grid;place-items:center;transition:filter .08s;flex-shrink:0;
}
.w98btn:hover{filter:brightness(1.15)}
.w98btn:active{border-color:var(--bevel-dk) var(--bevel-lt) var(--bevel-lt) var(--bevel-dk);transform:translate(1px,1px)}
.w98cls:hover{background:#d40000;color:#fff}

.w98menu{
  display:flex;align-items:center;padding:0 2px;flex-shrink:0;
  background:var(--win-face);border-bottom:1px solid var(--bevel-md);
}
.w98menu-item{
  font-family:var(--font-mn);font-size:11px;padding:2px 8px;
  transition:background .1s;
}
.w98menu-item:hover{background:var(--accent);color:#fff}

.w98body{
  flex:1;overflow-y:auto;overflow-x:hidden;
  background:var(--win-inner);
  border:2px inset var(--bevel-md);
  margin:3px;padding:16px;
  scrollbar-width:thin;scrollbar-color:var(--bevel-md) transparent;
  max-height:calc(100dvh - var(--taskbar-h) - 80px);
  font-size:13px;
  line-height:1.6;
}

.w98status{
  display:flex;justify-content:space-between;align-items:center;
  padding:2px 5px;flex-shrink:0;border-top:1px solid var(--bevel-md);
}
.w98status-cell{
  font-family:var(--font-mn);font-size:10px;color:var(--text-muted);
  border:1px inset var(--bevel-md);padding:0 5px;
}

/* ═══ PROFILE CONTENT ═══ */
.c-profile{display:flex;gap:16px;align-items:flex-start}
.c-profile-left{display:flex;flex-direction:column;gap:8px;flex-shrink:0}
.photo-frame{
  border:3px solid;border-color:var(--bevel-dk) var(--bevel-lt) var(--bevel-lt) var(--bevel-dk);
  background:var(--win-face);padding:4px;
}
.photo-img{display:block;image-rendering:auto}
.photo-cap{font-family:var(--font-mn);font-size:10px;color:var(--text-muted);text-align:center;margin-top:3px}
.stat-grid{display:flex;flex-direction:column;gap:5px}
.stat-cell{
  border:2px solid;border-color:var(--bevel-dk) var(--bevel-lt) var(--bevel-lt) var(--bevel-dk);
  background:var(--win-face);padding:4px 8px;text-align:center;min-width:130px;
}
.stat-l{font-family:var(--font-px);font-size:7px;color:var(--text-muted);margin-bottom:2px;letter-spacing:.04em}
.stat-v{font-family:var(--font-px);font-size:10px;color:var(--text)}
.stat-v.green{color:var(--green);font-size:9px}
.blink-dot{animation:blink .9s step-end infinite}

.c-profile-right{flex:1;display:flex;flex-direction:column;gap:8px;min-width:0}
.p-eyebrow{font-family:var(--font-mn);font-size:11px;color:var(--text-muted)}
.p-name{font-family:var(--font-px);font-size:15px;color:var(--text);line-height:1.5;letter-spacing:-.01em}
.p-role{font-family:var(--font-mn);font-size:12px;color:var(--accent);letter-spacing:.06em;font-weight:700}
.p-sep{height:1px;background:linear-gradient(90deg,var(--bevel-md),transparent);margin:2px 0}

/* RPG stats */
.rpg-stats{display:grid;grid-template-columns:1fr 1fr;gap:5px}
.rpg-stat{
  border:2px solid;border-color:var(--bevel-lt) var(--bevel-dk) var(--bevel-dk) var(--bevel-lt);
  background:var(--win-face);padding:5px 7px;
}
.rpg-stat-top{display:flex;align-items:center;gap:5px;margin-bottom:2px}
.rpg-stat-abbr{font-family:var(--font-px);font-size:7px;color:var(--accent)}
.rpg-stat-name{font-family:var(--font-mn);font-size:10px;color:var(--text-muted)}
.rpg-stat-val{font-family:var(--font-px);font-size:15px;color:var(--text);margin-bottom:2px}
.rpg-stat-bonus{font-family:var(--font-mn);font-size:11px;font-weight:700}
.rpg-stat-bonus.pos{color:var(--green)}
.rpg-stat-bonus.neg{color:var(--red)}

.p-bio{font-family:var(--font-mn);font-size:13px;color:var(--text);line-height:1.8}
.p-links{display:flex;gap:6px;flex-wrap:wrap;margin-top:2px}
.p-btn{
  font-family:var(--font-mn);font-size:12px;padding:4px 11px;
  text-decoration:none;color:var(--text);background:var(--win-face);
  border:2px solid;border-color:var(--bevel-lt) var(--bevel-dk) var(--bevel-dk) var(--bevel-lt);
  transition:background .1s;
}
.p-btn:hover{background:#c0bcac}
.p-btn:active{border-color:var(--bevel-dk) var(--bevel-lt) var(--bevel-lt) var(--bevel-dk);transform:translate(1px,1px)}
.p-btn-primary{background:var(--accent);color:#fff;border-color:var(--accent-lite) var(--title-a1) var(--title-a1) var(--accent-lite)}
.p-btn-primary:hover{background:var(--accent-lite)}

/* ═══ SKILLS CONTENT ═══ */
.c-skills{display:flex;flex-direction:column;gap:11px}
.sk-group{border:1px solid #c8c4b4;padding:8px 10px;background:var(--win-face)}
.sk-cat{font-family:var(--font-px);font-size:7.5px;color:var(--accent);margin-bottom:7px}
.sk-tags{display:flex;flex-wrap:wrap;gap:5px}
.sk-tag{
  font-family:var(--font-mn);font-size:12px;padding:3px 10px;
  background:var(--win-inner);color:var(--text);
  border:2px solid;border-color:var(--bevel-lt) var(--bevel-dk) var(--bevel-dk) var(--bevel-lt);
  transition:background .1s;
}
.sk-tag:hover{background:var(--win-face)}

.sk-bars{border:1px solid #c8c4b4;padding:8px 10px;background:var(--win-face);display:flex;flex-direction:column;gap:7px}
.sk-bar-row{display:flex;align-items:center;gap:7px}
.sk-bar-label{font-family:var(--font-px);font-size:7px;color:var(--text);min-width:68px}
.sk-bar-track{flex:1;height:13px;background:#9e9a8c;border:2px inset var(--bevel-md);overflow:hidden}
.sk-bar-fill{height:100%;background:linear-gradient(90deg,#0a1888,var(--accent-lite));transition:width 1.2s ease .3s}
.sk-bar-pct{font-family:var(--font-mn);font-size:11px;color:var(--text-muted);min-width:35px;text-align:right}

.sk-bar-wrap{margin-top:4px}
.sk-bar-label-total{font-family:var(--font-px);font-size:7px;color:var(--text-muted);margin-bottom:5px}
.sk-bar-track-main{height:16px;background:#9e9a8c;border:2px inset var(--bevel-md);overflow:hidden}
.sk-bar-fill-main{
  height:100%;width:0;
  background:linear-gradient(90deg,#0a1888,var(--accent-lite));
  animation:bar-grow 1.4s cubic-bezier(.4,0,.2,1) .5s forwards;
}
@keyframes bar-grow{from{width:0}to{width:82%}}
.sk-bar-sub{font-family:var(--font-mn);font-size:10px;color:var(--text-muted);text-align:right;margin-top:3px}

/* ═══ PROJECTS CONTENT ═══ */
.c-projects{display:flex;flex-direction:column;gap:7px}
.pj-card{text-decoration:none;color:inherit;display:block}
.pj-card>div{
  padding:9px 11px;background:var(--win-face);
  border:2px solid;border-color:var(--bevel-lt) var(--bevel-dk) var(--bevel-dk) var(--bevel-lt);
  transition:background .12s;
}
.pj-card:hover>div{background:#c4c0b0}
.pj-card:active>div{border-color:var(--bevel-dk) var(--bevel-lt) var(--bevel-lt) var(--bevel-dk);transform:translate(1px,1px)}
.pj-top{display:flex;align-items:center;gap:8px;margin-bottom:5px}
.pj-num{font-family:var(--font-px);font-size:7px;color:var(--text-muted)}
.pj-name{font-family:var(--font-px);font-size:10px;flex:1;color:var(--text)}
.pj-status{
  font-family:var(--font-px);font-size:6.5px;padding:2px 5px;
  background:var(--green);color:#fff;border:1px solid #004400;
}
.pj-status.wip{background:#886600;border-color:#554400}
.pj-arrow{color:var(--accent);font-size:15px;font-weight:bold}
.pj-desc{font-family:var(--font-mn);font-size:13px;color:var(--text);line-height:1.7;margin-bottom:6px}
.pj-tags{display:flex;gap:4px;flex-wrap:wrap}
.pj-tag{
  font-family:var(--font-mn);font-size:11px;padding:2px 8px;
  background:#c8d4e8;color:var(--accent);border:1px solid #90a8cc;font-weight:700;
}

/* ═══ CONTACT CONTENT ═══ */
.c-contact{display:flex;flex-direction:column;gap:10px}
.ct-intro{
  font-family:var(--font-mn);font-size:13px;color:var(--text);
  border-left:3px solid var(--accent);padding-left:8px;
}
.ct-field{display:flex;flex-direction:column;gap:4px}
.ct-label{font-family:var(--font-px);font-size:7.5px;color:var(--text-muted);letter-spacing:.04em}
.ct-input{
  width:100%;font-family:var(--font-mn);font-size:13px;
  border:2px inset var(--bevel-md);background:#fff;
  padding:5px 7px;outline:none;resize:none;color:var(--text);
}
.ct-input:focus{outline:2px dotted var(--accent);outline-offset:-2px}
.ct-ta{min-height:72px}
.ct-links{display:flex;gap:8px;flex-wrap:wrap}
.ct-social{
  font-family:var(--font-mn);font-size:13px;color:var(--accent);
  text-decoration:none;font-weight:700;
}
.ct-social:hover{text-decoration:underline}
.ct-foot{display:flex;justify-content:flex-end}
.ct-btn{
  font-family:var(--font-px);font-size:8px;padding:8px 16px;
  background:var(--win-face);color:var(--text);
  border:2px solid;border-color:var(--bevel-lt) var(--bevel-dk) var(--bevel-dk) var(--bevel-lt);
  letter-spacing:.03em;transition:background .1s;
}
.ct-btn:hover{background:#c0bcac}
.ct-btn:active{border-color:var(--bevel-dk) var(--bevel-lt) var(--bevel-lt) var(--bevel-dk);transform:translate(1px,1px)}
.ct-success{display:flex;justify-content:center;align-items:center;min-height:130px}
.ct-ok-icon{font-family:var(--font-px);font-size:26px;color:var(--green);text-align:center}
.ct-ok-title{font-family:var(--font-px);font-size:10px;margin:10px 0 4px;color:var(--text);text-align:center}
.ct-ok-sub{font-family:var(--font-mn);font-size:11px;color:var(--text-muted);text-align:center}
.ct-success>div{border:2px inset var(--bevel-md);padding:22px 28px;background:var(--win-face)}

/* ═══ MUSIC CONTENT ═══ */
.c-music{display:flex;flex-direction:column;gap:10px}
.music-player{
  background:var(--win-face);border:2px inset var(--bevel-md);padding:10px;
}
.music-display{margin-bottom:8px}
.music-title{font-family:var(--font-px);font-size:8px;color:var(--text);margin-bottom:3px;min-height:16px;line-height:1.6}
.music-artist{font-family:var(--font-mn);font-size:13px;color:var(--text-muted);margin-bottom:8px}
.music-eq{display:flex;align-items:flex-end;gap:2px;height:28px}
.music-bar{
  width:6px;background:var(--accent);flex-shrink:0;
  transition:height .2s;
}
.music-bar.active{animation:eq-dance .6s ease-in-out infinite alternate}
@keyframes eq-dance{from{transform:scaleY(.3)}to{transform:scaleY(1)}}
.music-controls{display:flex;gap:5px;justify-content:center}
.music-btn{
  font-family:var(--font-mn);font-size:16px;padding:4px 12px;
  background:var(--win-face);color:var(--text);
  border:2px solid;border-color:var(--bevel-lt) var(--bevel-dk) var(--bevel-dk) var(--bevel-lt);
  transition:background .1s;
}
.music-btn:hover{background:#c0bcac}
.music-btn:active{border-color:var(--bevel-dk) var(--bevel-lt) var(--bevel-lt) var(--bevel-dk);transform:translate(1px,1px)}
.music-btn-play{padding:4px 18px;background:var(--accent);color:#fff;border-color:var(--accent-lite) var(--title-a1) var(--title-a1) var(--accent-lite)}
.music-btn-play:hover{background:var(--accent-lite)}
.music-list{display:flex;flex-direction:column;gap:3px}
.music-track{
  display:flex;align-items:center;gap:7px;padding:5px 8px;
  background:var(--win-face);
  border:2px solid;border-color:var(--bevel-lt) var(--bevel-dk) var(--bevel-dk) var(--bevel-lt);
  cursor:pointer;transition:background .1s;
}
.music-track:hover{background:#c4c0b0}
.music-track.active{background:#c8d4e8;border-color:var(--accent)}
.music-num{font-family:var(--font-px);font-size:7px;color:var(--text-muted);min-width:20px}
.music-info{flex:1;display:flex;flex-direction:column;gap:1px}
.music-name{font-family:var(--font-mn);font-size:13px;color:var(--text)}
.music-genre{font-family:var(--font-mn);font-size:10px;color:var(--text-muted)}
.music-dur{font-family:var(--font-mn);font-size:11px;color:var(--text-muted)}

/* ═══ NOW CONTENT ═══ */
.c-now{display:flex;flex-direction:column;gap:10px}
.now-header{font-family:var(--font-px);font-size:7px;color:var(--accent);margin-bottom:2px}
.now-items{display:flex;flex-direction:column;gap:6px}
.now-item{
  display:flex;align-items:flex-start;gap:8px;padding:6px 8px;
  background:var(--win-face);
  border:2px solid;border-color:var(--bevel-lt) var(--bevel-dk) var(--bevel-dk) var(--bevel-lt);
}
.now-emoji{font-size:16px;flex-shrink:0;margin-top:1px}
.now-label{font-family:var(--font-px);font-size:7px;color:var(--text-muted);margin-bottom:2px;letter-spacing:.04em}
.now-val{font-family:var(--font-mn);font-size:14px;color:var(--text);font-weight:700}
.now-log-title{font-family:var(--font-px);font-size:7px;color:var(--accent)}
.now-log-row{
  display:flex;align-items:baseline;gap:8px;padding:5px 9px;
  border-left:3px solid var(--accent);background:var(--win-face);margin-bottom:3px;
}
.now-log-date{font-family:var(--font-px);font-size:7px;color:var(--text-muted);flex-shrink:0}
.now-log-ev{font-family:var(--font-mn);font-size:13px;color:var(--text)}

/* ═══ TASKBAR ═══ */
.taskbar{
  position:fixed;bottom:0;left:0;right:0;height:var(--taskbar-h);z-index:9999;
  background:var(--win-face);
  border-top:2px solid;border-color:var(--bevel-lt) transparent transparent var(--bevel-lt);
  box-shadow:0 -1px 0 var(--bevel-dk);
  display:flex;align-items:center;gap:3px;padding:3px 4px;
}
.tb-start{
  display:flex;align-items:center;gap:5px;height:36px;padding:0 12px;flex-shrink:0;
  background:var(--win-face);color:var(--text);
  border:2px solid;border-color:var(--bevel-lt) var(--bevel-dk) var(--bevel-dk) var(--bevel-lt);
  font-family:var(--font-px);font-size:10px;font-weight:700;transition:background .1s;
}
.tb-start>span:first-child{font-size:17px}
.tb-start:hover{background:#c0bcac}
.tb-start:active{border-color:var(--bevel-dk) var(--bevel-lt) var(--bevel-lt) var(--bevel-dk);transform:translate(1px,1px)}
.tb-divider{width:2px;height:34px;flex-shrink:0;margin:0 2px;border-left:1px solid var(--bevel-dk);border-right:1px solid var(--bevel-lt)}
.tb-apps{display:flex;gap:3px;flex:1;overflow:hidden}
.tb-app{
  display:flex;align-items:center;gap:5px;height:34px;
  min-width:90px;max-width:150px;padding:0 8px;flex-shrink:0;overflow:hidden;
  font-family:var(--font-mn);font-size:11px;color:var(--text);background:var(--win-face);
  border:2px solid;border-color:var(--bevel-lt) var(--bevel-dk) var(--bevel-dk) var(--bevel-lt);
  transition:background .1s;
}
.tb-app:hover{background:#c0bcac}
.tb-app.active{
  background:#b4b0a0;border-color:var(--bevel-dk) var(--bevel-lt) var(--bevel-lt) var(--bevel-dk);
  box-shadow:inset 1px 1px 2px rgba(0,0,0,.18);
}
.tb-app.minimized{opacity:.6}
.tb-app-ico{font-size:14px;flex-shrink:0}
.tb-app-lbl{font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tb-clock-box{flex-shrink:0;height:34px;padding:0 11px;border:2px inset var(--bevel-md);background:var(--win-face);display:grid;place-items:center}
.tb-clock{font-family:var(--font-mn);font-size:12px;white-space:nowrap}

/* ═══ MOBILE ═══ */
.mob-root{position:fixed;inset:0;background:radial-gradient(ellipse 120% 100% at 20% 60%,#181d3a 0%,var(--bg) 70%);display:flex;flex-direction:column;overflow:hidden}
.mob-header{display:flex;justify-content:space-between;align-items:center;padding:6px 12px;background:var(--win-face);border-bottom:2px solid var(--bevel-dk);flex-shrink:0}
.mob-title{font-family:var(--font-px);font-size:9px;color:var(--text)}
.mob-clock{font-family:var(--font-mn);font-size:11px;color:var(--text-muted)}
.mob-win{flex:1;display:flex;flex-direction:column;overflow:hidden;margin:10px;border:2px solid;border-color:var(--bevel-lt) var(--bevel-dk) var(--bevel-dk) var(--bevel-lt);box-shadow:2px 2px 0 var(--bevel-dk);background:var(--win-face)}
.mob-body{flex:1;overflow-y:auto;overflow-x:hidden;background:var(--win-inner);border:2px inset var(--bevel-md);margin:3px;padding:14px;scrollbar-width:thin}
.mob-nav{display:flex;justify-content:space-around;align-items:center;padding:4px;background:var(--win-face);border-top:2px solid;border-color:var(--bevel-lt) transparent transparent var(--bevel-lt);box-shadow:0 -1px 0 var(--bevel-dk);flex-shrink:0;overflow-x:auto}
.mob-nav-btn{display:flex;flex-direction:column;align-items:center;gap:2px;padding:5px 8px;background:transparent;color:var(--text-muted);border:2px solid transparent;font-family:var(--font-mn);font-size:9px;transition:all .12s;flex:1;min-width:52px}
.mob-nav-btn:hover{background:#c0bcac;border-color:var(--bevel-lt) var(--bevel-dk) var(--bevel-dk) var(--bevel-lt)}
.mob-nav-btn.active{background:var(--win-face);color:var(--accent);font-weight:700;border-color:var(--bevel-dk) var(--bevel-lt) var(--bevel-lt) var(--bevel-dk);box-shadow:inset 1px 1px 1px rgba(0,0,0,.15)}
.mob-nav-ico{font-size:18px}
.mob-nav-lbl{font-size:7.5px;text-transform:uppercase;letter-spacing:.04em}

@media(max-width:900px){
  .c-profile{flex-direction:column}
  .stat-grid{flex-direction:row;flex-wrap:wrap}
  .stat-cell{min-width:80px;flex:1}
  .tb-start-txt{display:none}
  .tb-app{min-width:60px}
  .tb-app-lbl{display:none}
}
@media(max-width:700px){.w98body{max-height:none}}
`;
