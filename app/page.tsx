"use client"

import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  Sparkles,
  LayoutDashboard,
  Wand2,
  Library,
  Zap,
  Settings as SettingsIcon,
  Sun,
  Moon,
  Eye,
  EyeOff,
  Copy,
  Download,
  Save,
  Search,
  Plus,
  Trash2,
  Pencil,
  Play,
  Check,
  X,
  LogOut,
  User as UserIcon,
  Mail,
  FileText,
  Code2,
  Image as ImageIcon,
  Share2,
  ChevronDown,
  Menu,
  Lock,
  ShieldCheck,
  Rocket,
  CalendarClock,
  Megaphone,
  GitBranch,
} from "lucide-react"

/* =========================================================================
   DESIGN TOKENS
   ========================================================================= */

type Mode = "dark" | "light"

type Theme = ReturnType<typeof getTheme>

function getTheme(mode: Mode) {
  if (mode === "dark") {
    return {
      mode,
      bg: "#080B14",
      surface: "#0F1424",
      surface2: "#141B30",
      inputBg: "#0B1020",
      border: "#212B47",
      borderStrong: "#2C3860",
      text: "#E6ECFA",
      textMuted: "#8A97B8",
      accent: "#4FD8FF",
      accent2: "#7C6CFF",
      accentText: "#04121C",
      glow: "rgba(79,216,255,0.55)",
      danger: "#FF6B7D",
      success: "#4FE0A6",
      dot: "rgba(255,255,255,0.05)",
      overlay: "rgba(3,6,14,0.72)",
      shadow: "0 18px 50px rgba(0,0,0,0.55)",
      shadowSoft: "0 8px 24px rgba(0,0,0,0.4)",
    }
  }
  return {
    mode,
    bg: "#FFFFFF",
    surface: "#F1F3F5",
    surface2: "#FFFFFF",
    inputBg: "#FFFFFF",
    border: "#E2E6EA",
    borderStrong: "#CBD2D9",
    text: "#0B1220",
    textMuted: "#5B6577",
    accent: "#0FA3A3",
    accent2: "#14B8A6",
    accentText: "#FFFFFF",
    glow: "rgba(15,163,163,0.4)",
    danger: "#DC2626",
    success: "#0F9D6C",
    dot: "rgba(11,18,32,0.06)",
    overlay: "rgba(15,20,30,0.4)",
    shadow: "0 18px 50px rgba(15,23,42,0.14)",
    shadowSoft: "0 8px 24px rgba(15,23,42,0.08)",
  }
}

const FONT_HEAD = "'Space Grotesk', ui-sans-serif, system-ui, sans-serif"
const FONT_BODY = "'Inter', ui-sans-serif, system-ui, sans-serif"
const FONT_MONO = "'JetBrains Mono', ui-monospace, 'Fira Code', monospace"

/* =========================================================================
   CATEGORY / TYPE META
   ========================================================================= */

const CONTENT_TYPES = [
  { id: "blog", label: "Blog", icon: FileText },
  { id: "email", label: "Email", icon: Mail },
  { id: "code", label: "Code", icon: Code2 },
  { id: "social", label: "Social", icon: Share2 },
  { id: "image", label: "Image", icon: ImageIcon },
] as const

type ContentType = (typeof CONTENT_TYPES)[number]["id"]

const CATEGORY_META: Record<string, { label: string; icon: any }> = {
  blog: { label: "Blog", icon: FileText },
  email: { label: "Email", icon: Mail },
  code: { label: "Code", icon: Code2 },
  social: { label: "Social", icon: Share2 },
  image: { label: "Image", icon: ImageIcon },
}

/* =========================================================================
   MOCK DATA
   ========================================================================= */

let idCounter = 1
const uid = () => `id_${Date.now().toString(36)}_${(idCounter++).toString(36)}`

type Prompt = {
  id: string
  title: string
  category: ContentType
  body: string
  updatedAt: number
}

type Workflow = {
  id: string
  title: string
  provider: "Zapier" | "Power Automate"
  description: string
  icon: any
  enabled: boolean
}

type Activity = {
  id: string
  text: string
  at: number
}

const initialPrompts = (): Prompt[] => {
  const now = Date.now()
  return [
    {
      id: uid(),
      title: "SEO blog outline",
      category: "blog",
      body: "Write a comprehensive, SEO-optimized blog outline about sustainable urban gardening, including headings, meta description, and a call to action.",
      updatedAt: now - 1000 * 60 * 60 * 5,
    },
    {
      id: uid(),
      title: "Cold outreach email",
      category: "email",
      body: "Draft a friendly but concise cold outreach email introducing our analytics product to a Head of Growth at a mid-market SaaS company.",
      updatedAt: now - 1000 * 60 * 60 * 26,
    },
    {
      id: uid(),
      title: "React debounce hook",
      category: "code",
      body: "Generate a reusable TypeScript React hook called useDebounce that debounces a value with a configurable delay.",
      updatedAt: now - 1000 * 60 * 60 * 50,
    },
    {
      id: uid(),
      title: "Launch tweet thread",
      category: "social",
      body: "Create a punchy 5-part tweet thread announcing the launch of NanieAI, highlighting speed, automation, and creativity.",
      updatedAt: now - 1000 * 60 * 60 * 72,
    },
    {
      id: uid(),
      title: "Abstract cover art",
      category: "image",
      body: "A dreamy abstract composition with flowing neon gradients, soft glowing orbs, and a calm cosmic atmosphere.",
      updatedAt: now - 1000 * 60 * 60 * 90,
    },
  ]
}

const initialWorkflows = (): Workflow[] => [
  {
    id: uid(),
    title: "Publish to blog CMS",
    provider: "Zapier",
    description: "Push generated blog posts straight into your headless CMS as drafts, tagged and ready for review.",
    icon: FileText,
    enabled: true,
  },
  {
    id: uid(),
    title: "Send email campaign",
    provider: "Power Automate",
    description: "Queue generated email copy into your marketing platform and schedule the send to a chosen segment.",
    icon: Megaphone,
    enabled: true,
  },
  {
    id: uid(),
    title: "Export code to repo",
    provider: "Zapier",
    description: "Commit generated snippets to a designated branch and open a pull request automatically.",
    icon: GitBranch,
    enabled: false,
  },
  {
    id: uid(),
    title: "Schedule social post",
    provider: "Power Automate",
    description: "Drop social copy into your scheduling queue across X, LinkedIn, and Instagram at optimal times.",
    icon: CalendarClock,
    enabled: true,
  },
]

/* =========================================================================
   HELPERS
   ========================================================================= */

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000)
  if (s < 45) return "just now"
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d ago`
  return new Date(ts).toLocaleDateString()
}

function titleFromPrompt(prompt: string) {
  const t = prompt.trim().replace(/\s+/g, " ")
  if (!t) return "Untitled"
  const words = t.split(" ").slice(0, 6).join(" ")
  return words.charAt(0).toUpperCase() + words.slice(1)
}

function buildTemplate(type: ContentType, prompt: string): string {
  const topic = prompt.trim() || "your topic"
  const title = titleFromPrompt(prompt) || "Your Topic"
  switch (type) {
    case "blog":
      return `# ${title}

*An AI-crafted draft from NanieAI*

## Introduction
${topic} is more relevant today than ever. In this piece we'll break down why it matters, what most people get wrong, and how to think about it clearly.

## Why it matters
- It shapes the way modern teams work and create.
- Small, consistent improvements compound over time.
- The tools finally caught up with the ambition.

## Three key takeaways
1. **Start with intent.** Define the outcome before the output.
2. **Iterate fast.** Ship a draft, then refine with feedback.
3. **Automate the repetitive.** Save your energy for the creative work.

## Conclusion
${title} isn't a destination — it's a practice. Begin small, stay curious, and let NanieAI handle the heavy lifting.

_Generated with NanieAI • edit freely before publishing._`
    case "email":
      return `Subject: A quick idea about ${title}

Hi there,

I hope this finds you well. I'm reaching out about ${topic} — something I think could genuinely move the needle for your team.

