"use client";

import { useState } from "react";
import type { ToolState } from "@/lib/types";

interface DecisionRecordProps {
  state: ToolState;
  onStartOver: () => void;
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function DecisionRecord({ state, onStartOver }: DecisionRecordProps) {
  const [copied, setCopied] = useState(false);

  const recordText = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DECISION RECORD
${formatDate()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROBLEM STATEMENT
${state.problemStatement}

OPERATIONAL PAIN
${state.operationalPain}

What they're doing instead:
${state.currentWorkaround}

SUCCESS METRIC
${state.successMetric}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MVP SCOPE

  ✓ Build now (80% case)
  ${state.buildNow}

  ○ Phase 2 (committed, not abandoned)
  ${state.deferToPhase2}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TRADEOFFS

  Chosen approach gives up:
  ${state.chosenApproachGivesUp}

  Rejected alternative (not taken):
  ${state.rejectedApproach}

  Rejected alternative would have given up:
  ${state.rejectedApproachGivesUp}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OPEN QUESTIONS

${state.openQuestions
  .filter((q) => q.question.trim())
  .map((q, i) => `  □ [${i + 1}] ${q.question}${q.owner ? ` — Owner: ${q.owner}` : " — Owner: Unassigned"}`)
  .join("\n")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated with Clearspec · clearspec.pm
The PM Operating System, Built in Public.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(recordText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = recordText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="step-enter">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <p className="font-mono text-xs font-medium uppercase tracking-widest text-zinc-500">
            Decision Record Generated
          </p>
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          Your decision record is ready.
        </h2>
        <p className="mt-2 text-zinc-500">
          Copy it to Notion, Confluence, Linear, or anywhere you document product decisions.
          Clearspec doesn't store your work — save it now.
        </p>
      </div>

      {/* Action buttons */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
        >
          {copied ? (
            <>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy to clipboard
            </>
          )}
        </button>
        <button
          onClick={onStartOver}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-900"
        >
          Start over
        </button>
      </div>

      {/* The record itself */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-950 shadow-lg">
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
          <div className="h-3 w-3 rounded-full bg-zinc-700" />
          <div className="h-3 w-3 rounded-full bg-zinc-700" />
          <div className="h-3 w-3 rounded-full bg-zinc-700" />
          <span className="ml-3 font-mono text-xs text-zinc-500">decision-record.md</span>
        </div>

        {/* Record content */}
        <div className="decision-record p-8 text-zinc-300 overflow-x-auto">
          {/* Header */}
          <div className="text-zinc-700 mb-3">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
          <div className="font-semibold text-zinc-100 mb-1">DECISION RECORD</div>
          <div className="text-zinc-500 text-xs mb-3">{formatDate()}</div>
          <div className="text-zinc-700 mb-6">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>

          {/* Problem */}
          <RecordSection label="PROBLEM STATEMENT" content={state.problemStatement} />

          {/* Pain */}
          <RecordSection label="OPERATIONAL PAIN" content={state.operationalPain}>
            <div className="mt-3">
              <span className="text-zinc-500">What they&apos;re doing instead: </span>
              <span className="text-zinc-300">{state.currentWorkaround}</span>
            </div>
          </RecordSection>

          {/* Metric */}
          <RecordSection label="SUCCESS METRIC" content={state.successMetric} />

          {/* Divider */}
          <div className="text-zinc-700 my-5">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>

          {/* Scope */}
          <div className="mb-5">
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              MVP SCOPE
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-green-400">✓ Build now (80% case)</span>
                <div className="mt-1 ml-4 text-zinc-300">{state.buildNow}</div>
              </div>
              <div>
                <span className="text-zinc-500">○ Phase 2 (committed, not abandoned)</span>
                <div className="mt-1 ml-4 text-zinc-300">{state.deferToPhase2}</div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="text-zinc-700 my-5">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>

          {/* Tradeoffs */}
          <div className="mb-5">
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              TRADEOFFS
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-zinc-500">Chosen approach gives up: </span>
                <span className="text-zinc-300">{state.chosenApproachGivesUp}</span>
              </div>
              <div>
                <span className="text-zinc-500">Rejected alternative: </span>
                <span className="text-zinc-300">{state.rejectedApproach}</span>
              </div>
              <div>
                <span className="text-zinc-500">Rejected would have given up: </span>
                <span className="text-zinc-300">{state.rejectedApproachGivesUp}</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="text-zinc-700 my-5">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>

          {/* Open questions */}
          <div className="mb-5">
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              OPEN QUESTIONS
            </div>
            <div className="space-y-2">
              {state.openQuestions
                .filter((q) => q.question.trim())
                .map((q, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-zinc-500 mt-0.5">□</span>
                    <div>
                      <span className="text-zinc-300">{q.question}</span>
                      <span className="text-zinc-500"> — Owner: {q.owner || "Unassigned"}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-zinc-700 mt-5 mb-3">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
          <div className="text-xs text-zinc-600">
            Generated with Clearspec · clearspec.pm<br />
            The PM Operating System, Built in Public.
          </div>
          <div className="text-zinc-700 mt-3">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
        </div>
      </div>

      {/* Save reminder */}
      <p className="mt-4 text-center text-xs text-zinc-400">
        Clearspec doesn't save your work. Copy it before leaving this page.
      </p>
    </div>
  );
}

function RecordSection({
  label,
  content,
  children,
}: {
  label: string;
  content: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
        {label}
      </div>
      <div className="text-sm leading-relaxed text-zinc-300">{content}</div>
      {children}
    </div>
  );
}
