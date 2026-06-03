"use client";

import { useState, useRef } from "react";

type AuditState = "idle" | "loading" | "results";

const LOADING_STAGES = [
  "Fetching page structure...",
  "Analysing UX patterns...",
  "Running QA checks...",
  "Compiling report...",
];

// ── Mock audit output ─────────────────────────────────────────────────────────
// Structured in the same format as real PM outputs throughout the site.
// The URL is echoed in the report header to make it feel personalised.

function buildAuditOutput(url: string) {
  // Extract domain for display
  let domain = url;
  try {
    domain = new URL(url.startsWith("http") ? url : `https://${url}`).hostname;
  } catch {
    domain = url;
  }

  return {
    domain,
    sections: [
      {
        label: "PRODUCT SUMMARY",
        content: `Based on the page structure and visible content, this appears to be a B2B SaaS product. The primary use case involves workflow management or data tooling for business users.

The value proposition is present but requires reading past the fold to fully understand. The hero section leads with a capability claim rather than a user outcome.`,
      },
      {
        label: "CLARITY SCORE  6 / 10",
        content: `The core value proposition is visible but not immediately clear to a new visitor.
The hero headline describes a feature, not the outcome the user gets.
A new visitor must read 2–3 sections before understanding the primary use case.

Recommendation: Rewrite the headline to lead with the outcome — what changes for the user after they start using this product.`,
      },
      {
        label: "UX FRICTION POINTS  (4 found)",
        content: `□ Primary CTA competes with 2–3 secondary actions in the same viewport
□ Sign-up flow requires account creation before any product value is shown
□ Feature descriptions use internal product language, not user-outcome language
□ The most-used features for new users are buried below secondary marketing content`,
      },
      {
        label: "MOBILE RESPONSIVENESS  (3 issues)",
        content: `□ Hero headline overflows on viewports narrower than 390px
□ Feature comparison grid or data table requires horizontal scrolling on mobile
□ Primary CTA is not accessible from the mobile navigation without scrolling to bottom`,
      },
      {
        label: "MISSING TRUST SIGNALS  (3 found)",
        content: `□ Social proof (customer logos or testimonials) is not visible above the fold
□ No security or compliance certifications visible near the sign-up or pricing section
□ Pricing requires a sales call or contact form — no self-service evaluation path`,
      },
      {
        label: "TOP 5 RECOMMENDED FIXES",
        content: `1. Rewrite the hero headline to lead with the user outcome, not the product capability
2. Add a self-service evaluation path (sandbox, free tier, or interactive demo) — remove the sales gate from early evaluation
3. Move the primary CTA above the fold and remove competing actions from the same viewport
4. Add security and compliance signals near sign-up — this is a conversion signal for B2B buyers
5. Fix mobile navigation — ensure the primary CTA is reachable without scrolling on a 390px viewport`,
      },
      {
        label: "QA CHECKLIST — NEXT RELEASE",
        content: `□ Test primary CTA on mobile (375px, 390px, 414px viewports)
□ Verify all navigation links resolve correctly, including footer
□ Test sign-up flow end-to-end on mobile device
□ Run Lighthouse audit — target < 3s load time on mobile
□ Verify form validation messages are visible and not clipped on mobile
□ Test all CTAs and links with keyboard-only navigation
□ Check contrast ratios on all text over dark or image backgrounds (WCAG AA)
□ Confirm no horizontal scroll on any viewport narrower than 768px`,
      },
    ],
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function AuditTool() {
  const [state, setAuditState] = useState<AuditState>("idle");
  const [url, setUrl] = useState("");
  const [stageIndex, setStageIndex] = useState(0);
  const [auditResult, setAuditResult] = useState<ReturnType<typeof buildAuditOutput> | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  function normaliseUrl(raw: string): string {
    const trimmed = raw.trim();
    if (!trimmed) return "";
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
    return `https://${trimmed}`;
  }

  async function runAudit() {
    const normalised = normaliseUrl(url);
    if (!normalised) {
      setError("Enter a URL to audit.");
      return;
    }
    setError("");
    setAuditState("loading");
    setStageIndex(0);

    // Cycle through loading stages
    for (let i = 1; i < LOADING_STAGES.length; i++) {
      await new Promise((r) => setTimeout(r, 520));
      setStageIndex(i);
    }
    await new Promise((r) => setTimeout(r, 480));

    setAuditResult(buildAuditOutput(normalised));
    setAuditState("results");

    // Scroll to results on mobile
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  function reset() {
    setAuditState("idle");
    setUrl("");
    setAuditResult(null);
    setError("");
    setCopied(false);
    setStageIndex(0);
  }

  function copyReport() {
    if (!auditResult) return;
    const text = [
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "PRODUCT QA AUDIT REPORT",
      `Target: ${auditResult.domain}`,
      new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "",
      ...auditResult.sections.flatMap((s) => [s.label, s.content, ""]),
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "Generated by AI Product QA Auditor · Clearspec PM Tools",
    ].join("\n");

    navigator.clipboard.writeText(text).catch(() => null);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ── Idle state ─────────────────────────────────────────────────────────────
  if (state === "idle") {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8">
        <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">
          Run an audit
        </p>
        <p className="mb-6 text-sm text-zinc-500">
          Enter any product URL. The auditor analyses the page and returns structured findings
          across clarity, UX, mobile responsiveness, trust signals, and QA.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 flex-col gap-1">
            <input
              type="text"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError(""); }}
              onKeyDown={(e) => { if (e.key === "Enter") runAudit(); }}
              placeholder="https://yourproduct.com"
              className={`w-full rounded-lg border px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-300 outline-none transition-colors focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 ${
                error ? "border-red-300 bg-red-50" : "border-zinc-200 hover:border-zinc-300"
              }`}
              autoFocus
            />
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>
          <button
            onClick={runAudit}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 active:scale-[0.98]"
          >
            Run audit →
          </button>
        </div>

        <p className="mt-4 text-xs text-zinc-400">
          Demo mode — results are structured mock output. Real AI analysis coming soon.
        </p>
      </div>
    );
  }

  // ── Loading state ──────────────────────────────────────────────────────────
  if (state === "loading") {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-2 w-2 rounded-full bg-zinc-300 animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
          <span className="font-mono text-xs text-zinc-500">
            Auditing {normaliseUrl(url).replace("https://", "").replace("http://", "").split("/")[0]}
          </span>
        </div>

        {/* Stage progress */}
        <div className="space-y-2 mb-6">
          {LOADING_STAGES.map((stage, i) => (
            <div key={stage} className="flex items-center gap-3">
              <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${
                i < stageIndex
                  ? "border-green-300 bg-green-50 text-green-600"
                  : i === stageIndex
                  ? "border-zinc-300 bg-zinc-50 text-zinc-400"
                  : "border-zinc-200 bg-white text-zinc-200"
              }`}>
                {i < stageIndex ? "✓" : i === stageIndex ? "→" : "·"}
              </div>
              <span className={`text-sm ${
                i < stageIndex ? "text-zinc-400 line-through" : i === stageIndex ? "text-zinc-700 font-medium" : "text-zinc-300"
              }`}>
                {stage}
              </span>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-zinc-900 transition-all duration-500"
            style={{ width: `${((stageIndex + 1) / LOADING_STAGES.length) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  // ── Results state ──────────────────────────────────────────────────────────
  if (state === "results" && auditResult) {
    return (
      <div ref={resultRef}>
        {/* Result header + actions */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Audit complete
              </span>
            </div>
            <p className="text-sm text-zinc-500">
              Target: <span className="font-medium text-zinc-700">{auditResult.domain}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={copyReport}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-900"
            >
              {copied ? (
                <><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Copied</>
              ) : (
                <><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>Copy</>
              )}
            </button>
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-900"
            >
              New audit
            </button>
          </div>
        </div>

        {/* The audit report */}
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-950 shadow-lg">
          {/* Window chrome */}
          <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
            <div className="h-3 w-3 rounded-full bg-zinc-700" />
            <div className="h-3 w-3 rounded-full bg-zinc-700" />
            <div className="h-3 w-3 rounded-full bg-zinc-700" />
            <span className="ml-3 font-mono text-xs text-zinc-500">qa-audit-report.md</span>
          </div>

          {/* Report content */}
          <div className="overflow-x-auto p-6 sm:p-8">
            <div className="decision-record min-w-[280px] text-zinc-300">
              {/* Header */}
              <div className="text-zinc-700 text-xs mb-3">
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              </div>
              <div className="font-semibold text-zinc-100 mb-1">PRODUCT QA AUDIT REPORT</div>
              <div className="text-zinc-500 text-xs mb-1">Target: {auditResult.domain}</div>
              <div className="text-zinc-600 text-xs mb-3">
                {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </div>
              <div className="text-zinc-700 text-xs mb-6">
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              </div>

              {/* Sections */}
              <div className="space-y-7">
                {auditResult.sections.map((section) => (
                  <div key={section.label}>
                    <div className="mb-2 text-[9px] font-semibold uppercase tracking-widest text-zinc-500 sm:text-[10px]">
                      {section.label}
                    </div>
                    <div className="whitespace-pre-line text-xs leading-relaxed text-zinc-300 sm:text-sm">
                      {section.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-7 text-zinc-700 text-xs">
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              </div>
              <div className="mt-3 text-[10px] text-zinc-600">
                Generated by AI Product QA Auditor · Clearspec PM Tools
                <br />
                Demo mode — structured mock output. Real AI analysis in progress.
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-zinc-400">
          Copy the report and use it in your next product review or QA session.
        </p>
      </div>
    );
  }

  return null;
}
