"use client";

import { useEffect, useState, useRef } from "react";

// ── TOC item definitions ───────────────────────────────────────────────────

export const TOC_ITEMS = [
  { key: "problemStatement", label: "Problem", short: "Prob." },
  { key: "targetUsers", label: "Users", short: "Users" },
  { key: "currentPain", label: "Pain", short: "Pain" },
  { key: "goals", label: "Goals", short: "Goals" },
  { key: "nonGoals", label: "Non-goals", short: "Non-g." },
  { key: "kpis", label: "Metrics", short: "KPIs" },
  { key: "mvpBuild", label: "MVP Scope", short: "MVP" },
  { key: "userStories", label: "User Stories", short: "Stories" },
  { key: "edgeCases", label: "Edge Cases", short: "Edges" },
  { key: "businessImpact", label: "Business Impact", short: "Impact" },
  { key: "technicalConsiderations", label: "Technical", short: "Tech" },
  { key: "permissionsRoles", label: "Permissions", short: "Perms" },
  { key: "dependencies", label: "Dependencies", short: "Deps" },
  { key: "gtmEnablement", label: "GTM", short: "GTM" },
  { key: "qaChecklist", label: "QA", short: "QA" },
  { key: "rollout", label: "Rollout", short: "Roll." },
  { key: "risks", label: "Risks", short: "Risks" },
  { key: "openQuestions", label: "Open Questions", short: "Open Qs" },
] as const;

export type TOCKey = (typeof TOC_ITEMS)[number]["key"];

// ── Shared hook for active section tracking ────────────────────────────────

function useActiveSection(keys: readonly string[]): string {
  const [activeKey, setActiveKey] = useState<string>(keys[0] ?? "");

  useEffect(() => {
    const elements = keys
      .map((key) => document.getElementById(`prd-section-${key}`))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible entry
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          const key = visible[0].target.id.replace("prd-section-", "");
          setActiveKey(key);
        }
      },
      { rootMargin: "-15% 0% -55% 0%", threshold: 0.1 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [keys]);

  return activeKey;
}

// ── Scroll helper ──────────────────────────────────────────────────────────

function scrollToSection(key: string) {
  const el = document.getElementById(`prd-section-${key}`);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ── Vertical TOC (desktop) ─────────────────────────────────────────────────

interface VerticalTOCProps {
  visibleKeys: string[];
}

export function PRDTOCVertical({ visibleKeys }: VerticalTOCProps) {
  const activeKey = useActiveSection(visibleKeys);
  const items = TOC_ITEMS.filter((item) => visibleKeys.includes(item.key));

  return (
    <nav
      className="sticky top-4 flex flex-col gap-0.5 max-h-[calc(100vh-6rem)] overflow-y-auto pb-4"
      aria-label="PRD sections"
    >
      <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-600 px-2">
        Sections
      </p>
      {items.map((item) => {
        const isActive = activeKey === item.key;
        return (
          <button
            key={item.key}
            onClick={() => scrollToSection(item.key)}
            className={`
              flex items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors duration-100
              ${isActive
                ? "bg-zinc-800 text-zinc-100"
                : "text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300"
              }
            `}
          >
            {/* Active indicator dot */}
            <span className={`flex h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${isActive ? "bg-blue-400" : "bg-transparent"}`} />
            <span className="font-mono text-[11px] leading-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ── Horizontal TOC (tablet / mobile) ─────────────────────────────────────

interface HorizontalTOCProps {
  visibleKeys: string[];
}

export function PRDTOCHorizontal({ visibleKeys }: HorizontalTOCProps) {
  const activeKey = useActiveSection(visibleKeys);
  const scrollRef = useRef<HTMLDivElement>(null);
  const items = TOC_ITEMS.filter((item) => visibleKeys.includes(item.key));

  // Auto-scroll the active item into view in the horizontal bar
  useEffect(() => {
    if (!scrollRef.current || !activeKey) return;
    const activeEl = scrollRef.current.querySelector(`[data-key="${activeKey}"]`) as HTMLElement | null;
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeKey]);

  return (
    <div className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-sm">
      <div
        ref={scrollRef}
        className="flex items-center gap-1.5 overflow-x-auto px-4 py-2 scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <span className="shrink-0 font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-600 mr-1">
          Jump:
        </span>
        {items.map((item) => {
          const isActive = activeKey === item.key;
          return (
            <button
              key={item.key}
              data-key={item.key}
              onClick={() => scrollToSection(item.key)}
              className={`
                shrink-0 rounded-full border px-2.5 py-1 font-mono text-[10px] transition-colors whitespace-nowrap
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
