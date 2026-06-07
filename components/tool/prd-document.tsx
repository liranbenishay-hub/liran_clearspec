"use client";

import { useState } from "react";
import type { PRDEnrichmentData } from "@/lib/pm-enrichment";

// ── Types ─────────────────────────────────────────────────────────────────────

type Source = "ai" | "user";

interface SectionConfig {
  key: keyof PRDEnrichmentData;
  label: string;
  icon: string;
  type: "text" | "list" | "scope" | "stories";
}

const SECTIONS: SectionConfig[] = [
  { key: "problemStatement", label: "Problem Statement", icon: "🎯", type: "text" },
  { key: "targetUsers", label: "Target Users", icon: "👥", type: "text" },
  { key: "currentPain", label: "Current Pain", icon: "💢", type: "text" },
  { key: "goals", label: "Goals", icon: "✅", type: "list" },
  { key: "nonGoals", label: "Non-Goals", icon: "🚫", type: "list" },
  { key: "kpis", label: "Success Metrics / KPIs", icon: "📊", type: "list" },
  { key: "mvpBuild", label: "MVP Scope", icon: "📦", type: "scope" },
  { key: "userStories", label: "User Stories", icon: "📝", type: "stories" },
  { key: "edgeCases", label: "Edge Cases", icon: "⚠️", type: "list" },
  { key: "businessImpact", label: "Business Impact", icon: "📈", type: "text" },
  { key: "technicalConsiderations", label: "Technical Considerations", icon: "⚙️", type: "text" },
  { key: "permissionsRoles", label: "Permissions & Roles", icon: "🔐", type: "text" },
  { key: "dependencies", label: "Dependencies", icon: "🔗", type: "text" },
  { key: "gtmEnablement", label: "GTM & Enablement", icon: "📢", type: "text" },
  { key: "qaChecklist", label: "QA Checklist", icon: "🧪", type: "list" },
  { key: "rollout", label: "Rollout Plan", icon: "🚀", type: "text" },
  { key: "risks", label: "Risks & Assumptions", icon: "⚖️", type: "list" },
  { key: "openQuestions", label: "Open Questions", icon: "❓", type: "list" },
];

interface PRDDocumentProps {
  prd: PRDEnrichmentData;
  sources: Partial<Record<keyof PRDEnrichmentData, Source>>;
  flashKeys: Partial<Record<keyof PRDEnrichmentData, number>>;
  completeness: number;
  onCopy: () => void;
  copied: boolean;
}

/** Returns the keys of PRD sections that have non-empty content — used by the TOC */
export function getVisiblePRDKeys(prd: PRDEnrichmentData): string[] {
  return SECTIONS
    .filter((s) => {
      const v = prd[s.key];
      if (!v) return false;
      if (Array.isArray(v)) return (v as string[]).filter(Boolean).length > 0;
      return String(v).trim().length > 0;
    })
    .map((s) => s.key);
}

// ── Source badge ──────────────────────────────────────────────────────────────

function SourceBadge({ source }: { source: Source }) {
  if (source === "user") return (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-900/40 px-2 py-0.5 font-mono text-[9px] font-semibold text-green-400 border border-green-800/50">
      ✓ confirmed
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-900/30 px-2 py-0.5 font-mono text-[9px] font-semibold text-amber-400 border border-amber-800/40">
      ⚡ AI suggested
    </span>
  );
}

// ── Section card ──────────────────────────────────────────────────────────────

