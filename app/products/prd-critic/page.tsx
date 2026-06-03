import Link from "next/link";
import Footer from "@/components/footer";

export const metadata = {
  title: "PRD Critic — Liran Ben Ishay",
  description:
    "Paste a PRD. Get a structured gap analysis covering problem clarity, missing metrics, risky assumptions, rollout gaps, and open questions.",
};

const outputSections = [
  {
    label: "PROBLEM CLARITY  ⚠ Weak",
    content:
      'The problem statement describes the symptom ("partners want webhook control") but not the operational failure. Missing: support ticket volume, hours of AM intervention, or the current workaround.\n\nSuggested rewrite: "ISO partners managing 50+ merchants contact Rapyd support for every webhook configuration — creating X support tickets/week and X hours of AM time. No self-service path exists."',
  },
  {
    label: "MISSING USER SEGMENTS  (2 found)",
    content:
      "□ ISO partners and referral partners are treated as one user type. These have different permission models and different current workarounds.\n□ PAPO Agent-level users are not addressed — do they have webhook access or is this Owner-only?",
  },
  {
    label: "MISSING SUCCESS METRICS",
    content:
      'Current spec states: "Reduce support tickets." This is a direction, not a metric.\n\nSuggested: "Reduce webhook-related partner support tickets by 40% within 90 days of launch. Baseline: measure ticket volume 4 weeks pre-launch."',
  },
  {
    label: "RISKY ASSUMPTIONS  (3 found)",
    content:
      "□ Assumes partners will configure webhooks correctly without a validation step. Risk: incorrect URLs create silent failures with no error surfaced to the partner.\n□ Assumes RBO toggle is sufficient as the control gate. Risk: no rollback mechanism if a partner disables webhooks incorrectly.\n□ Assumes partner-managed and merchant-managed webhooks can coexist. Risk: if both are active, which takes precedence? Not defined.",
  },
  {
    label: "MISSING EDGE CASES  (3 found)",
    content:
      "□ What happens if a webhook URL configured by the partner returns persistent errors?\n□ What happens if the RBO toggle is disabled after a partner has already configured webhooks?\n□ What is the merchant-visible experience when their partner controls the webhook?",
  },
  {
    label: "ROLLOUT GAPS",
    content:
      "□ No feature flag strategy defined — this affects live partner configurations.\n□ No phasing — which partner types get access first?\n□ No post-launch monitoring plan — who tracks support ticket volume and when is success declared?",
  },
  {
    label: "OPEN PRODUCT QUESTIONS  (4)",
    content:
      "□ Who validates webhook URLs — client-side, server-side, or both?\n□ What is the audit trail requirement for partner webhook changes?\n□ Is webhook deletion logged for compliance purposes?\n□ What is the retry SLA when a webhook delivery fails?",
  },
];

const strengths = [
  {
    label: "Spec quality standard",
    text: "Applies the same PRD review criteria I use for every spec I ship — not a checklist, but a judgment framework.",
  },
  {
    label: "Problem framing",
    text: "Identifies when a problem statement describes a symptom instead of the operational failure. Prompts the fix.",
  },
  {
    label: "Risk surfacing",
    text: "Finds assumptions that sound reasonable until they hit a real edge case in production.",
  },
  {
    label: "Rollout discipline",
    text: "Catches missing feature flag strategies, phasing decisions, and monitoring plans before build starts.",
  },
];

