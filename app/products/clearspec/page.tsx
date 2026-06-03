import Link from "next/link";
import Footer from "@/components/footer";

export const metadata = {
  title: "Clearspec — Product",
  description: "A structured framework for product decisions, tradeoffs, and decision records. Extracted from 6 years of real PM work in fintech.",
};

const features = [
  {
    label: "Operational pain first",
    description: "Discovery starts from a broken process, not a feature request. The first question forces you to name the specific workflow you are replacing.",
  },
  {
    label: "Explicit tradeoffs",
    description: "Every decision has a viable rejected option. Clearspec captures what each approach gives up — making decisions defensible when circumstances change.",
  },
  {
    label: "The 80/20 scope split",
    description: "Build the most common scenario now. Name the deferred scope explicitly. Phase 2 is committed, not abandoned.",
  },
  {
    label: "Open questions as blockers",
    description: "Unresolved questions are first-class objects. Name them, assign owners, and surface them before they become production bugs.",
  },
  {
    label: "One metric before scope",
    description: "If you cannot name the metric that moves when this works, discovery is not done. Clearspec enforces this before any scoping begins.",
  },
  {
    label: "Decision record output",
    description: "The output is a structured, copy-ready document in a consistent format — portable to Notion, Confluence, Linear, or any spec tool.",
  },
];

export default function ClearspecProductPage() {
  return (
    <>
      <main className="min-h-screen bg-white">

        {/* Hero */}
        <div className="border-b border-zinc-100 bg-zinc-950 px-6 py-14 sm:px-10 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              <span className="font-mono text-xs text-zinc-400">Live · V1</span>
            </div>
            <h1 className="mb-4 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
              Clearspec
            </h1>
            <p className="mb-2 text-lg text-zinc-400 sm:text-xl">
              The PM Operating System, Built in Public.
            </p>
            <p className="mb-8 max-w-xl text-zinc-500">
              A structured framework for product decisions, tradeoffs, and decision records.
              Extracted from 6 years of real product work in fintech and B2B SaaS.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/products/pm-operating-system"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100"
              >
                Try the Framework →
              </Link>
              <Link
                href="/example"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
              >
                See an example
              </Link>
            </div>
          </div>
        </div>

        {/* Why */}
        <div className="border-b border-zinc-100 px-6 py-16 sm:px-10">
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">
              The Problem
            </p>
            <h2 className="mb-8 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
              Most PM tools help you write documents.
              <br />
              <span className="text-zinc-400">Clearspec forces you to think first.</span>
            </h2>
            <div className="space-y-5 text-sm leading-relaxed text-zinc-600 sm:text-base">
              <p>
                Case studies describe outcomes. They don&apos;t show the moment of decision — what was
                rejected, what was deferred, who had the authority, what the tradeoff cost.
              </p>
              <p>
                Generic PM frameworks are correct in the abstract and useless in the specific. They
                don&apos;t capture what happens when compliance and UX flexibility are in tension, when
                a CEO flag overrides standard prioritization, or when a cross-team ownership gap turns
                a shipped feature into a production bug.
              </p>
              <p>
                Clearspec was extracted from real decisions — not synthesized from best practices. It
                has been applied to fintech platforms, partner portals, compliance systems, and AI
                product strategy. Some of those decisions were right. A few were wrong. All of them
                are in here.
              </p>
            </div>
          </div>
        </div>

        {/* Features grid */}
        <div className="bg-zinc-50 px-6 py-16 sm:px-10">
          <div className="mx-auto max-w-4xl">
            <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">
              The Framework
            </p>
            <h2 className="mb-10 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
              What makes it different.
            </h2>
            <div className="grid gap-px bg-zinc-200 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div key={f.label} className="bg-white p-6">
                  <h3 className="mb-2 text-sm font-semibold text-zinc-900">{f.label}</h3>
                  <p className="text-sm leading-relaxed text-zinc-500">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="border-b border-t border-zinc-100 px-6 py-12 sm:px-10">
          <div className="mx-auto max-w-3xl">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                { value: "6", label: "Years of real PM work" },
                { value: "13+", label: "Major initiatives" },
                { value: "18+", label: "Documented decisions" },
                { value: "7", label: "Questions to a Decision Record" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-zinc-950 px-6 py-16 sm:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-2xl font-semibold text-white sm:text-3xl">
              Apply it to a real problem.
            </h2>
            <p className="mb-8 text-zinc-400">
              Seven questions. One decision record. No account required.
            </p>
            <Link
              href="/products/pm-operating-system"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100"
            >
              Try the Framework →
            </Link>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
