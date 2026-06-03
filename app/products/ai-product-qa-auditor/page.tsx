import Link from "next/link";
import Footer from "@/components/footer";

export const metadata = {
  title: "AI Product QA Auditor — Liran Ben Ishay",
  description:
    "Paste a URL. Get a structured product, UX, and QA audit covering clarity, friction, mobile issues, broken flows, and the top fixes.",
};

const outputSections = [
  {
    label: "PRODUCT SUMMARY",
    content:
      "A B2B payment platform targeting SMBs. Primary use case: accept online payments and manage settlements. Developer-first positioning.",
  },
  {
    label: "CLARITY SCORE  6 / 10",
    content:
      "Value proposition is present but buried. Hero CTA competes with 3 secondary actions. A new visitor cannot identify the primary use case within 5 seconds.",
  },
  {
    label: "UX FRICTION POINTS  (4 found)",
    content:
      "□ Pricing page requires a demo booking — no self-service option\n□ Sign-up asks for company size before showing any product value\n□ Settlement feature is not visible in main navigation\n□ Dashboard screenshot is outdated — shows a \"Beta\" label",
  },
  {
    label: "MOBILE ISSUES  (3 found)",
    content:
      "□ Primary CTA is hidden inside mobile nav collapse\n□ Pricing table overflows horizontally on screens < 375px\n□ Feature description font size falls below 12px on iPhone SE",
  },
  {
    label: "BROKEN OR RISKY FLOWS  (2 found)",
    content:
      "□ RISKY: Password reset email links to a non-HTTPS URL\n□ BROKEN: \"View API docs\" link on pricing page returns 404",
  },
  {
    label: "MISSING TRUST SIGNALS  (3 found)",
    content:
      "□ No security certifications visible above the fold\n□ Customer logos only appear after 3 scroll depths\n□ No SLA or uptime information on the enterprise pricing tier",
  },
  {
    label: "TOP 5 RECOMMENDED FIXES",
    content:
      "1. Move the primary CTA above the fold — remove competing actions\n2. Add self-service pricing — demo-gating increases drop-off by 40%+\n3. Fix the 404 on API docs — developer trust is a conversion signal\n4. Fix the password reset HTTPS link — this is a security issue, not just UX\n5. Show security certifications in the hero — enterprise buyers check first",
  },
  {
    label: "QA CHECKLIST — NEXT RELEASE",
    content:
      "□ Verify all navigation links on mobile viewport\n□ Test sign-up flow on iPhone SE and Pixel 5\n□ Confirm all email links use HTTPS\n□ Audit all external links for 404s\n□ Test pricing table on 320px viewport\n□ Verify primary CTA is accessible via keyboard\n□ Check contrast ratios on all text over dark backgrounds\n□ Test settlement flow end-to-end in staging",
  },
];

const strengths = [
  {
    label: "Product judgment",
    text: "Identifies what a product is trying to do from the live experience — not the marketing copy.",
  },
  {
    label: "UX thinking",
    text: "Spots friction that accumulates invisibly: competing CTAs, buried navigation, outdated screenshots.",
  },
  {
    label: "QA discipline",
    text: "Produces a ready-to-use checklist tied directly to the issues found — not a generic template.",
  },
  {
    label: "Risk awareness",
    text: "Distinguishes cosmetic issues from broken flows and security risks, with explicit severity.",
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
              <span className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
                <span className="font-mono text-xs text-zinc-400">Coming Soon</span>
              </span>
              <span className="rounded-full border border-zinc-800 px-3 py-1 font-mono text-xs text-zinc-600">
                Input: URL
              </span>
            </div>
            <h1 className="mb-3 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
              AI Product QA Auditor
            </h1>
            <p className="mb-6 text-base text-zinc-400 sm:text-xl">
              Paste a URL. Get a structured product, UX, and QA audit.
            </p>
            <p className="max-w-xl text-sm leading-relaxed text-zinc-500 sm:text-base">
              A lightweight AI tool that reviews a live product page and returns structured findings
              across clarity, UX friction, mobile issues, broken flows, missing trust signals, and a
              QA checklist for the next release.
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
              Most product reviews are informal opinions. This is a structured audit.
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-zinc-600 sm:text-base">
              <p>
                When a PM or team lead audits a product, the output is usually a Slack message or a
                scattered doc with no consistent structure, no severity levels, and no actionable next
                step. Important issues get mixed with cosmetic preferences.
              </p>
              <p>
                AI Product QA Auditor applies a consistent review framework to any live product URL —
                producing a structured report with explicit severity, categorized findings, and a
                QA checklist ready to drop into Jira.
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
                { role: "Product Managers", use: "Audit a competitor product or a pre-launch build before go/no-go." },
                { role: "Founders", use: "Review your own product through a structured external lens." },
                { role: "QA Engineers", use: "Get a starting checklist before manual test planning begins." },
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
            <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Example Input
            </p>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">https://example-fintech-platform.com</span>
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
              This is what the audit returns.
            </h2>

            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-950 shadow-lg">
              <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-zinc-700" />
                <div className="h-3 w-3 rounded-full bg-zinc-700" />
                <div className="h-3 w-3 rounded-full bg-zinc-700" />
                <span className="ml-3 font-mono text-xs text-zinc-500">qa-audit-report.md</span>
              </div>
              <div className="overflow-x-auto p-6 sm:p-8">
                <div className="decision-record min-w-[300px] space-y-6 text-zinc-300">
                  <div>
                    <div className="text-zinc-700 text-xs sm:text-sm">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                    <div className="mt-2 font-semibold text-zinc-100">PRODUCT QA AUDIT REPORT</div>
                    <div className="text-zinc-500 text-xs">Target: https://example-fintech-platform.com</div>
                    <div className="mt-2 text-zinc-700 text-xs sm:text-sm">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
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
                  <div className="text-zinc-700 text-xs sm:text-sm">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                  <div className="text-[10px] text-zinc-600">
                    Generated by AI Product QA Auditor · Clearspec PM Tools
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
              Full demo in a future iteration.
            </h2>
            <p className="mb-6 text-zinc-400 text-sm">
              The AI output structure, review logic, and QA framework are fully defined.
              Live AI integration is in progress.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button
                disabled
                className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-zinc-800 px-6 py-3 text-sm font-medium text-zinc-500 sm:w-auto"
              >
                Try Demo — Coming Soon
              </button>
              <Link
                href="/products/clearspec"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-300 transition-colors hover:text-white sm:w-auto"
              >
                See a live product →
              </Link>
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