export default function PRDCriticPage() {
  return (
    <>
      <main className="min-h-screen bg-white">

        {/* Hero */}
        <div className="bg-zinc-950 px-5 py-12 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
                <span className="font-mono text-xs text-zinc-400">Coming Soon</span>
              </span>
              <span className="rounded-full border border-zinc-800 px-3 py-1 font-mono text-xs text-zinc-600">
                Input: PRD / spec text
              </span>
            </div>
            <h1 className="mb-3 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
              PRD Critic
            </h1>
            <p className="mb-6 text-base text-zinc-400 sm:text-xl">
              Paste a PRD. Get a structured gap analysis before build starts.
            </p>
            <p className="max-w-xl text-sm leading-relaxed text-zinc-500 sm:text-base">
              An AI reviewer that checks a product spec for missing context, weak assumptions, unclear
              KPIs, edge case gaps, rollout risks, and open product questions — before a single line
              of engineering work begins.
            </p>
          </div>
        </div>

        {/* Problem */}
        <div className="border-b border-zinc-100 px-5 py-14 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">
              The Problem
            </p>
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
              Most PRD gaps are caught in QA. They should be caught in the spec.
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-zinc-600 sm:text-base">
              <p>
                Weak success metrics, missing edge cases, and undefined rollout strategies are not
                engineering problems — they are spec problems that slipped through. By the time they
                surface in QA or post-launch, the cost to fix them has multiplied.
              </p>
              <p>
                PRD Critic applies a structured review pass before any work begins — flagging problem
                statements that describe symptoms, assumptions that sound plausible until they hit
                production, and open questions that need owners before the sprint starts.
              </p>
            </div>
          </div>
        </div>

        {/* Who it's for */}
        <div className="bg-zinc-50 px-5 py-14 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Who It Is For
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { role: "Product Managers", use: "Self-review a spec before sharing with engineering. Catch gaps before they become comments." },
                { role: "Tech Leads", use: "Quickly identify what is missing before committing to a sprint plan." },
                { role: "Product Teams", use: "Use as a shared standard — what a complete spec looks like vs. what is missing." },
              ].map((item) => (
                <div key={item.role} className="rounded-lg border border-zinc-200 bg-white p-5">
                  <p className="mb-2 text-sm font-semibold text-zinc-900">{item.role}</p>
                  <p className="text-xs leading-relaxed text-zinc-500">{item.use}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Example input */}
        <div className="border-b border-zinc-100 px-5 py-14 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Example Input
            </p>
            <div className="relative rounded-lg border border-zinc-200 bg-zinc-50 p-4">
              <span className="absolute right-3 top-3 rounded bg-zinc-200 px-2 py-0.5 font-mono text-[10px] text-zinc-500">
                example
              </span>
              <p className="pr-16 text-sm leading-relaxed text-zinc-600">
                <strong className="text-zinc-800">Feature:</strong> Partner-Level Webhook Configuration
                <br /><br />
                <strong className="text-zinc-800">Problem:</strong> Partners want to manage webhooks centrally instead of per merchant.
                <br /><br />
                <strong className="text-zinc-800">Solution:</strong> Add a webhook section to the Partner Portal. Partners can configure a webhook URL that applies to all their merchants. Controlled by an RBO toggle.
                <br /><br />
                <strong className="text-zinc-800">Success:</strong> Reduce support tickets.
              </p>
            </div>
          </div>
        </div>

        {/* Example output */}
        <div className="bg-white px-5 py-14 sm:px-8">
          <div className="mx-auto max-w-4xl">
            <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Example Output
            </p>
            <h2 className="mb-8 text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">
              What the review returns.
            </h2>
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-950 shadow-lg">
              <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-zinc-700" />
                <div className="h-3 w-3 rounded-full bg-zinc-700" />
                <div className="h-3 w-3 rounded-full bg-zinc-700" />
                <span className="ml-3 font-mono text-xs text-zinc-500">prd-review.md</span>
              </div>
              <div className="overflow-x-auto p-6 sm:p-8">
                <div className="decision-record min-w-[300px] space-y-6 text-zinc-300">
                  <div>
                    <div className="text-zinc-700 text-xs">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                    <div className="mt-2 font-semibold text-zinc-100">PRD QUALITY REVIEW</div>
                    <div className="mt-1 text-xs text-zinc-500">Feature: Partner-Level Webhook Configuration</div>
                    <div className="mt-2 text-zinc-700 text-xs">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                  </div>
                  {outputSections.map((section) => (
                    <div key={section.label}>
                      <div className="mb-2 text-[9px] font-semibold uppercase tracking-widest text-zinc-500 sm:text-[10px]">
                        {section.label}
                      </div>
                      <div className="whitespace-pre-line text-xs leading-relaxed text-zinc-300 sm:text-sm">
                        {section.content}
                      </div>
                    </div>
                  ))}
                  <div className="text-zinc-700 text-xs">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                  <div className="text-[10px] text-zinc-600">
                    Sections requiring rewrite: Problem Statement, Success Metrics
                    <br />
                    Sections missing entirely: Edge Cases, Rollout Plan
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PM Strengths */}
        <div className="bg-zinc-50 px-5 py-14 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">
              What This Demonstrates
            </p>
            <h2 className="mb-8 text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">
              Spec quality is a PM responsibility, not QA&apos;s.
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {strengths.map((s) => (
                <div key={s.label} className="rounded-lg border border-zinc-200 bg-white p-5">
                  <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">
                    {s.label}
                  </p>
                  <p className="text-sm leading-relaxed text-zinc-600">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-zinc-950 px-5 py-14 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-xl font-semibold text-white sm:text-2xl">
              Try a live tool in the meantime.
            </h2>
            <p className="mb-6 text-sm text-zinc-400">
              PRD Critic is in design. The PM Operating System applies the same thinking to your next feature.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button
                disabled
                className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-zinc-800 px-6 py-3 text-sm font-medium text-zinc-500 sm:w-auto"
              >
                Try Demo — Coming Soon
              </button>
              <Link
                href="/products/pm-operating-system"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-300 transition-colors hover:text-white sm:w-auto"
              >
                Try the PM OS Framework →
              </Link>
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