Here's the short version:
• It saves hours of manual effort every week.
• It's simple to roll out, no heavy setup required.
• Early adopters are already seeing real results.

Would you be open to a 15-minute chat next week? I'd love to show you exactly how it works.

Warm regards,
The NanieAI Team`
    case "code":
      return `// ${title}
// Generated by NanieAI — review before shipping.

import { useState, useEffect } from "react"

/**
 * A small utility inspired by: ${topic}
 */
export function useExample<T>(initial: T) {
  const [value, setValue] = useState<T>(initial)

  useEffect(() => {
    console.log("[NanieAI] value changed:", value)
  }, [value])

  const reset = () => setValue(initial)

  return { value, setValue, reset }
}

export default useExample`
    case "social":
      return `🚀 Thread: ${title}

1/ ${topic} — here's why everyone's talking about it right now. 🧵

2/ The old way was slow, manual, and honestly exhausting. There's a better path.

3/ Three things changed the game:
   → speed
   → automation
   → creative freedom

4/ Teams using this are shipping more, stressing less, and having more fun doing it.

5/ Curious? Try it and tell me what you build. 👇

#NanieAI #AI #Automation`
    default:
      return topic
  }
}

/* ---- deterministic abstract SVG from prompt ---- */

function hashString(str: string) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function seededRandom(seed: number) {
  let s = seed || 1
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

function buildImageSVG(prompt: string): string {
  const seed = hashString(prompt.trim() || "nanie")
  const rnd = seededRandom(seed)
  const W = 640
  const H = 400
  const baseHue = Math.floor(rnd() * 360)
  const hue2 = (baseHue + 40 + Math.floor(rnd() * 120)) % 360
  const focalHue = (baseHue + 180 + Math.floor(rnd() * 60)) % 360

  const circles: string[] = []
  const count = 4 + Math.floor(rnd() * 3)
  for (let i = 0; i < count; i++) {
    const cx = Math.floor(rnd() * W)
    const cy = Math.floor(rnd() * H)
    const r = 60 + Math.floor(rnd() * 150)
    const hue = (baseHue + Math.floor(rnd() * 360)) % 360
    const opacity = (0.25 + rnd() * 0.4).toFixed(2)
    circles.push(
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="hsl(${hue}, 85%, 60%)" opacity="${opacity}" />`,
    )
  }

  const focalX = Math.floor(W * (0.3 + rnd() * 0.4))
  const focalY = Math.floor(H * (0.3 + rnd() * 0.4))
  const focalR = 50 + Math.floor(rnd() * 50)

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Abstract generated art">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="hsl(${baseHue}, 70%, 22%)" />
      <stop offset="100%" stop-color="hsl(${hue2}, 75%, 42%)" />
    </linearGradient>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="26" />
    </filter>
    <radialGradient id="focal" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="hsl(${focalHue}, 100%, 78%)" />
      <stop offset="100%" stop-color="hsl(${focalHue}, 100%, 55%)" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)" />
  <g filter="url(#soft)">
    ${circles.join("\n    ")}
  </g>
  <circle cx="${focalX}" cy="${focalY}" r="${focalR}" fill="url(#focal)" />
  <circle cx="${focalX}" cy="${focalY}" r="${Math.floor(focalR * 0.4)}" fill="hsl(${focalHue}, 100%, 90%)" opacity="0.9" filter="url(#soft)" />
</svg>`
}

function triggerDownload(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/* =========================================================================
   GLOBAL STYLES (fonts + keyframes)
   ========================================================================= */

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
      * { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }
      button { font-family: inherit; cursor: pointer; }
      input, textarea { font-family: inherit; }
      textarea { resize: vertical; }
      @keyframes nanie-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
      @keyframes nanie-pulse { 0%, 100% { box-shadow: 0 0 0 0 var(--glow); } 50% { box-shadow: 0 0 0 6px transparent; } }
      @keyframes nanie-spin { to { transform: rotate(360deg); } }
      @keyframes nanie-toast-in { from { opacity: 0; transform: translateX(20px) scale(0.98); } to { opacity: 1; transform: translateX(0) scale(1); } }
      @keyframes nanie-fade-up { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      ::selection { background: rgba(124,108,255,0.35); }
    `}</style>
  )
}

/* =========================================================================
   UI PRIMITIVES
   ========================================================================= */

function Logo({ t, size = 32 }: { t: Theme; size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 9,
          background: `linear-gradient(135deg, ${t.accent}, ${t.accent2})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 6px 18px ${t.glow}`,
          flexShrink: 0,
        }}
      >
        <Sparkles size={size * 0.55} color={t.accentText} strokeWidth={2.4} />
      </div>
      <span style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: size * 0.62, letterSpacing: -0.5 }}>
        <span style={{ color: t.text }}>Nanie</span>
        <span style={{ color: t.accent }}>AI</span>
      </span>
    </div>
  )
}

function Button({
  t,
  children,
  onClick,
  variant = "primary",
  icon: Icon,
  disabled,
  full,
  small,
  style,
  ariaLabel,
}: {
  t: Theme
  children?: React.ReactNode
  onClick?: () => void
  variant?: "primary" | "ghost" | "outline" | "danger" | "accent2"
  icon?: any
  disabled?: boolean
  full?: boolean
  small?: boolean
  style?: React.CSSProperties
  ariaLabel?: string
}) {
  const [hover, setHover] = useState(false)
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: small ? "7px 12px" : "10px 16px",
    fontSize: small ? 13 : 14,
    fontWeight: 600,
    fontFamily: FONT_BODY,
    borderRadius: 10,
    border: "1px solid transparent",
    width: full ? "100%" : undefined,
    transition: "transform .12s ease, background .18s ease, opacity .18s ease, border-color .18s ease",
    opacity: disabled ? 0.45 : 1,
    pointerEvents: disabled ? "none" : "auto",
    transform: hover && !disabled ? "translateY(-1px)" : "none",
    whiteSpace: "nowrap",
  }
  const variants: Record<string, React.CSSProperties> = {
    primary: {
      background: t.accent,
      color: t.accentText,
      boxShadow: hover ? `0 8px 22px ${t.glow}` : t.shadowSoft,
    },
    accent2: {
      background: t.accent2,
      color: "#fff",
      boxShadow: hover ? "0 8px 22px rgba(124,108,255,0.4)" : t.shadowSoft,
    },
    ghost: {
      background: hover ? t.surface2 : "transparent",
      color: t.text,
    },
    outline: {
      background: hover ? t.surface2 : "transparent",
      color: t.text,
      borderColor: t.border,
    },
    danger: {
      background: hover ? t.danger : "transparent",
      color: hover ? "#fff" : t.danger,
      borderColor: t.danger,
    },
  }
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...base, ...variants[variant], ...style }}
    >
      {Icon && <Icon size={small ? 15 : 17} strokeWidth={2.2} />}
      {children}
    </button>
  )
}

function Card({ t, children, style }: { t: Theme; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: t.surface,
        border: `1px solid ${t.border}`,
        borderRadius: 16,
        padding: 20,
        boxShadow: t.shadowSoft,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function Field({
  t,
  label,
  ...props
}: { t: Theme; label?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const [focus, setFocus] = useState(false)
  return (
    <label style={{ display: "block" }}>
      {label && (
        <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: t.textMuted, marginBottom: 7 }}>
          {label}
        </span>
      )}
      <input
        {...props}
        onFocus={(e) => {
          setFocus(true)
          props.onFocus?.(e)
        }}
        onBlur={(e) => {
          setFocus(false)
          props.onBlur?.(e)
        }}
        style={{
          width: "100%",
          padding: "11px 13px",
          fontSize: 14,
          color: t.text,
          background: t.inputBg,
          border: `1px solid ${focus ? t.accent : t.border}`,
          borderRadius: 10,
          outline: "none",
          boxShadow: focus ? `0 0 0 3px ${t.glow}` : "none",
          transition: "border-color .15s ease, box-shadow .15s ease",
        }}
      />
    </label>
  )
}

function Toggle({ t, on, onChange, ariaLabel }: { t: Theme; on: boolean; onChange: () => void; ariaLabel?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={ariaLabel}
      onClick={onChange}
      style={{
        width: 46,
        height: 26,
        borderRadius: 20,
        border: "none",
        background: on ? t.accent : t.borderStrong,
        position: "relative",
        transition: "background .2s ease",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: on ? 23 : 3,
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "#fff",
          transition: "left .2s ease",
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        }}
      />
    </button>
  )
}

function Badge({ t, children, color }: { t: Theme; children: React.ReactNode; color?: string }) {
  const c = color || t.accent
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 11.5,
        fontWeight: 600,
        padding: "3px 9px",
        borderRadius: 999,
        color: c,
        background: `${c}1f`,
        border: `1px solid ${c}40`,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  )
}

/* =========================================================================
   TOASTS
   ========================================================================= */

type Toast = { id: string; message: string; type: "success" | "error" | "info" }

function ToastStack({ t, toasts, dismiss }: { t: Theme; toasts: Toast[]; dismiss: (id: string) => void }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        zIndex: 1000,
        maxWidth: "calc(100vw - 40px)",
      }}
    >
      {toasts.map((toast) => {
        const color = toast.type === "error" ? t.danger : toast.type === "success" ? t.success : t.accent
        const Icon = toast.type === "error" ? X : toast.type === "success" ? Check : Sparkles
        return (
          <div
            key={toast.id}
            role="status"
            onClick={() => dismiss(toast.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 11,
              background: t.surface2,
              border: `1px solid ${t.border}`,
              borderLeft: `3px solid ${color}`,
              borderRadius: 12,
              padding: "12px 15px",
              minWidth: 240,
              boxShadow: t.shadow,
              cursor: "pointer",
              animation: "nanie-toast-in .25s ease",
            }}
          >
            <span
              style={{
                width: 24,
                height: 24,
                borderRadius: 7,
                background: `${color}22`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon size={15} color={color} strokeWidth={2.5} />
            </span>
            <span style={{ fontSize: 13.5, color: t.text, fontWeight: 500 }}>{toast.message}</span>
          </div>
        )
      })}
    </div>
  )
}

/* =========================================================================
   LOGIN SCREEN
   ========================================================================= */

function LoginScreen({ t, onLogin, addToast }: { t: Theme; onLogin: (u: { name: string; email: string }) => void; addToast: (m: string, type?: Toast["type"]) => void }) {
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)

  const submit = () => {
    if (!email.trim() || !email.includes("@")) {
      addToast("Please enter a valid email address.", "error")
      return
    }
    if (!password) {
      addToast("Please enter a password.", "error")
      return
    }
    if (password.length < 6) {
      addToast("Password must be at least 6 characters.", "error")
      return
    }
    if (mode === "signup" && !name.trim()) {
      addToast("Please enter your name.", "error")
      return
    }
    const derived =
      mode === "signup" && name.trim()
        ? name.trim()
        : email
            .split("@")[0]
            .replace(/[._-]+/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase())
    onLogin({ name: derived, email: email.trim() })
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !(e.nativeEvent as any).isComposing && (e as any).keyCode !== 229) {
      submit()
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        position: "relative",
        overflow: "hidden",
        background: t.bg,
      }}
    >
      {/* glowing radial gradients */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(600px circle at 20% 20%, ${t.accent}22, transparent 55%), radial-gradient(700px circle at 80% 75%, ${t.accent2}25, transparent 55%)`,
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(${t.dot} 1px, transparent 1px)`,
          backgroundSize: "22px 22px",
          pointerEvents: "none",
        }}
      />
      <div
        onKeyDown={onKeyDown}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 420,
          background: t.surface,
          border: `1px solid ${t.border}`,
          borderRadius: 20,
          padding: 30,
          boxShadow: t.shadow,
          animation: "nanie-fade-up .35s ease",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
          <Logo t={t} size={34} />
        </div>
        <p style={{ textAlign: "center", color: t.textMuted, fontSize: 14, margin: "0 0 22px" }}>
          Your AI content-creation & automation studio
        </p>

        {/* segmented toggle */}
        <div
          style={{
            display: "flex",
            padding: 4,
            background: t.inputBg,
            border: `1px solid ${t.border}`,
            borderRadius: 12,
            marginBottom: 22,
          }}
        >
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              style={{
                flex: 1,
                padding: "9px 0",
                fontSize: 13.5,
                fontWeight: 600,
                border: "none",
                borderRadius: 9,
                background: mode === m ? t.accent : "transparent",
                color: mode === m ? t.accentText : t.textMuted,
                transition: "background .2s ease, color .2s ease",
              }}
            >
              {m === "signin" ? "Sign in" : "Sign up"}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
          {mode === "signup" && (
            <Field t={t} label="Name" placeholder="Ada Lovelace" value={name} onChange={(e) => setName(e.target.value)} />
          )}
          <Field
            t={t}
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div style={{ position: "relative" }}>
            <Field
              t={t}
              label="Password"
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ paddingRight: 42 }}
            />
            <button
              type="button"
              aria-label={showPw ? "Hide password" : "Show password"}
              onClick={() => setShowPw((s) => !s)}
              style={{
                position: "absolute",
                right: 10,
                top: 32,
                background: "transparent",
                border: "none",
                color: t.textMuted,
                display: "flex",
                padding: 4,
              }}
            >
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <Button t={t} full onClick={submit} icon={mode === "signin" ? UserIcon : Rocket} style={{ marginTop: 4 }}>
            {mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </div>

        <div style={{ textAlign: "center", marginTop: 18 }}>
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            style={{ background: "none", border: "none", color: t.accent, fontSize: 13.5, fontWeight: 600 }}
          >
            {mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
          </button>
          <p style={{ color: t.textMuted, fontSize: 12, marginTop: 14, marginBottom: 0 }}>
            Demo mode — any email & password works. No data leaves your browser.
          </p>
        </div>
      </div>
    </div>
  )
}

/* =========================================================================
   DASHBOARD
   ========================================================================= */

function StatCard({ t, label, value, icon: Icon, color }: { t: Theme; label: string; value: React.ReactNode; icon: any; color: string }) {
  return (
    <Card t={t} style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: 12,
          background: `${color}1f`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={22} color={color} strokeWidth={2.2} />
      </div>
      <div>
        <div style={{ fontFamily: FONT_HEAD, fontSize: 26, fontWeight: 700, color: t.text, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 13, color: t.textMuted, marginTop: 5 }}>{label}</div>
      </div>
    </Card>
  )
}

function Dashboard({
  t,
  user,
  prompts,
  workflows,
  activity,
  contentCount,
  go,
}: {
  t: Theme
  user: { name: string; email: string }
  prompts: Prompt[]
  workflows: Workflow[]
  activity: Activity[]
  contentCount: number
  go: (v: string) => void
}) {
  const activeWorkflows = workflows.filter((w) => w.enabled).length
  const categoryCounts = CONTENT_TYPES.map((ct) => ({
    ...ct,
    count: prompts.filter((p) => p.category === ct.id).length,
  }))

  const quickActions = [
    { label: "Generate content", desc: "Create blogs, emails, code & more", icon: Wand2, view: "generator", color: t.accent },
    { label: "Prompt library", desc: "Browse & reuse your saved prompts", icon: Library, view: "library", color: t.accent2 },
    { label: "Automation", desc: "Trigger connected workflows", icon: Zap, view: "automation", color: t.success },
  ]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h2 style={{ fontFamily: FONT_HEAD, fontSize: 24, fontWeight: 700, color: t.text, margin: "0 0 6px" }}>
          Welcome back, {user.name.split(" ")[0]} 👋
        </h2>
        <p style={{ color: t.textMuted, fontSize: 14.5, margin: 0 }}>
          Here's what's happening in your studio today.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <StatCard t={t} label="Saved prompts" value={prompts.length} icon={Library} color={t.accent} />
        <StatCard t={t} label="Active workflows" value={activeWorkflows} icon={Zap} color={t.accent2} />
        <StatCard t={t} label="Generated this week" value={contentCount} icon={Wand2} color={t.success} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
        {quickActions.map((qa) => (
          <button
            key={qa.view}
            type="button"
            onClick={() => go(qa.view)}
            style={{
              textAlign: "left",
              background: t.surface,
              border: `1px solid ${t.border}`,
              borderRadius: 16,
              padding: 18,
              boxShadow: t.shadowSoft,
              display: "flex",
              alignItems: "center",
              gap: 14,
              transition: "transform .12s ease, border-color .18s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)"
              e.currentTarget.style.borderColor = qa.color
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none"
              e.currentTarget.style.borderColor = t.border
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 11,
                background: `linear-gradient(135deg, ${qa.color}, ${qa.color}99)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <qa.icon size={20} color={t.mode === "dark" ? "#04121C" : "#fff"} strokeWidth={2.3} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, color: t.text }}>{qa.label}</div>
              <div style={{ fontSize: 12.5, color: t.textMuted, marginTop: 3 }}>{qa.desc}</div>
            </div>
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.3fr)", gap: 16 }} className="nanie-dash-grid">
        <Card t={t}>
          <h3 style={{ fontFamily: FONT_HEAD, fontSize: 16, fontWeight: 600, color: t.text, margin: "0 0 16px" }}>
            Prompts by category
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {categoryCounts.map((c) => {
              const max = Math.max(1, ...categoryCounts.map((x) => x.count))
              return (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <c.icon size={16} color={t.textMuted} style={{ flexShrink: 0 }} />
                  <span style={{ width: 54, fontSize: 13, color: t.text }}>{c.label}</span>
                  <div style={{ flex: 1, height: 8, background: t.inputBg, borderRadius: 6, overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${(c.count / max) * 100}%`,
                        height: "100%",
                        background: `linear-gradient(90deg, ${t.accent}, ${t.accent2})`,
                        borderRadius: 6,
                        transition: "width .4s ease",
                      }}
                    />
                  </div>
                  <span style={{ width: 20, textAlign: "right", fontSize: 13, fontWeight: 600, color: t.textMuted }}>
                    {c.count}
                  </span>
                </div>
              )
            })}
          </div>
        </Card>

        <Card t={t}>
          <h3 style={{ fontFamily: FONT_HEAD, fontSize: 16, fontWeight: 600, color: t.text, margin: "0 0 16px" }}>
            Recent activity
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, maxHeight: 280, overflowY: "auto" }}>
            {activity.length === 0 && (
              <p style={{ color: t.textMuted, fontSize: 13.5 }}>No activity yet — start generating!</p>
            )}
            {activity.slice(0, 12).map((a) => (
              <div key={a.id} style={{ display: "flex", gap: 11, padding: "9px 0", borderBottom: `1px solid ${t.border}` }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: t.accent, marginTop: 6, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, color: t.text }}>{a.text}</div>
                  <div style={{ fontSize: 11.5, color: t.textMuted, marginTop: 2 }}>{timeAgo(a.at)}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

/* =========================================================================
   CONTENT GENERATOR
   ========================================================================= */

function Generator({
  t,
  genType,
  setGenType,
  genPrompt,
  setGenPrompt,
  addToast,
  addActivity,
  onSavePrompt,
  onContentGenerated,
}: {
  t: Theme
  genType: ContentType
  setGenType: (c: ContentType) => void
  genPrompt: string
  setGenPrompt: (s: string) => void
  addToast: (m: string, type?: Toast["type"]) => void
  addActivity: (m: string) => void
  onSavePrompt: (title: string, category: ContentType, body: string) => void
  onContentGenerated: () => void
}) {
  const [fullText, setFullText] = useState("")
  const [shown, setShown] = useState("")
  const [streaming, setStreaming] = useState(false)
  const [imgLoading, setImgLoading] = useState(false)
  const [svg, setSvg] = useState("")
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const isImage = genType === "image"
  const hasOutput = isImage ? !!svg : !!fullText
  const active = streaming || imgLoading

  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setFullText("")
    setShown("")
    setSvg("")
    setStreaming(false)
    setImgLoading(false)
  }

  const generate = () => {
    if (!genPrompt.trim()) {
      addToast("Enter a prompt to generate content.", "error")
      return
    }
    reset()
    if (isImage) {
      setImgLoading(true)
      timeoutRef.current = setTimeout(() => {
        setSvg(buildImageSVG(genPrompt))
        setImgLoading(false)
        onContentGenerated()
        addActivity(`Generated an image for “${titleFromPrompt(genPrompt)}”`)
        addToast("Image rendered.", "success")
      }, 1100)
      return
    }
    const text = buildTemplate(genType, genPrompt)
    setFullText(text)
    setShown("")
    setStreaming(true)
    let i = 0
    intervalRef.current = setInterval(() => {
      i += Math.max(1, Math.round(text.length / 260))
      if (i >= text.length) {
        i = text.length
        setShown(text)
        if (intervalRef.current) clearInterval(intervalRef.current)
        setStreaming(false)
        onContentGenerated()
        addActivity(`Generated ${genType} content for “${titleFromPrompt(genPrompt)}”`)
        addToast("Content generated.", "success")
      } else {
        setShown(text.slice(0, i))
      }
    }, 16)
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fullText)
      addToast("Copied to clipboard.", "success")
    } catch {
      addToast("Copy failed — clipboard blocked.", "error")
    }
  }

  const download = () => {
    const name = titleFromPrompt(genPrompt).replace(/\s+/g, "-").toLowerCase() || "nanie"
    if (isImage) {
      triggerDownload(svg, `${name}.svg`, "image/svg+xml")
    } else if (genType === "code") {
      triggerDownload(fullText, `${name}.txt`, "text/plain")
    } else {
      triggerDownload(fullText, `${name}.md`, "text/markdown")
    }
    addToast("Download started.", "success")
    addActivity(`Downloaded ${genType} output`)
  }

  const save = () => {
    if (!genPrompt.trim()) {
      addToast("Nothing to save — write a prompt first.", "error")
      return
    }
    onSavePrompt(titleFromPrompt(genPrompt), genType, genPrompt.trim())
    addToast("Prompt saved to library.", "success")
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* type tabs */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {CONTENT_TYPES.map((ct) => {
          const on = genType === ct.id
          return (
            <button
              key={ct.id}
              type="button"
              onClick={() => setGenType(ct.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "8px 15px",
                fontSize: 13.5,
                fontWeight: 600,
                borderRadius: 10,
                border: `1px solid ${on ? t.accent : t.border}`,
                background: on ? `${t.accent}1a` : t.surface,
                color: on ? t.accent : t.textMuted,
                transition: "all .15s ease",
              }}
            >
              <ct.icon size={16} strokeWidth={2.2} />
              {ct.label}
            </button>
          )
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.15fr)", gap: 18 }} className="nanie-gen-grid">
        {/* prompt input */}
        <Card t={t} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: t.textMuted, marginBottom: 8 }}>
              Your prompt
            </label>
            <textarea
              value={genPrompt}
              onChange={(e) => setGenPrompt(e.target.value)}
              placeholder={
                isImage
                  ? "Describe the abstract art you want to render…"
                  : `Describe the ${genType} content you want…`
              }
              rows={8}
              style={{
                width: "100%",
                padding: 13,
                fontSize: 14,
                lineHeight: 1.5,
                color: t.text,
                background: t.inputBg,
                border: `1px solid ${t.border}`,
                borderRadius: 12,
                outline: "none",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Button t={t} icon={Wand2} onClick={generate} disabled={active}>
              {active ? "Generating…" : "Generate"}
            </Button>
            <Button t={t} variant="outline" icon={Save} onClick={save}>
              Save prompt
            </Button>
          </div>
          {isImage && (
            <p style={{ fontSize: 12, color: t.textMuted, margin: 0, lineHeight: 1.5 }}>
              Note: this is a stylized, deterministic SVG placeholder derived from your prompt — not a
              photorealistic AI image. The same prompt always renders the same art.
            </p>
          )}
        </Card>

        {/* output */}
        <div
          style={{
            background: t.surface,
            border: `1px solid ${active ? t.accent : t.border}`,
            borderRadius: 16,
            padding: 20,
            boxShadow: active ? `0 0 0 4px ${t.glow}, ${t.shadowSoft}` : t.shadowSoft,
            transition: "box-shadow .3s ease, border-color .3s ease",
            display: "flex",
            flexDirection: "column",
            minHeight: 320,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkles size={16} color={t.accent} />
              <span style={{ fontFamily: FONT_HEAD, fontSize: 15, fontWeight: 600, color: t.text }}>Output</span>
            </div>
            {hasOutput && !active && (
              <div style={{ display: "flex", gap: 8 }}>
                {!isImage && <Button t={t} small variant="outline" icon={Copy} onClick={copy}>Copy</Button>}
                <Button t={t} small variant="outline" icon={Download} onClick={download}>Download</Button>
              </div>
            )}
          </div>

          <div style={{ flex: 1, overflow: "auto" }}>
            {!hasOutput && !active && (
              <div
                style={{
                  height: "100%",
                  minHeight: 240,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: t.textMuted,
                  textAlign: "center",
                  gap: 10,
                }}
              >
                <Wand2 size={30} strokeWidth={1.6} />
                <span style={{ fontSize: 14 }}>Your generated {genType} will appear here.</span>
              </div>
            )}

            {imgLoading && (
              <div
                style={{
                  height: "100%",
                  minHeight: 240,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: t.textMuted,
                  gap: 14,
                }}
              >
                <span
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    border: `3px solid ${t.border}`,
                    borderTopColor: t.accent,
                    animation: "nanie-spin .8s linear infinite",
                  }}
                />
                <span style={{ fontSize: 14 }}>Rendering image…</span>
              </div>
            )}

            {isImage && svg && !imgLoading && (
              <div
                style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${t.border}`, lineHeight: 0 }}
                // deterministic, self-generated SVG string (safe)
                dangerouslySetInnerHTML={{ __html: svg.replace("<svg", '<svg style="width:100%;height:auto;display:block"') }}
              />
            )}

            {!isImage && (fullText || streaming) && (
              <pre
                style={{
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  fontFamily: genType === "code" ? FONT_MONO : FONT_BODY,
                  fontSize: genType === "code" ? 13 : 14,
                  lineHeight: 1.6,
                  color: t.text,
                }}
              >
                {shown}
                {streaming && (
                  <span
                    style={{
                      display: "inline-block",
                      width: 8,
                      height: 16,
                      marginLeft: 2,
                      verticalAlign: "text-bottom",
                      background: t.accent,
                      animation: "nanie-blink 1s step-end infinite",
                    }}
                  />
                )}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* =========================================================================
   PROMPT LIBRARY
   ========================================================================= */

function PromptModal({
  t,
  initial,
  onClose,
  onSave,
}: {
  t: Theme
  initial: Prompt | null
  onClose: () => void
  onSave: (data: { title: string; category: ContentType; body: string }) => void
}) {
  const [title, setTitle] = useState(initial?.title || "")
  const [category, setCategory] = useState<ContentType>(initial?.category || "blog")
  const [body, setBody] = useState(initial?.body || "")

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: t.overlay,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 900,
        padding: 20,
        backdropFilter: "blur(3px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 480,
          background: t.surface,
          border: `1px solid ${t.border}`,
          borderRadius: 18,
          padding: 24,
          boxShadow: t.shadow,
          animation: "nanie-fade-up .25s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <h3 style={{ fontFamily: FONT_HEAD, fontSize: 18, fontWeight: 600, color: t.text, margin: 0 }}>
            {initial ? "Edit prompt" : "New prompt"}
          </h3>
          <button type="button" aria-label="Close" onClick={onClose} style={{ background: "none", border: "none", color: t.textMuted, display: "flex" }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
          <Field t={t} label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Prompt title" />
          <div>
            <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: t.textMuted, marginBottom: 8 }}>Category</span>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
              {CONTENT_TYPES.map((ct) => {
                const on = category === ct.id
                return (
                  <button
                    key={ct.id}
                    type="button"
                    onClick={() => setCategory(ct.id)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "7px 12px",
                      fontSize: 13,
                      fontWeight: 600,
                      borderRadius: 9,
                      border: `1px solid ${on ? t.accent : t.border}`,
                      background: on ? `${t.accent}1a` : "transparent",
                      color: on ? t.accent : t.textMuted,
                    }}
                  >
                    <ct.icon size={14} />
                    {ct.label}
                  </button>
                )
              })}
            </div>
          </div>
          <div>
            <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: t.textMuted, marginBottom: 8 }}>Prompt body</span>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              placeholder="Write the prompt…"
              style={{
                width: "100%",
                padding: 12,
                fontSize: 14,
                lineHeight: 1.5,
                color: t.text,
                background: t.inputBg,
                border: `1px solid ${t.border}`,
                borderRadius: 10,
                outline: "none",
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 4 }}>
            <Button t={t} variant="ghost" onClick={onClose}>Cancel</Button>
            <Button t={t} icon={Save} onClick={() => onSave({ title: title.trim(), category, body: body.trim() })}>
              {initial ? "Save changes" : "Create prompt"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function PromptLibrary({
  t,
  prompts,
  addToast,
  addActivity,
  onUse,
  onCreate,
  onUpdate,
  onDelete,
}: {
  t: Theme
  prompts: Prompt[]
  addToast: (m: string, type?: Toast["type"]) => void
  addActivity: (m: string) => void
  onUse: (p: Prompt) => void
  onCreate: (d: { title: string; category: ContentType; body: string }) => void
  onUpdate: (id: string, d: { title: string; category: ContentType; body: string }) => void
  onDelete: (id: string) => void
}) {
  const [filter, setFilter] = useState<"all" | ContentType>("all")
  const [query, setQuery] = useState("")
  const [modal, setModal] = useState<{ open: boolean; editing: Prompt | null }>({ open: false, editing: null })

  const filtered = useMemo(() => {
    return prompts
      .filter((p) => (filter === "all" ? true : p.category === filter))
      .filter((p) =>
        query.trim()
          ? (p.title + " " + p.body).toLowerCase().includes(query.trim().toLowerCase())
          : true,
      )
      .sort((a, b) => b.updatedAt - a.updatedAt)
  }, [prompts, filter, query])

  const pills: ("all" | ContentType)[] = ["all", "blog", "email", "code", "social", "image"]

  const saveModal = (d: { title: string; category: ContentType; body: string }) => {
    if (!d.title || !d.body) {
      addToast("Title and body are required.", "error")
      return
    }
    if (modal.editing) {
      onUpdate(modal.editing.id, d)
      addToast("Prompt updated.", "success")
    } else {
      onCreate(d)
      addToast("Prompt created.", "success")
    }
    setModal({ open: false, editing: null })
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {pills.map((p) => {
            const on = filter === p
            return (
              <button
                key={p}
                type="button"
                onClick={() => setFilter(p)}
                style={{
                  padding: "7px 14px",
                  fontSize: 13,
                  fontWeight: 600,
                  borderRadius: 999,
                  border: `1px solid ${on ? t.accent : t.border}`,
                  background: on ? t.accent : t.surface,
                  color: on ? t.accentText : t.textMuted,
                  textTransform: "capitalize",
                  transition: "all .15s ease",
                }}
              >
                {p}
              </button>
            )
          })}
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <Search size={16} color={t.textMuted} style={{ position: "absolute", left: 11, top: 11 }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search prompts…"
              style={{
                padding: "9px 12px 9px 34px",
                fontSize: 13.5,
                color: t.text,
                background: t.inputBg,
                border: `1px solid ${t.border}`,
                borderRadius: 10,
                outline: "none",
                width: 180,
              }}
            />
          </div>
          <Button t={t} icon={Plus} onClick={() => setModal({ open: true, editing: null })}>
            New prompt
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card t={t} style={{ textAlign: "center", padding: 48 }}>
          <Library size={34} color={t.textMuted} strokeWidth={1.5} />
          <h3 style={{ fontFamily: FONT_HEAD, color: t.text, margin: "14px 0 6px", fontSize: 17 }}>No prompts found</h3>
          <p style={{ color: t.textMuted, fontSize: 14, margin: "0 0 16px" }}>
            {query || filter !== "all" ? "Try a different filter or search term." : "Create your first prompt to get started."}
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button t={t} icon={Plus} onClick={() => setModal({ open: true, editing: null })}>New prompt</Button>
          </div>
        </Card>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {filtered.map((p) => {
            const meta = CATEGORY_META[p.category]
            const Icon = meta.icon
            return (
              <Card key={p.id} t={t} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: `${t.accent}18`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={18} color={t.accent} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14.5, color: t.text }}>{p.title}</div>
                      <div style={{ fontSize: 11.5, color: t.textMuted, marginTop: 2 }}>Updated {timeAgo(p.updatedAt)}</div>
                    </div>
                  </div>
                  <Badge t={t}>{meta.label}</Badge>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: t.textMuted,
                    lineHeight: 1.5,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {p.body}
                </p>
                <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                  <Button t={t} small icon={Wand2} onClick={() => onUse(p)} style={{ flex: 1 }}>Use</Button>
                  <Button t={t} small variant="outline" icon={Pencil} ariaLabel="Edit" onClick={() => setModal({ open: true, editing: p })} />
                  <Button
                    t={t}
                    small
                    variant="danger"
                    icon={Trash2}
                    ariaLabel="Delete"
                    onClick={() => {
                      onDelete(p.id)
                      addToast("Prompt deleted.", "success")
                      addActivity(`Deleted prompt “${p.title}”`)
                    }}
                  />
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {modal.open && (
        <PromptModal t={t} initial={modal.editing} onClose={() => setModal({ open: false, editing: null })} onSave={saveModal} />
      )}
    </div>
  )
}

/* =========================================================================
   AUTOMATION
   ========================================================================= */

function Automation({
  t,
  workflows,
  setWorkflows,
  addToast,
  addActivity,
}: {
  t: Theme
  workflows: Workflow[]
  setWorkflows: React.Dispatch<React.SetStateAction<Workflow[]>>
  addToast: (m: string, type?: Toast["type"]) => void
  addActivity: (m: string) => void
}) {
  const [running, setRunning] = useState<string | null>(null)

  const runNow = (w: Workflow) => {
    if (!w.enabled) {
      addToast("Enable this workflow before running it.", "error")
      return
    }
    if (running) return
    setRunning(w.id)
    setTimeout(() => {
      setRunning(null)
      addToast(`“${w.title}” ran successfully.`, "success")
      addActivity(`Ran workflow “${w.title}” via ${w.provider}`)
    }, 1300)
  }

  const toggle = (w: Workflow) => {
    setWorkflows((prev) => prev.map((x) => (x.id === w.id ? { ...x, enabled: !x.enabled } : x)))
    addToast(`“${w.title}” ${w.enabled ? "disabled" : "enabled"}.`, "info")
    addActivity(`${w.enabled ? "Disabled" : "Enabled"} workflow “${w.title}”`)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <Card
        t={t}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          background: `linear-gradient(135deg, ${t.accent}12, ${t.accent2}12)`,
          borderColor: `${t.accent}40`,
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 12,
            background: `linear-gradient(135deg, ${t.accent}, ${t.accent2})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Zap size={22} color={t.accentText} strokeWidth={2.3} />
        </div>
        <div>
          <h3 style={{ fontFamily: FONT_HEAD, fontSize: 16.5, fontWeight: 600, color: t.text, margin: "0 0 4px" }}>
            Connected automations
          </h3>
          <p style={{ color: t.textMuted, fontSize: 13.5, margin: 0 }}>
            Your workflows run through <strong style={{ color: t.text }}>Zapier</strong> and{" "}
            <strong style={{ color: t.text }}>Power Automate</strong> (mock connections for this demo).
          </p>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {workflows.map((w) => {
          const Icon = w.icon
          const isRunning = running === w.id
          const providerColor = w.provider === "Zapier" ? "#FF4A00" : "#0066FF"
          return (
            <Card key={w.id} t={t} style={{ display: "flex", flexDirection: "column", gap: 14, opacity: w.enabled ? 1 : 0.7 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 11,
                    background: `${t.accent2}18`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={20} color={t.accent2} strokeWidth={2.2} />
                </div>
                <Toggle t={t} on={w.enabled} onChange={() => toggle(w)} ariaLabel={`Toggle ${w.title}`} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 600, fontSize: 15, color: t.text }}>{w.title}</span>
                  <Badge t={t} color={providerColor}>{w.provider}</Badge>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: t.textMuted, lineHeight: 1.5 }}>{w.description}</p>
              </div>
              <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 10 }}>
                <Button t={t} small icon={isRunning ? undefined : Play} onClick={() => runNow(w)} disabled={!w.enabled || isRunning}>
                  {isRunning ? (
                    <>
                      <span
                        style={{
                          width: 13,
                          height: 13,
                          borderRadius: "50%",
                          border: `2px solid ${t.accentText}`,
                          borderTopColor: "transparent",
                          animation: "nanie-spin .7s linear infinite",
                          display: "inline-block",
                        }}
                      />
                      Running…
                    </>
                  ) : (
                    "Run now"
                  )}
                </Button>
                <span style={{ fontSize: 12.5, color: w.enabled ? t.success : t.textMuted, fontWeight: 600 }}>
                  {w.enabled ? "Active" : "Disabled"}
                </span>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

/* =========================================================================
   SETTINGS
   ========================================================================= */

function SettingsView({
  t,
  mode,
  toggleTheme,
  user,
  setUser,
  prompts,
  workflows,
  addToast,
  addActivity,
  onLogout,
}: {
  t: Theme
  mode: Mode
  toggleTheme: () => void
  user: { name: string; email: string }
  setUser: (u: { name: string; email: string }) => void
  prompts: Prompt[]
  workflows: Workflow[]
  addToast: (m: string, type?: Toast["type"]) => void
  addActivity: (m: string) => void
  onLogout: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [notifEmail, setNotifEmail] = useState(true)
  const [notifProduct, setNotifProduct] = useState(false)
  const [pwOpen, setPwOpen] = useState(false)
  const [curPw, setCurPw] = useState("")
  const [newPw, setNewPw] = useState("")

  const activeWorkflows = workflows.filter((w) => w.enabled).length

  const saveAccount = () => {
    if (!name.trim() || !email.trim() || !email.includes("@")) {
      addToast("Enter a valid name and email.", "error")
      return
    }
    setUser({ name: name.trim(), email: email.trim() })
    setEditing(false)
    addToast("Account details saved.", "success")
    addActivity("Updated account information")
  }

  const changePw = () => {
    if (!curPw || !newPw) {
      addToast("Fill in both password fields.", "error")
      return
    }
    if (newPw.length < 6) {
      addToast("New password must be at least 6 characters.", "error")
      return
    }
    setCurPw("")
    setNewPw("")
    setPwOpen(false)
    addToast("Password changed.", "success")
    addActivity("Changed account password")
  }

  const initials = user.name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase()

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 18, alignItems: "start" }}>
      {/* account */}
      <Card t={t} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ fontFamily: FONT_HEAD, fontSize: 16, fontWeight: 600, color: t.text, margin: 0 }}>Account information</h3>
          {!editing ? (
            <Button t={t} small variant="outline" icon={Pencil} onClick={() => { setName(user.name); setEmail(user.email); setEditing(true) }}>Edit</Button>
          ) : null}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: `linear-gradient(135deg, ${t.accent}, ${t.accent2})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: FONT_HEAD,
              fontWeight: 700,
              fontSize: 20,
              color: t.accentText,
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          {!editing && (
            <div>
              <div style={{ fontWeight: 600, fontSize: 16, color: t.text }}>{user.name}</div>
              <div style={{ fontSize: 13.5, color: t.textMuted, marginTop: 2 }}>{user.email}</div>
            </div>
          )}
        </div>
        {editing && (
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <Field t={t} label="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Field t={t} label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <div style={{ display: "flex", gap: 10 }}>
              <Button t={t} icon={Save} onClick={saveAccount}>Save</Button>
              <Button t={t} variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </Card>

      {/* workspace */}
      <Card t={t} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <h3 style={{ fontFamily: FONT_HEAD, fontSize: 16, fontWeight: 600, color: t.text, margin: 0 }}>Workspace</h3>
        {[
          { label: "Saved prompts", value: prompts.length },
          { label: "Active workflows", value: activeWorkflows },
          { label: "Current plan", value: "Studio Pro" },
        ].map((row) => (
          <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${t.border}` }}>
            <span style={{ fontSize: 14, color: t.textMuted }}>{row.label}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{row.value}</span>
          </div>
        ))}
      </Card>

      {/* preferences */}
      <Card t={t} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <h3 style={{ fontFamily: FONT_HEAD, fontSize: 16, fontWeight: 600, color: t.text, margin: 0 }}>Preferences</h3>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: t.text }}>Appearance</div>
            <div style={{ fontSize: 12.5, color: t.textMuted, marginTop: 2 }}>{mode === "dark" ? "Dark" : "Light"} mode</div>
          </div>
          <Button t={t} small variant="outline" icon={mode === "dark" ? Sun : Moon} onClick={toggleTheme}>
            {mode === "dark" ? "Light" : "Dark"}
          </Button>
        </div>
        {[
          { label: "Email notifications", desc: "Product updates & digests", on: notifEmail, set: setNotifEmail },
          { label: "In-app announcements", desc: "New features & tips", on: notifProduct, set: setNotifProduct },
        ].map((n) => (
          <div key={n.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: t.text }}>{n.label}</div>
              <div style={{ fontSize: 12.5, color: t.textMuted, marginTop: 2 }}>{n.desc}</div>
            </div>
            <Toggle
              t={t}
              on={n.on}
              onChange={() => {
                n.set(!n.on)
                addToast(`${n.label} ${n.on ? "off" : "on"}.`, "info")
              }}
              ariaLabel={n.label}
            />
          </div>
        ))}
      </Card>

      {/* security */}
      <Card t={t} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <h3 style={{ fontFamily: FONT_HEAD, fontSize: 16, fontWeight: 600, color: t.text, margin: 0 }}>Security</h3>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Lock size={17} color={t.textMuted} />
            <span style={{ fontSize: 14, color: t.text }}>Change password</span>
          </div>
          <Button t={t} small variant="outline" onClick={() => setPwOpen((o) => !o)}>
            {pwOpen ? "Close" : "Change"}
          </Button>
        </div>
        {pwOpen && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Field t={t} label="Current password" type="password" value={curPw} onChange={(e) => setCurPw(e.target.value)} placeholder="••••••••" />
            <Field t={t} label="New password" type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="At least 6 characters" />
            <div style={{ display: "flex", gap: 10 }}>
              <Button t={t} icon={ShieldCheck} onClick={changePw}>Update password</Button>
            </div>
          </div>
        )}
        <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: t.text }}>Session</div>
              <div style={{ fontSize: 12.5, color: t.textMuted, marginTop: 2 }}>Sign out of NanieAI on this device</div>
            </div>
            <Button t={t} small variant="danger" icon={LogOut} onClick={onLogout}>Log out</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

/* =========================================================================
   APP SHELL — SIDEBAR + TOPBAR
   ========================================================================= */

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, title: "Dashboard", subtitle: "Your studio at a glance" },
  { id: "generator", label: "Content generator", icon: Wand2, title: "Content generator", subtitle: "Create content with AI" },
  { id: "library", label: "Prompt library", icon: Library, title: "Prompt library", subtitle: "Save, reuse & organize prompts" },
  { id: "automation", label: "Automation", icon: Zap, title: "Automation", subtitle: "Connect & run workflows" },
  { id: "settings", label: "Settings", icon: SettingsIcon, title: "Settings", subtitle: "Manage your account & workspace" },
] as const

function Sidebar({
  t,
  view,
  setView,
  user,
  open,
  onClose,
}: {
  t: Theme
  view: string
  setView: (v: string) => void
  user: { name: string; email: string }
  open: boolean
  onClose: () => void
}) {
  const initials = user.name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase()
  return (
    <>
      {open && (
        <div
          onClick={onClose}
          style={{ position: "fixed", inset: 0, background: t.overlay, zIndex: 80 }}
          className="nanie-sidebar-overlay"
        />
      )}
      <aside
        className={`nanie-sidebar${open ? " nanie-open" : ""}`}
        style={{
          width: 244,
          flexShrink: 0,
          background: t.surface,
          borderRight: `1px solid ${t.border}`,
          display: "flex",
          flexDirection: "column",
          padding: 18,
          height: "100vh",
          position: "sticky",
          top: 0,
        }}
      >
        <div style={{ padding: "4px 6px 22px" }}>
          <Logo t={t} size={30} />
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          {NAV.map((item) => {
            const on = view === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => { setView(item.id); onClose() }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                  padding: "11px 12px",
                  borderRadius: 11,
                  border: "none",
                  background: on ? `${t.accent}1a` : "transparent",
                  color: on ? t.accent : t.textMuted,
                  fontSize: 14,
                  fontWeight: on ? 600 : 500,
                  textAlign: "left",
                  transition: "background .15s ease, color .15s ease",
                }}
                onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = t.surface2 }}
                onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = "transparent" }}
              >
                <item.icon size={18} strokeWidth={2.1} />
                {item.label}
              </button>
            )
          })}
        </nav>
        <button
          type="button"
          onClick={() => { setView("settings"); onClose() }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 11,
            padding: 11,
            borderRadius: 12,
            border: `1px solid ${t.border}`,
            background: t.surface2,
            marginTop: 12,
            textAlign: "left",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: `linear-gradient(135deg, ${t.accent}, ${t.accent2})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: FONT_HEAD,
              fontWeight: 700,
              fontSize: 13,
              color: t.accentText,
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: t.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
            <div style={{ fontSize: 11.5, color: t.textMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</div>
          </div>
        </button>
      </aside>
    </>
  )
}

function TopBar({
  t,
  title,
  subtitle,
  mode,
  toggleTheme,
  user,
  onLogout,
  goSettings,
  onMenu,
}: {
  t: Theme
  title: string
  subtitle: string
  mode: Mode
  toggleTheme: () => void
  user: { name: string; email: string }
  onLogout: () => void
  goSettings: () => void
  onMenu: () => void
}) {
  const [menu, setMenu] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenu(false)
    }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])
  const initials = user.name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase()

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 14,
        padding: "16px 24px",
        borderBottom: `1px solid ${t.border}`,
        background: `${t.bg}cc`,
        backdropFilter: "blur(8px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
        <button
          type="button"
          aria-label="Menu"
          onClick={onMenu}
          className="nanie-menu-btn"
          style={{ display: "none", background: "none", border: "none", color: t.text, padding: 4 }}
        >
          <Menu size={22} />
        </button>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ fontFamily: FONT_HEAD, fontSize: 19, fontWeight: 700, color: t.text, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {title}
          </h1>
          <p style={{ fontSize: 13, color: t.textMuted, margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {subtitle}
          </p>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          type="button"
          aria-label="Toggle theme"
          onClick={toggleTheme}
          style={{
            width: 40,
            height: 40,
            borderRadius: 11,
            border: `1px solid ${t.border}`,
            background: t.surface,
            color: t.text,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background .2s ease",
          }}
        >
          {mode === "dark" ? <Sun size={19} /> : <Moon size={19} />}
        </button>
        <div style={{ position: "relative" }} ref={ref}>
          <button
            type="button"
            onClick={() => setMenu((m) => !m)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 8px 5px 5px",
              borderRadius: 11,
              border: `1px solid ${t.border}`,
              background: t.surface,
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: `linear-gradient(135deg, ${t.accent}, ${t.accent2})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONT_HEAD,
                fontWeight: 700,
                fontSize: 12,
                color: t.accentText,
              }}
            >
              {initials}
            </div>
            <ChevronDown size={16} color={t.textMuted} />
          </button>
          {menu && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 48,
                width: 200,
                background: t.surface2,
                border: `1px solid ${t.border}`,
                borderRadius: 12,
                boxShadow: t.shadow,
                padding: 6,
                animation: "nanie-fade-up .18s ease",
              }}
            >
              <div style={{ padding: "8px 10px", borderBottom: `1px solid ${t.border}`, marginBottom: 4 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: t.text }}>{user.name}</div>
                <div style={{ fontSize: 12, color: t.textMuted }}>{user.email}</div>
              </div>
              <button
                type="button"
                onClick={() => { setMenu(false); goSettings() }}
                style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "9px 10px", border: "none", background: "transparent", color: t.text, fontSize: 13.5, borderRadius: 8, textAlign: "left" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = t.surface)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <SettingsIcon size={16} /> Settings
              </button>
              <button
                type="button"
                onClick={() => { setMenu(false); onLogout() }}
                style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "9px 10px", border: "none", background: "transparent", color: t.danger, fontSize: 13.5, borderRadius: 8, textAlign: "left" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = t.surface)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <LogOut size={16} /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

/* =========================================================================
   ROOT APP
   ========================================================================= */

export default function NanieAI() {
  const [mode, setMode] = useState<Mode>("dark")
  const t = useMemo(() => getTheme(mode), [mode])

  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [view, setView] = useState("dashboard")

  const [prompts, setPrompts] = useState<Prompt[]>(initialPrompts)
  const [workflows, setWorkflows] = useState<Workflow[]>(initialWorkflows)
  const [activity, setActivity] = useState<Activity[]>([])
  const [contentCount, setContentCount] = useState(12)
  const [toasts, setToasts] = useState<Toast[]>([])

  const [genType, setGenType] = useState<ContentType>("blog")
  const [genPrompt, setGenPrompt] = useState("")

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const addToast = (message: string, type: Toast["type"] = "info") => {
    const id = uid()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 3200)
  }
  const dismissToast = (id: string) => setToasts((prev) => prev.filter((x) => x.id !== id))

  const addActivity = (text: string) => {
    setActivity((prev) => [{ id: uid(), text, at: Date.now() }, ...prev].slice(0, 40))
  }

  const login = (u: { name: string; email: string }) => {
    setUser(u)
    setView("dashboard")
    setActivity([{ id: uid(), text: `Signed in as ${u.name}`, at: Date.now() }])
    addToast(`Welcome, ${u.name.split(" ")[0]}!`, "success")
  }
  const logout = () => {
    setUser(null)
    setSidebarOpen(false)
    addToast("Signed out.", "info")
  }

  const toggleTheme = () => setMode((m) => (m === "dark" ? "light" : "dark"))

  // prompt CRUD
  const savePromptFromGenerator = (title: string, category: ContentType, body: string) => {
    setPrompts((prev) => [{ id: uid(), title, category, body, updatedAt: Date.now() }, ...prev])
    addActivity(`Saved prompt “${title}” to library`)
  }
  const createPrompt = (d: { title: string; category: ContentType; body: string }) => {
    setPrompts((prev) => [{ id: uid(), ...d, updatedAt: Date.now() }, ...prev])
    addActivity(`Created prompt “${d.title}”`)
  }
  const updatePrompt = (id: string, d: { title: string; category: ContentType; body: string }) => {
    setPrompts((prev) => prev.map((p) => (p.id === id ? { ...p, ...d, updatedAt: Date.now() } : p)))
    addActivity(`Edited prompt “${d.title}”`)
  }
  const deletePrompt = (id: string) => setPrompts((prev) => prev.filter((p) => p.id !== id))

  const usePrompt = (p: Prompt) => {
    setGenType(p.category)
    setGenPrompt(p.body)
    setView("generator")
    addToast(`Loaded “${p.title}” into generator.`, "info")
    addActivity(`Loaded prompt “${p.title}” into generator`)
  }

  const onContentGenerated = () => setContentCount((c) => c + 1)

  if (!user) {
    return (
      <>
        <GlobalStyles />
        <ResponsiveStyles t={t} />
        <div style={{ fontFamily: FONT_BODY, color: t.text }}>
          <LoginScreen t={t} onLogin={login} addToast={addToast} />
          <ToastStack t={t} toasts={toasts} dismiss={dismissToast} />
        </div>
      </>
    )
  }

  const nav = NAV.find((n) => n.id === view) || NAV[0]

  return (
    <>
      <GlobalStyles />
      <ResponsiveStyles t={t} />
      <div
        style={
          {
            fontFamily: FONT_BODY,
            color: t.text,
            backgroundColor: t.bg,
            minHeight: "100vh",
            display: "flex",
            transition: "background-color .3s ease, color .3s ease",
            // dot grid pattern behind the shell
            backgroundImage: `radial-gradient(${t.dot} 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
            "--glow": t.glow,
          } as React.CSSProperties
        }
      >
        <Sidebar t={t} view={view} setView={setView} user={user} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          <TopBar
            t={t}
            title={nav.title}
            subtitle={nav.subtitle}
            mode={mode}
            toggleTheme={toggleTheme}
            user={user}
            onLogout={logout}
            goSettings={() => setView("settings")}
            onMenu={() => setSidebarOpen(true)}
          />
          <main style={{ padding: 24, flex: 1, maxWidth: 1180, width: "100%", margin: "0 auto" }}>
            {view === "dashboard" && (
              <Dashboard
                t={t}
                user={user}
                prompts={prompts}
                workflows={workflows}
                activity={activity}
                contentCount={contentCount}
                go={setView}
              />
            )}
            {view === "generator" && (
              <Generator
                t={t}
                genType={genType}
                setGenType={setGenType}
                genPrompt={genPrompt}
                setGenPrompt={setGenPrompt}
                addToast={addToast}
                addActivity={addActivity}
                onSavePrompt={savePromptFromGenerator}
                onContentGenerated={onContentGenerated}
              />
            )}
            {view === "library" && (
              <PromptLibrary
                t={t}
                prompts={prompts}
                addToast={addToast}
                addActivity={addActivity}
                onUse={usePrompt}
                onCreate={createPrompt}
                onUpdate={updatePrompt}
                onDelete={deletePrompt}
              />
            )}
            {view === "automation" && (
              <Automation t={t} workflows={workflows} setWorkflows={setWorkflows} addToast={addToast} addActivity={addActivity} />
            )}
            {view === "settings" && (
              <SettingsView
                t={t}
                mode={mode}
                toggleTheme={toggleTheme}
                user={user}
                setUser={setUser}
                prompts={prompts}
                workflows={workflows}
                addToast={addToast}
                addActivity={addActivity}
                onLogout={logout}
              />
            )}
          </main>
        </div>
        <ToastStack t={t} toasts={toasts} dismiss={dismissToast} />
      </div>
    </>
  )
}

/* responsive helper styles that can't be inline */
function ResponsiveStyles({ t }: { t: Theme }) {
  return (
    <style>{`
      .nanie-sidebar-overlay { display: none; }
      @media (max-width: 860px) {
        .nanie-dash-grid { grid-template-columns: 1fr !important; }
        .nanie-gen-grid { grid-template-columns: 1fr !important; }
      }
      @media (max-width: 760px) {
        .nanie-sidebar {
          position: fixed !important;
          left: 0; top: 0;
          z-index: 90;
          transform: translateX(-105%);
          transition: transform .25s ease;
          box-shadow: ${t.shadow};
        }
        .nanie-sidebar.nanie-open { transform: translateX(0); }
        .nanie-sidebar-overlay { display: block !important; }
        .nanie-menu-btn { display: flex !important; }
      }
    `}</style>
  )
}
