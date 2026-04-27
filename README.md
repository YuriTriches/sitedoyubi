# Yuri Triches — Portfolio Fullstack Developer

**Stack:** Next.js 15 · React 19 · TypeScript · Tailwind CSS · Framer Motion · Lucide React

## Rodar localmente

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Personalizar

| Arquivo | O que editar |
|---|---|
| `lib/data.ts` | Nome, bio, stats, projetos, skills, redes sociais |
| `components/windows/ProfileWindow.tsx` | Trocar emoji por `<Image>` com sua foto |
| `app/globals.css` | CSS vars de cor (`--accent`, `--win-bar`, etc) |
| `app/page.tsx` | Posições iniciais das janelas (`initialX/Y`) |

## Estrutura

```
app/
  globals.css        ← tema Win95 + fontes + scanlines
  layout.tsx
  page.tsx           ← layout e z-index das janelas

components/
  windows/
    DraggableWindow.tsx   ← janela base arrastável (Framer Motion drag)
    ProfileWindow.tsx     ← profile.exe
    SkillsWindow.tsx      ← skills.exe
    ProjectsWindow.tsx    ← projects.exe
    ContactWindow.tsx     ← contact.exe
  ui/
    AnimatedBackground.tsx ← canvas com rede de pontos animada
    Taskbar.tsx            ← barra Win95 com relógio
    Footer.tsx             ← rodapé estilizado

lib/
  data.ts            ← todos os dados do portfolio
```
