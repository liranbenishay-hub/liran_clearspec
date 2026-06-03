import Link from "next/link";
import Footer from "@/components/footer";

export const metadata = {
  title: "Clearspec — Product",
  description:
    "A structured framework for product decisions, tradeoffs, and PRD generation — extracted from 6 years of real PM work in fintech.",
};

const methodology = [
  {
    label: "Operational pain before features",
    text: "Every product starts by naming the broken process — not the feature. If you cannot write the broken workflow in one sentence, the discovery is not done.",
  },
  {
    label: "Spec-first execution",
    text: "Design does not start without a spec. Engineering does not estimate without design. QA does not begin without acceptance criteria. The pipeline is sequential by design.",
  },
  {
    label: "Explicit tradeoffs",
    text: "Every real decision has a viable rejected option. Clearspec forces you to name what the chosen approach gives up — and what the rejected approach would have given up.",
  },
  {
    label: "KPI before scope",
    text: "The success metric is written before a single feature is scoped. If you cannot name the metric, the discovery is not complete.",
  },
  {
    label: "QA before release",
    text: "A QA checklist is generated from the product spec — tied directly to the issues found, not copied from a generic template.",
  },
  {
    label: "Phased rollout thinking",
    text: "MVP scope and deferred scope are defined simultaneously. Phase 2 is committed at Phase 1 scoping time — sequenced, not abandoned.",
  },
];

const stats = [
  { value: "8", label: "Questions to a full PRD" },
  { value: "6+", label: "Years of real PM decisions" },
  { value: "13+", label: "Major initiatives behind this" },
  { value: "18+", label: "Documented tradeoff records" },
];

export default function ClearspecProductPage() {
  return (
    <>
      <main className="min-h-screen bg-white">

        {/* Sticky CTA bar — sticks to top of content area while user scrolls */}
        <div className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3 sm:px-8">
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Clearspec
            </span>
            <Link
              href="/products/pm-operating-system"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 sm:text-sm"
            >
              Try the framework →
            </Link>
          </div>
        </div>

        {/* Hero */}
        <div className="bg-zinc-950 px-5 py-14 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              <span className="font-mono text-xs text-zinc-400">Live · V1</span>
            </div>
            <h1 className="mb-4 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
              Clearspec
            </h1>
            <p className="mb-3 text-lg text-zinc-400 sm:text-xl">
              The PM Operating System, Built in Public.
            </p>
            <p className="mb-8 max-w-xl text-sm leading-relaxed text-zinc-500 sm:text-base">
              A structured framework for product decisions, tradeoffs, and full PRD generation —
              extracted from 6 years of real fintech and platform product work.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/products/pm-operating-system"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 sm:w-auto"
              >
                Try the framework →
              </Link>
              <Link
                href="/example"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-700 px-5 py-3 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white sm:w-auto"
              >
                See an example
              </Link>
            </div>
          </div>
        </div>

        {/* Why */}
        <div className="border-b border-zinc-100 px-5 py-14 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">
              The Problem
            </p>
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
              Most PM tools help you write documents.
              <br />
              <span className="text-zinc-400">Clearspec forces you to think first.</span>
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-zinc-600 sm:text-base">
              <p>
                Case studies describe outcomes. They do not show the moment of decision — what was
                rejected, what was deferred, who had the authority, what the tradeoff cost.
              </p>
              <p>
                Generic frameworks are correct in the abstract and useless in the specific. They do
                not capture what happens when compliance and UX flexibility are in tension, when an
                urgent migration overrides standard prioritisation, or when a cross-team ownership
                gap turns a shipped feature into a production bug.
              </p>
              <p>
                Clearspec was extracted from real decisions — not synthesised from best practices.
                Eight structured questions produce a complete, copy-ready PRD with problem statement,
                user stories, success metrics, MVP scope, tradeoffs, QA checklist, and rollout plan.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="border-b border-zinc-100 px-5 py-12 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-semibold tracking-tight text-zinc-900">{stat.value}</p>
                  <p className="mt-1 text-xs text-zinc-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Methodology — Powered by PM OS */}
        <div className="bg-zinc-50 px-5 py-16 sm:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="mb-10">
              <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">
                Methodology
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
                Powered by Liran&apos;s PM Operating System
              </h2>
              <p className="mt-4 max-w-2xl text-sm text-zinc-500 sm:text-base">
                Clearspec is the tool. The PM Operating System is the methodology inside it. Every
                question in the framework maps to a real decision pattern extracted from 6 years of
                fintech product work.
              </p>
            </div>
            <div className="grid gap-px bg-zinc-200 sm:grid-cols-2 lg:grid-cols-3">
              {methodology.map((item) => (
                <div key={item.label} className="bg-white p-6">
                  <h3 className="mb-2 text-sm font-semibold text-zinc-900">{item.label}</h3>
                  <p className="text-sm leading-relaxed text-zinc-500">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What you get */}
        <div className="border-b border-zinc-100 px-5 py-16 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">
              The Output
            </p>
            <h2 className="mb-8 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
              A complete PRD, not a summary.
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Product title and problem statement",
                "Target users and current operational pain",
                "Goals and explicit non-goals",
                "MVP scope and Phase 2 commitment",
                "User stories derived from the problem",
                "Success metrics tied to the problem statement",
                "Risks, assumptions, and tradeoff record",
                "QA checklist for the next release",
                "Rollout plan in three phases",
                "Open questions with named owners",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5 text-sm text-zinc-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-lg border border-zinc-200 bg-zinc-50 p-5">
              <p className="text-sm text-zinc-600">
                <span className="font-medium text-zinc-900">Also included:</span> An answer quality
                reviewer that analyses each of your answers and flags where the thinking is too
                vague, too solution-focused, or missing quantification — before you copy the PRD.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-zinc-950 px-5 py-16 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-2xl font-semibold text-white sm:text-3xl">
              Try it on a real problem.
            </h2>
            <p className="mb-8 text-zinc-400">
              Eight questions. One complete PRD. No account required.
            </p>
            <Link
              href="/products/pm-operating-system"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100"
            >
              Try the framework →
            </Link>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
