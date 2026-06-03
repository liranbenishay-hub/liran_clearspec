"use client";

import { useState } from "react";
import type { ToolState } from "@/lib/types";

// ── PRD generation helpers ────────────────────────────────────────────────────

function extractUserType(state: ToolState): string {
  const combined = `${state.problemStatement} ${state.operationalPain}`.toLowerCase();
  const types: Record<string, string> = {
    partner: "ISO partner",
    merchant: "merchant",
    admin: "admin",
    manager: "manager",
    operator: "operator",
    customer: "customer",
    client: "client",
    agent: "agent",
    team: "team",
    user: "user",
  };
  for (const [key, label] of Object.entries(types)) {
    if (combined.includes(key)) return label;
  }
  return "user";
}

function generateUserStories(state: ToolState): string[] {
  const userType = extractUserType(state);
  const metric = state.successMetric || "the stated success metric";
  const scope = state.buildNow.split("\n")[0] || "the MVP scope";

  return [
    `As a ${userType}, I want to resolve the problem described in the problem statement, so that the current manual workaround is no longer necessary.`,
    `As a ${userType}, I want ${scope.toLowerCase().replace(/^build now:?\s*/i, "").slice(0, 80)}, so that ${metric.toLowerCase().slice(0, 80)}.`,
    `As a ${userType}, I want a clear error state or fallback when the happy path fails, so that I know what action to take next.`,
  ];
}

function generateQAChecklist(state: ToolState): string[] {
  const items: string[] = [
    `Verify the MVP scope works end-to-end in a staging environment before release`,
    `Confirm deferred Phase 2 scope does NOT appear or partially appear in this release`,
    `Validate that the success metric "${state.successMetric || "stated metric"}" can be tracked from day one`,
    `Test the rejected approach path is blocked or unavailable`,
    `Test primary user flow on mobile (375px, 390px viewports)`,
    `Verify all error states have a clear user-facing message and a recovery path`,
  ];

  state.openQuestions
    .filter((q) => q.question.trim())
    .forEach((q) => {
      items.push(`Confirm resolved before release: ${q.question}`);
    });

  return items;
}

