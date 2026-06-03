import Footer from "@/components/footer";
import Link from "next/link";

export const metadata = {
  title: "About — Clearspec",
  description:
    "Liran Ben Ishay is a Product Manager with six years in fintech. Clearspec is the PM Operating System he built for himself, made public.",
};

const philosophy = [
  {
    principle: "Operational pain before features.",
    explanation:
      "Discovery starts from a broken process, not a user wish list. If you can't name the broken workflow in one sentence, you don't have a product problem yet — you have a feature request.",
  },
  {
    principle: "Tradeoffs are first-class objects.",
    explanation:
      "Every real decision has a viable rejected option. Naming it — and what it would have given up — is not optional. It's what makes a decision defensible when circumstances change.",
  },
  {
    principle: "The 80% case ships fast. The 20% is named, not abandoned.",
    explanation:
      "Deferred scope is always named and tracked. The Phase 2 ticket is created at the same time as Phase 1 scoping. Nothing is abandoned — it's sequenced.",
  },
  {
    principle: "Compliance and audit trail are constraints, not tradeoffs.",
    explanation:
      "They shape data architecture before UX decisions. Soft deletes over hard deletes. Case IDs on all communications. Control authority is assigned at the right layer before shipping.",
  },
  {
    principle: "Self-service over operational dependency.",
    explanation:
      "The north star: if a partner or merchant can do it safely themselves, they should. Every shipped feature is one step closer to the architecture where people don't need to call support.",
  },
  {
    principle: "AI eliminates operational work, not thinking.",
    explanation:
      "AI features are prioritized by what operational work they remove entirely. Agentic actions first. Revenue alerts second. Contextual hints last. Easier to build is not a prioritization criterion.",
  },
];

const background = [
  {
    area: "Domain",
    detail: "B2B fintech · Partner portals · Payment platforms · Compliance systems · AI product strategy",
  },
  {
    area: "Product work",
    detail: "13+ major initiatives · 18+ documented cross-team decisions · 6 years",
  },
  {
    area: "Specializations",
    detail: "Platform architecture · ISO partner portals · KYB/KYC flows · Settlement & reconciliation · Card issuing · Case management",
  },
  {
    area: "AI work",
    detail: "Scoped and architected an AI assistant for ISO partner portfolio management. Defined three-layer architecture: agentic actions → revenue alerts → contextual hints.",
  },
  {
    area: "Operating model",
    detail: "Simultaneously at feature-spec depth and business unit strategic level. Sole spec author on all primary-ownership initiatives.",
  },
];

export default function AboutPage() {
  return (
    <>
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-4xl px-6 pb-24 pt-12">

          {/* Page header */}
          <div className="mb-16 border-b border-zinc-100 pb-12">
            <p className="mb-3 font-mono text-xs font-medium uppercase tracking-widest text-zinc-400">
              The Builder
            </p>
            <h1 className="mb-4 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
              Liran Ben Ishay
            </h1>
            <p className="text-xl text-zinc-500 leading-relaxed max-w-2xl">
              Product Manager · Fintech · B2B Platform Products
            </p>
          </div>

          {/* Why I built this */}
          <section className="mb-20">
            <h2 className="mb-8 text-2xl font-semibold tracking-tight text-zinc-900">
              Why I built Clearspec.
            </h2>
            <div className="space-y-6 text-base leading-relaxed text-zinc-600 max-w-3xl">
              <p>
                I'm a Product Manager with six years in fintech — partner portals, payment
                platforms, compliance systems, and AI product strategy. I've shipped case
                management systems for financial crime operations, rebuilt partner pricing
                frameworks from scratch, and scoped AI products for ISO partners managing
                hundreds of merchants simultaneously.
              </p>
              <p>
                Over those years I noticed something. Every time a new person joined my team, I
                had to re-explain why a decision was made. Why we soft-delete instead of
                hard-delete. Why ISO merchants don't get direct support access. Why the permission
                tier must be resolved before design starts. The knowledge lived in my head, not
                in a system. When I was on reserve duty, it lived nowhere.
              </p>
              <p>
                I started documenting decisions differently. Not just what was decided, but what
                was rejected and why. Not just the scope, but what was deferred and when it would
                be revisited. Not just the KPIs, but the operational failure that made those
                KPIs the right ones. After six years, I had a complete operating system — one
                that had been stress-tested across compliance audits, CEO-flagged migration
                emergencies, cross-team ownership disputes, and post-launch adoption failures.
              </p>
              <p>
                Clearspec is that system, made public. Not as a portfolio. As a product — one
                that any PM can actually use to make better decisions faster. The methodology
                here is not borrowed from books. It was extracted from real decisions, real
                tradeoffs, and real post-mortems. Some of those decisions were right. A few were
                wrong. All of them are in here.
              </p>
            </div>
          </section>

          {/* Background grid */}
          <section className="mb-20">
            <h2 className="mb-8 text-2xl font-semibold tracking-tight text-zinc-900">
              Background.
            </h2>
            <div className="divide-y divide-zinc-100">
              {background.map((item) => (
                <div
                  key={item.area}
                  className="grid grid-cols-1 gap-2 py-5 sm:grid-cols-4"
                >
                  <div className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400 sm:pt-0.5">
                    {item.area}
                  </div>
                  <div className="text-sm leading-relaxed text-zinc-600 sm:col-span-3">
                    {item.detail}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Product philosophy */}
          <section className="mb-20">
            <h2 className="mb-8 text-2xl font-semibold tracking-tight text-zinc-900">
              Product philosophy.
            </h2>
            <p className="mb-8 max-w-2xl text-zinc-500">
              These are not principles I adopted from books. They are rules that consistently
              govern decisions — extracted from actual behavior across six years and 13 major
              initiatives.
            </p>
            <div className="space-y-0 divide-y divide-zinc-100">
              {philosophy.map((item, i) => (
                <div key={i} className="py-7">
                  <h3 className="mb-3 text-base font-semibold text-zinc-900">
                    {item.principle}
                  </h3>
                  <p className="max-w-2xl text-sm leading-relaxed text-zinc-500">
                    {item.explanation}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* What Clearspec is NOT */}
          <section className="mb-20">
            <h2 className="mb-8 text-2xl font-semibold tracking-tight text-zinc-900">
              What Clearspec is not.
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  label: "Not a portfolio",
                  text: "It doesn't describe what I built. It demonstrates how I decide. The product is the proof.",
                },
                {
                  label: "Not an AI wrapper",
                  text: "The structured questioning flow is the methodology. AI is secondary — used only where it removes operational work, not to generate the thinking.",
                },
                {
                  label: "Not a generic framework",
                  text: "Generic frameworks are correct in the abstract and useless in the specific. Every rule in Clearspec has a real decision behind it.",
                },
                {
                  label: "Not complete",
                  text: "This is V1. The Phase 2 list exists. Saved records, export, and AI-assisted elaboration are committed and tracked — not abandoned.",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-zinc-100 bg-zinc-50 p-6"
                >
                  <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">
                    {item.label}
                  </p>
                  <p className="text-sm leading-relaxed text-zinc-600">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA strip */}
          <section className="rounded-xl border border-zinc-900 bg-zinc-950 p-10 text-center">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              Try the framework on a real problem.
            </h2>
            <p className="mb-8 text-zinc-400">
              Six questions. One decision record. No account required.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/try"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100"
              >
                Try the Framework →
              </Link>
              <Link
                href="/example"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
              >
                See an example
              </Link>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
