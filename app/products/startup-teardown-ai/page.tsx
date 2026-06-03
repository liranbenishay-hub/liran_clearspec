import Link from "next/link";
import Footer from "@/components/footer";

export const metadata = {
  title: "Startup Teardown AI — Liran Ben Ishay",
  description:
    "Paste a startup URL. Get a structured product analysis covering ICP, value proposition, UX gaps, competitive risks, and AI opportunities.",
};

const outputSections = [
  {
    label: "WHAT THEY DO",
    content:
      "A B2B embedded payments platform enabling SaaS companies to add payment processing to their product without building infrastructure from scratch. Developer-first go-to-market.",
  },
  {
    label: "LIKELY ICP",
    content:
      "Mid-market SaaS companies (Series A–C, 50–500 employees) that have an existing product and want to monetize through payments or reduce payment infrastructure costs. Engineering-led buying decision.",
  },
  {
    label: "MAIN VALUE PROPOSITION",
    content:
      '"Launch payments in days, not months." The core bet is speed-to-integration over cost reduction. Pre-built compliance handling (KYC, PCI) removes the largest integration barrier for the ICP.',
  },
  {
    label: "PRODUCT STRENGTHS  (3 found)",
    content:
      "□ Clear, comprehensive developer documentation — strong signal of product maturity\n□ API-first architecture makes the self-service integration claim credible\n□ Pre-built compliance handling removes what is typically a 2–3 month blocker for the ICP",
  },
  {
    label: "UX GAPS  (4 found)",
    content:
      "□ Pricing page requires a sales call — self-service pricing is missing at a stage where competitors (Stripe Connect) offer it upfront. This gates developer evaluation.\n□ Onboarding flow has 7 steps before the first API key is visible. Best-in-class: 3 steps or fewer.\n□ Status page is not linked from main navigation — a missing trust signal for enterprise evaluation.\n□ Mobile rendering breaks on the feature comparison table (overflow, no scroll handling).",
  },
  {
    label: "COMPETITIVE RISKS  (2 found)",
    content:
      "□ Stripe Connect covers 80% of the same ICP with significantly more brand trust. The differentiation on compliance depth is credible but not clearly communicated in the hero or pricing page.\n□ No case studies from companies in the target ICP size range. Social proof gap for mid-market evaluation.",
  },
  {
    label: "AI OPPORTUNITIES  (3 found)",
    content:
      "□ AI-powered onboarding: reduce 7-step setup to a guided 3-step flow with smart defaults inferred from company type and tech stack.\n□ Anomaly detection alerts for embedded payment volume drops — increases platform stickiness and reduces partner churn.\n□ AI-generated integration docs for specific tech stacks — reduces time-to-first-API-call from hours to minutes for the developer ICP.",
  },
  {
    label: "PRODUCT IMPROVEMENT IDEAS  (3 found)",
    content:
      "1. Add a self-service sandbox environment — let developers evaluate before scheduling a sales call\n2. Publish transparent pricing with a self-serve tier calculator — remove the evaluation gate\n3. Reduce onboarding steps — eliminate fields that can be inferred or collected post-activation",
  },
];

const strengths = [
  {
    label: "Strategic positioning",
    text: "Identifies whether a product's stated value proposition and its actual UX are aligned — they usually are not.",
  },
  {
    label: "ICP analysis",
    text: "Reads the product experience to infer the real ideal customer — not just who the marketing copy targets.",
  },
  {
    label: "Competitive framing",
    text: "Names the specific competitors and positioning risks rather than producing generic competitive analysis.",
  },
  {
    label: "AI opportunity mapping",
    text: "Identifies where AI could reduce friction, increase stickiness, or create a new product surface — grounded in the existing product gaps.",
  },
];

export default function StartupTeardownAIPage() {
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
                Input: Startup URL
              </span>
            </div>
            <h1 className="mb-3 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
              Startup Teardown AI
            </h1>
            <p className="mb-6 text-base text-zinc-400 sm:text-xl">
              Paste a startup URL. Get ICP, UX gaps, and product opportunities.
            </p>
            <p className="max-w-xl text-sm leading-relaxed text-zinc-500 sm:text-base">
              A product analysis tool that reviews a startup website and returns structured findings
              on what the company does, who it targets, where the UX fails, what competitive risks
              exist, and where AI could create new product value.
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
              Competitive research is usually too shallow or too slow.
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-zinc-600 sm:text-base">
              <p>
                When a PM looks at a competitor or a new market entrant, the output is usually a
                slide with bullet points — gathered manually, without a consistent framework, and
                missing the things that actually matter: what the product is actually doing versus
                what it claims to do, who it is really targeting, and where the gaps are.
              </p>
              <p>
                Startup Teardown AI applies the same analysis framework a senior PM would use —
                reading the product experience, not just the marketing page — and returns structured
                findings in minutes.
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
                { role: "Product Managers", use: "Competitive research before a strategy review, board prep, or product positioning decision." },
                { role: "Investors", use: "Quick structured read of a new company before a deeper evaluation." },
                { role: "Founders", use: "Understand how a competitor or substitute product is perceived from the outside." },
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
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">https://example-embedded-payments-startup.com</span>
                <span className="rounded bg-zinc-200 px-2 py-0.5 font-mono text-[10px] text-zinc-500">example</span>
              </div>
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
              What the teardown returns.
            </h2>
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-950 shadow-lg">
              <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-zinc-700" />
                <div className="h-3 w-3 rounded-full bg-zinc-700" />
                <div className="h-3 w-3 rounded-full bg-zinc-700" />
                <span className="ml-3 font-mono text-xs text-zinc-500">startup-teardown.md</span>
              </div>
              <div className="overflow-x-auto p-6 sm:p-8">
                <div className="decision-record min-w-[300px] space-y-6 text-zinc-300">
                  <div>
                    <div className="text-zinc-700 text-xs">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                    <div className="mt-2 font-semibold text-zinc-100">STARTUP TEARDOWN REPORT</div>
                    <div className="mt-1 text-xs text-zinc-500">Target: https://example-embedded-payments-startup.com</div>
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
                    Generated by Startup Teardown AI · Clearspec PM Tools
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
              Strategic product thinking, applied quickly.
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
              See the thinking that built this product.
            </h2>
            <p className="mb-6 text-sm text-zinc-400">
              Startup Teardown AI is in design. The example output above is a real analysis pattern
              I apply manually — the tool automates it.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button
                disabled
                className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-zinc-800 px-6 py-3 text-sm font-medium text-zinc-500 sm:w-auto"
              >
                Try Demo — Coming Soon
              </button>
              <Link
                href="/about"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-300 transition-colors hover:text-white sm:w-auto"
              >
                About the PM behind this →
              </Link>
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