function generateRolloutPlan(state: ToolState): string[] {
  return [
    `Phase 1 — Internal / pilot: Ship MVP scope to a limited internal group or 1–2 pilot users. Gate behind a feature flag.`,
    `Phase 2 — Validation: Monitor "${state.successMetric || "the success metric"}" over 2–4 weeks. Baseline pre-launch, compare post-launch.`,
    `Phase 3 — Scale: Address deferred Phase 2 scope: ${state.deferToPhase2.slice(0, 120) || "items identified during MVP planning"}.`,
  ];
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ── PRD text export (for clipboard) ──────────────────────────────────────────

function buildPRDText(state: ToolState): string {
  const userStories = generateUserStories(state);
  const qaChecklist = generateQAChecklist(state);
  const rollout = generateRolloutPlan(state);
  const userType = extractUserType(state);

  return [
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    `PRODUCT SPEC: ${state.productTitle || "Untitled Feature"}`,
    formatDate(),
    "Generated with Clearspec · clearspec.pm",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "",
    "PROBLEM STATEMENT",
    state.problemStatement,
    "",
    "TARGET USERS",
    `Primary: ${userType}`,
    `Context: ${state.operationalPain.slice(0, 200)}`,
    "",
    "CURRENT PAIN",
    state.operationalPain,
    "",
    "WHAT THEY DO INSTEAD",
    state.currentWorkaround,
    "",
    "GOALS",
    `Move the metric: ${state.successMetric}`,
    "",
    "NON-GOALS",
    state.deferToPhase2,
    "",
    "MVP SCOPE",
    state.buildNow,
    "",
    "USER STORIES",
    ...userStories.map((s, i) => `${i + 1}. ${s}`),
    "",
    "SUCCESS METRICS",
    state.successMetric,
    "",
    "TRADEOFFS",
    `Chosen approach gives up: ${state.chosenApproachGivesUp}`,
    `Rejected alternative: ${state.rejectedApproach}`,
    `Rejected alternative would have given up: ${state.rejectedApproachGivesUp}`,
    "",
    "RISKS AND ASSUMPTIONS",
    `Risk: The rejected approach (${state.rejectedApproach.slice(0, 80)}) remains viable if the chosen approach fails.`,
    `Assumption: MVP scope covers the majority of the use case without the deferred scope.`,
    "",
    "QA CHECKLIST",
    ...qaChecklist.map((item) => `□ ${item}`),
    "",
    "ROLLOUT PLAN",
    ...rollout.map((item) => `— ${item}`),
    "",
    "OPEN QUESTIONS",
    ...state.openQuestions
      .filter((q) => q.question.trim())
      .map((q) => `□ ${q.question} — Owner: ${q.owner || "Unassigned"}`),
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "Clearspec · clearspec.pm · The PM Operating System, Built in Public.",
  ].join("\n");
}

// ── Component ─────────────────────────────────────────────────────────────────

interface PRDOutputProps {
  state: ToolState;
}

export default function PRDOutput({ state }: PRDOutputProps) {
  const [copied, setCopied] = useState(false);

  const userStories = generateUserStories(state);
  const qaChecklist = generateQAChecklist(state);
  const rolloutPlan = generateRolloutPlan(state);
  const userType = extractUserType(state);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildPRDText(state));
    } catch {
      const ta = document.createElement("textarea");
      ta.value = buildPRDText(state);
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      {/* Actions */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-medium text-zinc-700 ring-1 ring-zinc-200 transition-colors hover:ring-zinc-400"
        >
          {copied ? (
            <><svg className="h-3.5 w-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Copied</>
          ) : (
            <><svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>Copy PRD</>
          )}
        </button>
        <a
          href="/products/prd-critic"
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
        >
          Review with PRD Critic →
        </a>
      </div>

      {/* Document */}
      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-xl">
        {/* Chrome */}
        <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
          <div className="h-3 w-3 rounded-full bg-zinc-700" />
          <div className="h-3 w-3 rounded-full bg-zinc-700" />
          <div className="h-3 w-3 rounded-full bg-zinc-700" />
          <span className="ml-3 font-mono text-xs text-zinc-500">
            {state.productTitle ? `${state.productTitle.toLowerCase().replace(/\s+/g, "-")}.md` : "product-spec.md"}
          </span>
        </div>

        {/* PRD Content */}
        <div className="decision-record overflow-x-auto p-5 text-zinc-300 sm:p-7">
          <div className="min-w-[280px] space-y-7">

            {/* Header */}
            <div>
              <div className="text-zinc-700 text-xs">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
              <div className="mt-2 text-base font-bold text-zinc-100">
                PRODUCT SPEC{state.productTitle ? `: ${state.productTitle.toUpperCase()}` : ""}
              </div>
              <div className="mt-1 text-xs text-zinc-500">{formatDate()} · Generated with Clearspec</div>
              <div className="mt-2 text-zinc-700 text-xs">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
            </div>

            <PRDSection label="PROBLEM STATEMENT">{state.problemStatement}</PRDSection>

            <PRDSection label="TARGET USERS">
              <div className="space-y-1">
                <div><span className="text-zinc-500">Primary: </span><span>{userType}</span></div>
                <div className="text-zinc-400 text-xs mt-1">Derived from operational pain context</div>
              </div>
            </PRDSection>

            <PRDSection label="CURRENT PAIN">
              {state.operationalPain}
              {state.currentWorkaround && (
                <div className="mt-3">
                  <span className="text-zinc-500">What they do instead: </span>
                  <span>{state.currentWorkaround}</span>
                </div>
              )}
            </PRDSection>

            <div className="border-t border-zinc-800" />

            <PRDSection label="GOALS">
              <div className="flex items-start gap-2">
                <span className="text-zinc-500">Move the metric:</span>
                <span className="text-zinc-200">{state.successMetric}</span>
              </div>
            </PRDSection>

            <PRDSection label="NON-GOALS">
              {state.deferToPhase2}
              <div className="mt-1 text-zinc-500 text-xs">Phase 2 — committed, not abandoned</div>
            </PRDSection>

            <PRDSection label="MVP SCOPE">
              <div className="mb-3">
                <span className="text-green-400 text-xs">✓ Build now</span>
                <div className="mt-1">{state.buildNow}</div>
              </div>
              <div>
                <span className="text-zinc-500 text-xs">○ Phase 2 (deferred)</span>
                <div className="mt-1 text-zinc-400">{state.deferToPhase2}</div>
              </div>
            </PRDSection>

            <div className="border-t border-zinc-800" />

            <PRDSection label="USER STORIES">
              <div className="space-y-2">
                {userStories.map((story, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-zinc-600 shrink-0">{i + 1}.</span>
                    <span>{story}</span>
                  </div>
                ))}
                <div className="text-zinc-600 text-xs mt-1">Generated from problem and pain inputs</div>
              </div>
            </PRDSection>

            <PRDSection label="SUCCESS METRICS">
              {state.successMetric}
            </PRDSection>

            <div className="border-t border-zinc-800" />

            <PRDSection label="TRADEOFFS">
              <div className="space-y-2">
                <div><span className="text-zinc-500">Chosen approach gives up: </span>{state.chosenApproachGivesUp}</div>
                <div><span className="text-zinc-500">Rejected alternative: </span>{state.rejectedApproach}</div>
                <div><span className="text-zinc-500">Rejected would have given up: </span>{state.rejectedApproachGivesUp}</div>
              </div>
            </PRDSection>

            <PRDSection label="RISKS AND ASSUMPTIONS">
              <div className="space-y-1">
                <div><span className="text-zinc-500">Risk: </span>The rejected approach remains viable if the chosen path fails or is blocked.</div>
                <div><span className="text-zinc-500">Assumption: </span>MVP scope covers the majority of the use case without the deferred Phase 2 scope.</div>
              </div>
            </PRDSection>

            <div className="border-t border-zinc-800" />

            <PRDSection label="QA CHECKLIST">
              <div className="space-y-1.5">
                {qaChecklist.map((item, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-zinc-600 shrink-0">□</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </PRDSection>

            <PRDSection label="ROLLOUT PLAN">
              <div className="space-y-2">
                {rolloutPlan.map((item, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-zinc-600 shrink-0">—</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </PRDSection>

            <PRDSection label="OPEN QUESTIONS">
              <div className="space-y-2">
                {state.openQuestions
                  .filter((q) => q.question.trim())
                  .map((q, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-zinc-600 shrink-0">□</span>
                      <div>
                        <span>{q.question}</span>
                        <span className="text-zinc-500"> — Owner: {q.owner || "Unassigned"}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </PRDSection>

            {/* Footer */}
            <div>
              <div className="text-zinc-700 text-xs">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
              <div className="mt-2 text-xs text-zinc-600">
                Generated with Clearspec · clearspec.pm
                <br />
                The PM Operating System, Built in Public.
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-component ─────────────────────────────────────────────────────────────

function PRDSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
        {label}
      </div>
      <div className="text-xs leading-relaxed text-zinc-300 sm:text-sm">{children}</div>
    </div>
  );
}