function SectionCard({
  config,
  prd,
  source,
  flashing,
}: {
  config: SectionConfig;
  prd: PRDEnrichmentData;
  source: Source;
  flashing: boolean;
}) {
  const value = prd[config.key];

  // Skip empty optional sections
  const isEmpty = !value || (Array.isArray(value) && value.filter(Boolean).length === 0) ||
    (typeof value === "string" && !value.trim());
  if (isEmpty) return null;

  return (
    <div
      id={`prd-section-${config.key}`}
      className={`rounded-xl border bg-zinc-900/70 transition-all duration-500 ${
        flashing
          ? "border-green-700/60 shadow-[0_0_12px_0_rgba(34,197,94,0.15)]"
          : "border-zinc-800"
      }`}
    >
      {/* Section header */}
      <div className="flex items-center gap-2.5 border-b border-zinc-800 px-4 py-3">
        <span className="text-base leading-none">{config.icon}</span>
        <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
          {config.label}
        </span>
        <div className="ml-auto">
          <SourceBadge source={source} />
        </div>
      </div>

      {/* Section content */}
      <div className="px-4 py-4">
        {config.type === "text" && (
          <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-200">
            {String(value)}
          </p>
        )}

        {config.type === "list" && Array.isArray(value) && (
          <ul className="space-y-2">
            {(value as string[]).filter(Boolean).map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-200">
                <span className="mt-0.5 shrink-0 text-zinc-600">□</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        )}

        {config.type === "scope" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-green-500">
                ✓ Build now
              </p>
              <ul className="space-y-2">
                {prd.mvpBuild.filter(Boolean).map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-200">
                    <span className="mt-0.5 shrink-0 text-zinc-600">—</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                ○ Phase 2 (committed)
              </p>
              <ul className="space-y-2">
                {prd.mvpDefer.filter(Boolean).map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-500">
                    <span className="mt-0.5 shrink-0 text-zinc-700">—</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {config.type === "stories" && Array.isArray(value) && (
          <ol className="space-y-3">
            {(value as string[]).filter(Boolean).map((story, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-zinc-700 font-mono text-[10px] font-semibold text-zinc-500">
                  {i + 1}
                </span>
                <span className="leading-relaxed text-zinc-200">{story}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

// ── PRD Document ──────────────────────────────────────────────────────────────

export default function PRDDocument({
  prd,
  sources,
  flashKeys,
  completeness,
  onCopy,
  copied,
}: PRDDocumentProps) {
  const [expandAll, setExpandAll] = useState(false);

  const getSource = (key: keyof PRDEnrichmentData): Source => sources[key] ?? "ai";

  function buildCopyText(): string {
    return SECTIONS.flatMap((s) => {
      const value = prd[s.key];
      if (!value || (Array.isArray(value) && !value.filter(Boolean).length)) return [];
      const content = Array.isArray(value)
        ? (value as string[]).filter(Boolean).map((v) => `□ ${v}`).join("\n")
        : String(value);
      return [`${s.label.toUpperCase()}`, content, ""];
    }).join("\n");
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={onCopy}
          className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-medium text-zinc-700 ring-1 ring-zinc-200 transition-colors hover:ring-zinc-400"
        >
          {copied ? (
            <><svg className="h-3.5 w-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Copied</>
          ) : (
            <><svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>Copy PRD</>
          )}
        </button>
        <a
          href="/products/prd-critic"
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-4 py-2 text-xs font-medium text-zinc-300 transition-colors hover:text-white"
        >
          Review with PRD Critic →
        </a>
        <div className="ml-auto flex items-center gap-2 text-xs text-zinc-500">
          <span className="font-mono text-[10px] text-zinc-600">
            {SECTIONS.filter((s) => {
              const v = prd[s.key];
              return v && !(Array.isArray(v) && !v.filter(Boolean).length) && !(typeof v === "string" && !v.trim());
            }).length} sections
          </span>
        </div>
      </div>

      {/* Completeness bar */}
      <div className="mb-5 flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2.5">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-zinc-500 whitespace-nowrap">
          PRD Completeness
        </span>
        <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-zinc-400 transition-all duration-500"
            style={{ width: `${completeness}%` }}
          />
        </div>
        <span className={`font-mono text-sm font-semibold tabular-nums whitespace-nowrap ${completeness === 100 ? "text-green-400" : "text-zinc-300"}`}>
          {completeness}%
        </span>
        {completeness === 100 && (
          <span className="font-mono text-[10px] text-green-500">✓ complete</span>
        )}
      </div>

      {/* Document */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl">
        {/* Doc header */}
        <div className="border-b border-zinc-800 bg-zinc-900/80 px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-1">
                Product Spec
              </p>
              <h3 className="text-base font-semibold text-zinc-100">
                {prd.productTitle || "Untitled Feature"}
              </h3>
            </div>
            <div className="text-right shrink-0">
              <p className="font-mono text-[10px] text-zinc-600">
                {new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
              </p>
              <p className="font-mono text-[10px] text-zinc-700">Clearspec · clearspec.pm</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 border-b border-zinc-800 bg-zinc-900/40 px-5 py-2">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[9px] text-amber-400">⚡</span>
            <span className="text-[10px] text-zinc-600">AI suggested — review before sharing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[9px] text-green-400">✓</span>
            <span className="text-[10px] text-zinc-600">Your words — confirmed</span>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-3 p-4 sm:p-5">
          {SECTIONS.map((section) => (
            <SectionCard
              key={section.key}
              config={section}
              prd={prd}
              source={getSource(section.key)}
              flashing={(flashKeys[section.key] ?? 0) > 0}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-800 px-5 py-3">
          <p className="text-center font-mono text-[10px] text-zinc-700">
            Generated with Clearspec · clearspec.pm · The PM Operating System, Built in Public
          </p>
        </div>
      </div>
    </div>
  );
}
