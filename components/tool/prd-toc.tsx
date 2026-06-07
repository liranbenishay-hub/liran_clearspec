"use client";

import { useEffect, useState, useRef } from "react";

// ── TOC item definitions ───────────────────────────────────────────────────

export const TOC_ITEMS = [
  { key: "problemStatement", label: "Problem", short: "Problem" },
  { key: "targetUsers", label: "Target Users", short: "Users" },
  { key: "currentPain", label: "Current Pain", short: "Pain" },
  { key: "goals", label: "Goals", short: "Goals" },
  { key: "nonGoals", label: "Non-Goals", short: "Non-Goals" },
  { key: "kpis", label: "Success Metrics", short: "Metrics" },
  { key: "mvpBuild", label: "MVP Scope", short: "MVP" },
  { key: "userStories", label: "User Stories", short: "Stories" },
  { key: "edgeCases", label: "Edge Cases", short: "Edges" },
  { key: "businessImpact", label: "Business Impact", short: "Impact" },
  { key: "technicalConsiderations", label: "Technical", short: "Tech" },
  { key: "permissionsRoles", label: "Permissions", short: "Perms" },
  { key: "dependencies", label: "Dependencies", short: "Deps" },
  { key: "gtmEnablement", label: "GTM", short: "GTM" },
  { key: "qaChecklist", label: "QA Checklist", short: "QA" },
  { key: "rollout", label: "Rollout Plan", short: "Rollout" },
  { key: "risks", label: "Risks", short: "Risks" },
  { key: "openQuestions", label: "Open Questions", short: "Open Qs" },
] as const;

export type TOCKey = (typeof TOC_ITEMS)[number]["key"];

export type SectionState = "confirmed" | "ai" | "empty";

// ── Section scroll helper — scrolls within the PRD container ──────────────

export function scrollPRDToSection(key: string, containerId = "prd-scroll-container") {
  const el = document.getElementById(`prd-section-${key}`);
  const container = document.getElementById(containerId);
  if (!el || !container) {
    // Fallback: standard scroll
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  const containerRect = container.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  const scrollTop = container.scrollTop + (elRect.top - containerRect.top) - 72;
  container.scrollTo({ top: scrollTop, behavior: "smooth" });
}

// ── Active section tracker — watches the PRD scroll container ─────────────

function useActiveSection(
  keys: readonly string[],
  containerId = "prd-scroll-container"
): string {
  const [activeKey, setActiveKey] = useState<string>(keys[0] ?? "");

  useEffect(() => {
    if (keys.length === 0) return;

    // Wait a tick for the DOM to be ready
    const timeout = setTimeout(() => {
      const container = document.getElementById(containerId) ?? undefined;
      const elements = keys
        .map((key) => document.getElementById(`prd-section-${key}`))
        .filter(Boolean) as HTMLElement[];

      if (elements.length === 0) return;

      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          if (visible.length > 0) {
            const key = visible[0].target.id.replace("prd-section-", "");
            setActiveKey(key);
          }
        },
        {
          root: container,
          rootMargin: "-8% 0% -55% 0%",
          threshold: 0.05,
        }
      );

      elements.forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }, 200);

    return () => clearTimeout(timeout);
  }, [keys, containerId]);

  return activeKey;
}

// ── Vertical TOC (desktop workspace panel) ────────────────────────────────

interface VerticalTOCProps {
  visibleKeys: string[];
  sectionStates?: Partial<Record<string, SectionState>>;
  containerId?: string;
}

export function PRDTOCVertical({
  visibleKeys,
  sectionStates = {},
  containerId = "prd-scroll-container",
}: VerticalTOCProps) {
  const activeKey = useActiveSection(visibleKeys, containerId);
  const items = TOC_ITEMS.filter((item) => visibleKeys.includes(item.key));

  function stateIcon(key: string): { icon: string; color: string } {
    const state = sectionStates[key];
    if (state === "confirmed") return { icon: "✓", color: "text-green-500" };
    if (state === "ai") return { icon: "⚡", color: "text-amber-400" };
    return { icon: "○", color: "text-zinc-700" };
  }

  return (
    <nav className="flex flex-col py-3" aria-label="PRD sections">
      <p className="mb-2 px-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
        Sections
      </p>
      {items.map((item) => {
        const isActive = activeKey === item.key;
        const { icon, color } = stateIcon(item.key);
        return (
          <button
            key={item.key}
            onClick={() => scrollPRDToSection(item.key, containerId)}
            className={`
              flex items-center gap-2 px-3 py-1.5 text-left transition-colors duration-100 rounded-md mx-1
              ${isActive
                ? "bg-zinc-800 text-zinc-100"
                : "text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300"
              }
            `}
          >
            <span className={`shrink-0 font-mono text-[10px] w-3 ${isActive ? "text-blue-400" : color}`}>
              {isActive ? "▸" : icon}
            </span>
            <span className="font-mono text-[11px] leading-tight truncate">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ── Horizontal TOC (mobile sticky strip) ─────────────────────────────────

interface HorizontalTOCProps {
  visibleKeys: string[];
  containerId?: string;
}

export function PRDTOCHorizontal({
  visibleKeys,
  containerId,
}: HorizontalTOCProps) {
  // On mobile the body scrolls, so root = viewport (undefined)
  const activeKey = useActiveSection(visibleKeys, containerId ?? "");
  const scrollRef = useRef<HTMLDivElement>(null);
  const items = TOC_ITEMS.filter((item) => visibleKeys.includes(item.key));

  useEffect(() => {
    if (!scrollRef.current || !activeKey) return;
    const el = scrollRef.current.querySelector(`[data-key="${activeKey}"]`) as HTMLElement | null;
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeKey]);

  return (
    <div className="border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-sm">
      <div
        ref={scrollRef}
        className="scrollbar-none flex items-center gap-1.5 overflow-x-auto px-4 py-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <span className="mr-1 shrink-0 font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
          Jump:
        </span>
        {items.map((item) => {
          const isActive = activeKey === item.key;
          return (
            <button
              key={item.key}
              data-key={item.key}
              onClick={() => scrollPRDToSection(item.key, containerId ?? "")}
              className={`
                shrink-0 rounded-full border px-2.5 py-1 font-mono text-[10px] whitespace-nowrap transition-colors
                ${isActive
                  ? "border-zinc-500 bg-zinc-800 text-zinc-100"
                  : "border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
                }
              `}
            >
              {item.short}
            </button>
          );
        })}
      </div>
    </div>
  );
}
