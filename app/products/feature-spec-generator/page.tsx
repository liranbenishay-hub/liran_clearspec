import Link from "next/link";
import Footer from "@/components/footer";

export const metadata = {
  title: "Feature Spec Generator — Liran Ben Ishay",
  description:
    "One paragraph in. A structured product spec out. Problem statement, user stories, success metrics, MVP scope, edge cases, rollout plan, and QA checklist.",
};

const outputSections = [
  {
    label: "PROBLEM STATEMENT",
    content:
      "ISO partners managing portfolios of 100+ merchants cannot efficiently locate specific accounts. The current merchant list uses pagination only — no filtering, no search. Partners waste significant time scrolling to take urgent actions on specific accounts.",
  },
  {
    label: "TARGET USERS",
    content:
      "Primary: ISO Partner Owners managing portfolios of 50+ merchants\nSecondary: PAPO Agents handling daily merchant operations",
  },
  {
    label: "GOALS",
    content:
      "□ Reduce time-to-locate a specific merchant by ≥70%\n□ Enable portfolio-level filtering by status, activation, and volume\n□ Zero increase in page load time for partners not using search",
  },
  {
    label: "NON-GOALS",
    content:
      "□ Not building full-text search across merchant transaction history\n□ Not building saved search presets (Phase 2, Jira'd separately)\n□ Not exposing this to sub-agent roles in this iteration",
  },
  {
    label: "USER STORIES",
    content:
      "1. As a Partner Owner, I can type a merchant name or ID and see real-time results so I can act quickly without scrolling.\n2. As a Partner Owner, I can filter merchants by status (Active, Pending, Blocked) to prioritize follow-up.\n3. As a PAPO Agent, I can only search within my own merchant scope, so I do not see accounts I am not authorized to manage.",
  },
  {
    label: "SUCCESS METRICS",
    content:
      "□ Merchant navigation time: 70% reduction (baseline from current analytics)\n□ Search usage rate: 60% of partner sessions within 30 days of launch",
  },
  {
    label: "MVP SCOPE",
    content:
      "Build now: Real-time name / ID search, status filter, clear-filter action\nDefer to Phase 2: Saved filters, multi-criteria advanced filtering, search analytics",
  },
  {
    label: "EDGE CASES  (4 identified)",
    content:
      "□ Search returns zero results → show clear empty state with a suggestion\n□ Partner has 0 merchants → search field is hidden, not broken or erroring\n□ Query contains special characters → sanitize server-side, do not crash\n□ Search + filter active simultaneously → both must apply, not override each other",
  },
  {
    label: "ROLLOUT PLAN",
    content:
      "Phase 1: Internal testing with 2 selected partner accounts\nPhase 2: Feature flag ON for 10 pilot partners, monitor support ticket volume\nPhase 3: Full rollout after 2-week pilot with zero critical bugs",
  },
  {
    label: "QA CHECKLIST",
    content:
      "□ Search returns correct results for partial name match\n□ Results scoped to current user's merchant list only\n□ Status filter applies correctly when combined with search\n□ Clear filter restores full merchant list without page reload\n□ Performance: search response < 300ms for portfolios up to 500 merchants\n□ Mobile: search input accessible on 375px viewport\n□ Empty state renders correctly when no results found\n□ Search input accessible via keyboard (Tab + Enter)",
  },
];

const strengths = [
  {
    label: "Ambiguity to clarity",
    text: "Takes a rough idea and produces every artifact engineering needs — without a meeting.",
  },
  {
    label: "Goals and non-goals",
    text: "Explicitly scoping what is not being built is as important as what is. This prevents scope creep before it starts.",
  },
  {
    label: "Edge case discipline",
    text: "Edge cases are not discovered in QA — they are anticipated in the spec. Every scenario has a named behavior.",
  },
  {
    label: "Rollout thinking",
    text: "A phased rollout with defined triggers is not optional for B2B products where live configurations are at risk.",
  },
];

export default function FeatureSpecGeneratorPage() {
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
                Input: Feature idea
              </span>
            </div>
            <h1 className="mb-3 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
              Feature Spec Generator
            </h1>
            <p className="mb-6 text-base text-zinc-400 sm:text-xl">
              One paragraph in. Full structured spec out.
            </p>
            <p className="max-w-xl text-sm leading-relaxed text-zinc-500 sm:text-base">
              Describe a feature idea in plain language. Get a complete product spec with problem
              statement, user stories, success metrics, MVP scope, edge cases, rollout plan, and a
              QA checklist — ready to drop into Confluence or Notion.
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
              Every good feature starts as a vague idea. The spec is where ambiguity becomes execution.
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-zinc-600 sm:text-base">
              <p>
                The gap between "we should add search to the merchant list" and a spec that engineering
                can build from is not a writing problem. It is a structured thinking problem. You need
                to define the problem, the users, the scope, the non-goals, the edge cases, and the
                success criteria — in the right order, with the right level of precision.
              </p>
              <p>
                Feature Spec Generator applies the same spec structure I use for every feature I ship —
                from a two-line feature idea to a complete, reviewable document. No blank page. No
                missing sections.
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
                { role: "Product Managers", use: "Turn a backlog item or customer request into a spec without starting from a blank Confluence page." },
                { role: "Founders", use: "Spec a feature fast without a dedicated PM — structured enough for an engineer to build from." },
                { role: "Junior PMs", use: "Learn what a complete spec looks like by generating one from a real feature idea." },
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
                Add smart search to the merchant list in the partner portal. Partners with large
                portfolios can&apos;t find specific merchants quickly. Should support searching by name
                and filtering by merchant status.
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
              The spec the tool generates.
            </h2>
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-950 shadow-lg">
              <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-zinc-700" />
                <div className="h-3 w-3 rounded-full bg-zinc-700" />
                <div className="h-3 w-3 rounded-full bg-zinc-700" />
                <span className="ml-3 font-mono text-xs text-zinc-500">feature-spec.md</span>
              </div>
              <div className="overflow-x-auto p-6 sm:p-8">
                <div className="decision-record min-w-[300px] space-y-6 text-zinc-300">
                  <div>
                    <div className="text-zinc-700 text-xs">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                    <div className="mt-2 font-semibold text-zinc-100">FEATURE SPEC</div>
                    <div className="mt-1 text-xs text-zinc-500">Smart Merchant Search — Partner Portal</div>
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
                    Generated by Feature Spec Generator · Clearspec PM Tools
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
              How I turn ambiguity into clear execution.
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
              Try the decision record framework now.
            </h2>
            <p className="mb-6 text-sm text-zinc-400">
              Feature Spec Generator is in design. The PM Operating System is live and applies the
              same structured thinking to any product problem today.
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
