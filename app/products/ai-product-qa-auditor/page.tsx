import Link from "next/link";
import Footer from "@/components/footer";
import AuditTool from "@/components/tool/audit-tool";

export const metadata = {
  title: "AI Product QA Auditor — Liran Ben Ishay",
  description:
    "Enter any product URL. Get a structured audit covering clarity, UX friction, mobile issues, missing trust signals, and a QA checklist for the next release.",
};

const strengths = [
  {
    label: "Product judgment",
    text: "Identifies what a product is trying to do from the live experience — not from the marketing copy.",
  },
  {
    label: "UX thinking",
    text: "Spots friction that accumulates invisibly: competing CTAs, buried navigation, missing outcomes in headlines.",
  },
  {
    label: "QA discipline",
    text: "Produces a ready-to-use checklist tied directly to the issues found — not a generic template.",
  },
  {
    label: "Risk awareness",
    text: "Distinguishes cosmetic issues from broken flows and security risks, with explicit priority.",
  },
];

export default function AIProductQAAuditorPage() {
  return (
    <>
      <main className="min-h-screen bg-white">

        {/* Hero */}
        <div className="bg-zinc-950 px-5 py-12 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-900 bg-blue-950 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                <span className="font-mono text-xs text-blue-300">Beta · Demo Mode</span>
              </span>
              <span className="rounded-full border border-zinc-800 px-3 py-1 font-mono text-xs text-zinc-600">
                Input: URL
              </span>
            </div>
            <h1 className="mb-3 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
              AI Product QA Auditor
            </h1>
            <p className="mb-4 text-base text-zinc-400 sm:text-xl">
              Enter a URL. Get a structured product, UX, and QA audit.
            </p>
            <p className="max-w-xl text-sm leading-relaxed text-zinc-500">
              Reviews a live product page and returns structured findings across clarity,
              UX friction, mobile issues, missing trust signals, and a QA checklist — written
              the way a senior PM would flag issues, not a generic linter.
            </p>
          </div>
        </div>

        {/* The tool */}
        <div className="border-b border-zinc-100 px-5 py-12 sm:px-8 sm:py-14">
          <div className="mx-auto max-w-3xl">
            <AuditTool />
          </div>
        </div>

        {/* What it covers */}
        <div className="bg-zinc-50 px-5 py-14 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">
              What the audit covers
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: "Product Summary", text: "What the product appears to do based on the live page experience." },
                { label: "Clarity Score", text: "How quickly a new visitor understands the core value proposition." },
                { label: "UX Friction Points", text: "Specific friction that increases drop-off or reduces conversion." },
                { label: "Mobile Responsiveness", text: "Layout and interaction issues on narrow viewports." },
                { label: "Missing Trust Signals", text: "What is absent that enterprise or B2B buyers look for." },
                { label: "Top 5 Recommended Fixes", text: "Prioritised by impact, not by ease of implementation." },
                { label: "QA Checklist", text: "A ready-to-use checklist for the next release cycle." },
                { label: "Severity levels", text: "Issues are ranked — cosmetic, friction, risky, and broken." },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-zinc-200 bg-white p-4">
                  <p className="mb-1 text-sm font-semibold text-zinc-900">{item.label}</p>
                  <p className="text-xs leading-relaxed text-zinc-500">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Who it's for */}
        <div className="border-b border-zinc-100 px-5 py-14 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Who it is for
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { role: "Product Managers", use: "Audit a competitor product or run a pre-launch review before go/no-go." },
                { role: "Founders", use: "Review your own product through a structured external lens without hiring a consultant." },
                { role: "QA Engineers", use: "Get a structured starting checklist before manual test planning begins." },
              ].map((item) => (
                <div key={item.role} className="rounded-lg border border-zinc-200 bg-white p-5">
                  <p className="mb-2 text-sm font-semibold text-zinc-900">{item.role}</p>
                  <p className="text-xs leading-relaxed text-zinc-500">{item.use}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PM strengths */}
        <div className="bg-zinc-50 px-5 py-14 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">
              What this demonstrates
            </p>
            <h2 className="mb-8 text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">
              Product, UX, and QA thinking in one output.
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
              Try a structured decision record next.
            </h2>
            <p className="mb-6 text-sm text-zinc-400">
              The PM Operating System applies the same rigour to your next product decision.
            </p>
            <Link
              href="/products/pm-operating-system"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
            >
              Try the PM OS Framework →
            </Link>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
