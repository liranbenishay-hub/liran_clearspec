"use client";

import type { ToolState } from "@/lib/types";

export interface AnswerIssue {
  stepLabel: string;
  stepNumber: number;
  issue: string;
  why: string;
  suggestion: string;
  priority: "high" | "medium" | "low";
}

// ── Rule engine ───────────────────────────────────────────────────────────────
// All rules are front-end only. No AI backend.

const SOLUTION_WORDS = ["add", "build", "create", "implement", "develop", "make a", "button", "feature", "page", "screen", "modal", "widget"];
const VAGUE_WORDS = ["some", "many", "a lot", "often", "sometimes", "few", "several", "various", "better", "more", "improve", "nicer"];
const USER_TYPES = ["user", "customer", "partner", "merchant", "admin", "manager", "team", "operator", "client", "buyer", "seller", "agent"];

function wordCount(s: string) {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

function hasWord(s: string, words: string[]) {
  const lower = s.toLowerCase();
  return words.some((w) => lower.includes(w));
}

export function analyseAnswers(state: ToolState): AnswerIssue[] {
  const issues: AnswerIssue[] = [];

  // ── Step 1: Product title ─────────────────────────────────────────────────
  if (state.productTitle.trim().length < 3) {
    issues.push({
      stepLabel: "Product Title",
      stepNumber: 1,
      issue: "No product name provided",
      why: "A unnamed PRD is harder to reference in meetings and harder to track across Jira and Confluence.",
      suggestion: 'Give it a working name. It does not need to be final. e.g. "Merchant Search V1" or "Partner Webhook Config".',
      priority: "low",
    });
  }

  // ── Step 2: Problem Statement ─────────────────────────────────────────────
  const prob = state.problemStatement;

  if (wordCount(prob) < 20 && prob.trim().length > 0) {
    issues.push({
      stepLabel: "Problem Statement",
      stepNumber: 2,
      issue: "Answer is too brief",
      why: "A vague problem statement produces a vague spec. Engineering and design need enough context to understand the scope of the problem.",
      suggestion: "Expand with: who is affected, what they are trying to accomplish, and what specifically fails or breaks today.",
      priority: "high",
    });
  }

  if (hasWord(prob, SOLUTION_WORDS)) {
    issues.push({
      stepLabel: "Problem Statement",
      stepNumber: 2,
      issue: "Problem is framed as a solution",
      why: "Starting with a solution limits discovery. The team will build what you described, not necessarily what solves the real problem.",
      suggestion: 'Remove any mention of what to build. Describe the situation the user is in and why it is painful. e.g. Instead of "add a search bar", write "users cannot locate specific accounts without scrolling through hundreds of records".',
      priority: "high",
    });
  }

  // ── Step 3: Operational Pain ──────────────────────────────────────────────
  const pain = state.operationalPain;

  if (wordCount(pain) < 15 && pain.trim().length > 0) {
    issues.push({
      stepLabel: "Operational Pain",
      stepNumber: 3,
      issue: "Pain is not specific enough",
      why: "The operational pain section is the most important input for the PRD. If it is vague, the problem statement will be too abstract to justify the build.",
      suggestion: 'Be specific: who is calling whom, how many times per week, how long does it take, what is the manual step they are doing instead? e.g. "Partners with 200+ merchants spend 3+ hours per week manually navigating each record."',
      priority: "high",
    });
  }

  if (!hasWord(pain, USER_TYPES) && pain.trim().length > 0) {
    issues.push({
      stepLabel: "Operational Pain",
      stepNumber: 3,
      issue: "No user type identified",
      why: "Without a named user type, the PRD cannot generate accurate user stories or target user sections.",
      suggestion: 'Name who is suffering. e.g. "ISO partners", "compliance operators", "finance teams", "merchant admins". Be specific — different user types have different pain levels and workarounds.',
      priority: "medium",
    });
  }

  if (hasWord(pain, VAGUE_WORDS)) {
    issues.push({
      stepLabel: "Operational Pain",
      stepNumber: 3,
      issue: "Vague language detected",
      why: 'Words like "many", "often", or "some" make it impossible to quantify the problem or set a meaningful success metric.',
      suggestion: 'Replace vague quantities with real ones. "Many support tickets" → "~30 support tickets per week". "Often slow" → "3+ minutes per transaction".',
      priority: "medium",
    });
  }

  // ── Step 5: Success Metric ────────────────────────────────────────────────
  const metric = state.successMetric;

  if (metric.trim().length > 0 && !metric.match(/\d/) && !metric.includes("%")) {
    issues.push({
      stepLabel: "Success Metric",
      stepNumber: 5,
      issue: "Metric has no measurable target",
      why: "A metric without a number is a direction, not a metric. You cannot declare success or failure without a baseline and a target.",
      suggestion: 'Add a number and a timeframe. e.g. "Reduce settlement-related support tickets by 40% within 90 days of launch. Baseline: measure 4 weeks pre-launch."',
      priority: "high",
    });
  }

  if (hasWord(metric, ["better", "improve", "faster", "easier", "smoother", "more efficient"])) {
    issues.push({
      stepLabel: "Success Metric",
      stepNumber: 5,
      issue: "Metric is qualitative, not quantitative",
      why: "Qualitative success metrics cannot be measured, tracked, or compared across releases.",
      suggestion: 'Convert to a measurable outcome. "Better UX" → "Reduce task completion time from 8 min to under 3 min". "Improve conversion" → "Increase sign-up completion rate from 42% to 60%".',
      priority: "high",
    });
  }

  // ── Step 6: MVP Scope ─────────────────────────────────────────────────────
  const buildNow = state.buildNow;
  const defer = state.deferToPhase2;

  if (wordCount(buildNow) < 10 && buildNow.trim().length > 0) {
    issues.push({
      stepLabel: "MVP Scope",
      stepNumber: 6,
      issue: "Build-now scope is too vague",
      why: "A vague MVP scope will cause scope creep during sprint planning. Engineering will make assumptions that you did not intend.",
      suggestion: "List the specific features included in V1. Each item should be actionable enough for a developer to estimate. Avoid phrases like 'basic functionality'.",
      priority: "medium",
    });
  }

  if (wordCount(defer) < 8 && defer.trim().length > 0) {
    issues.push({
      stepLabel: "MVP Scope — Phase 2",
      stepNumber: 6,
      issue: "Deferred scope is not detailed",
      why: "A vague Phase 2 list means it will never be revisited. Deferred scope must be specific enough to create a Jira ticket from.",
      suggestion: "List each deferred item specifically. e.g. 'Multi-config settlement view (blocked on Recon team data confirmation)' not just 'advanced features'.",
      priority: "low",
    });
  }

  // ── Step 7: Tradeoffs ─────────────────────────────────────────────────────
  const rejected = state.rejectedApproach;

  if (wordCount(rejected) < 8 && rejected.trim().length > 0) {
    issues.push({
      stepLabel: "Tradeoffs",
      stepNumber: 7,
      issue: "Rejected approach is not described",
      why: "If the rejected approach is not named, the decision is not defensible when circumstances change or a new team member questions the approach.",
      suggestion: "Describe the alternative specifically: what it would have built, who would have done it, and why it was a viable option before being rejected.",
      priority: "medium",
    });
  }

  if (wordCount(state.chosenApproachGivesUp) < 5 && state.chosenApproachGivesUp.trim().length > 0) {
    issues.push({
      stepLabel: "Tradeoffs",
      stepNumber: 7,
      issue: "Cost of the chosen approach is not named",
      why: "Every approach has a cost. If you have not named it, you have not done the tradeoff analysis — you have made a preference call.",
      suggestion: "Name specifically what the chosen approach gives up: speed, coverage, flexibility, data accuracy, user experience, or compliance simplicity.",
      priority: "medium",
    });
  }

  // ── Step 8: Open Questions ────────────────────────────────────────────────
  const filledQs = state.openQuestions.filter((q) => q.question.trim().length > 0);
  const unownedQs = filledQs.filter((q) => !q.owner.trim());

  if (filledQs.length === 0) {
    issues.push({
      stepLabel: "Open Questions",
      stepNumber: 8,
      issue: "No open questions identified",
      why: "Every non-trivial feature has unresolved dependencies. Zero open questions usually means unresolved questions were absorbed into assumptions.",
      suggestion: "Review the spec for: data source confirmations, permission authority decisions, compliance requirements, architecture risks, and integration dependencies.",
      priority: "medium",
    });
  }

  if (unownedQs.length > 0) {
    issues.push({
      stepLabel: "Open Questions",
      stepNumber: 8,
      issue: `${unownedQs.length} question${unownedQs.length > 1 ? "s" : ""} without an owner`,
      why: "Open questions without owners are not deferred — they are abandoned. Without a named owner, no one is responsible for resolving them before the sprint starts.",
      suggestion: "Assign each question to a specific person or team. The owner does not have to answer it — they are responsible for getting the answer.",
      priority: "low",
    });
  }

  return issues;
}

// ── Component ─────────────────────────────────────────────────────────────────

const PRIORITY_CONFIG = {
  high: {
    label: "High priority",
    dot: "bg-red-500",
    badge: "bg-red-50 text-red-700 border-red-200",
    border: "border-red-200",
  },
  medium: {
    label: "Medium priority",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    border: "border-amber-200",
  },
  low: {
    label: "Low priority",
    dot: "bg-zinc-400",
    badge: "bg-zinc-100 text-zinc-600 border-zinc-200",
    border: "border-zinc-200",
  },
};

interface AnswerReviewerProps {
  state: ToolState;
}

export default function AnswerReviewer({ state }: AnswerReviewerProps) {
  const issues = analyseAnswers(state);
  const highCount = issues.filter((i) => i.priority === "high").length;

  if (issues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
          <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-zinc-900">All answers look solid</p>
        <p className="mt-1 text-xs text-zinc-500">No major quality issues detected in your responses.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-5">
        <p className="mb-1 font-mono text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Answer Quality Review
        </p>
        <h3 className="text-base font-semibold text-zinc-900">
          Strengthen your answers
        </h3>
        <p className="mt-1 text-xs text-zinc-500">
          {highCount > 0
            ? `${highCount} high-priority issue${highCount > 1 ? "s" : ""} may weaken the PRD.`
            : "No critical issues. A few improvements will strengthen the output."}
        </p>
      </div>

      {/* Issues */}
      <div className="space-y-3">
        {/* High priority first */}
        {(["high", "medium", "low"] as const).map((priority) =>
          issues
            .filter((i) => i.priority === priority)
            .map((issue, idx) => {
              const config = PRIORITY_CONFIG[priority];
              return (
                <div
                  key={`${priority}-${idx}`}
                  className={`rounded-lg border bg-white p-4 ${config.border}`}
                >
                  {/* Step + priority */}
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide ${config.badge}`}>
                      <span className={`h-1 w-1 rounded-full ${config.dot}`} />
                      {config.label}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-400">
                      Step {issue.stepNumber} · {issue.stepLabel}
                    </span>
                  </div>

                  {/* Issue */}
                  <p className="mb-2 text-sm font-semibold text-zinc-900">{issue.issue}</p>

                  {/* Why */}
                  <p className="mb-3 text-xs leading-relaxed text-zinc-500">{issue.why}</p>

                  {/* Suggestion */}
                  <div className="rounded-md bg-zinc-50 px-3 py-2.5">
                    <p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
                      Suggested fix
                    </p>
                    <p className="text-xs leading-relaxed text-zinc-700">{issue.suggestion}</p>
                  </div>
                </div>
              );
            })
        )}
      </div>

      <p className="mt-4 text-center text-[10px] text-zinc-400">
        Rule-based analysis · No AI backend
      </p>
    </div>
  );
}
