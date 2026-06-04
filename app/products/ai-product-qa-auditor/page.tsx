import Link from "next/link";
import Footer from "@/components/footer";
import AuditTool from "@/components/tool/audit-tool";

export const metadata = {
  title: "AI Builder QA Auditor — Liran Ben Ishay",
  description:
    "Audit AI-built websites and generate the exact fix prompts to paste back into Lovable, Base44, Claude, or any AI builder.",
};

const builders = ["Lovable", "Base44", "Claude", "Cursor", "Bolt", "v0", "Replit"];

const auditCovers = [
  { label: "Product clarity", text: "Is the value prop clear within 5 seconds? Is there one dominant CTA?" },
  { label: "UX friction", text: "Where does the flow break? What slows a user down before they get value?" },
  { label: "Mobile responsiveness", text: "Does the layout hold at 375px? Are CTAs accessible without scrolling?" },
  { label: "Trust signals", text: "What proof is missing? Where do enterprise or B2B buyers need reassurance?" },
  { label: "Conversion", text: "Is there a self-service evaluation path? How many steps before value?" },
  { label: "QA risk", text: "Empty states, error handling, permission flows, loading states." },
  { label: "AI-builder risk", text: "Common gaps in AI-built products: auth patterns, form validation, data edge cases." },
  { label: "Content quality", text: "Placeholder copy, generic headlines, outcome-free CTAs." },
];

const fixPromptExample = {
  issue: "Primary CTA is unclear — multiple buttons compete above the fold",
  lovable: `Review the homepage hero section. The current CTA hierarchy is unclear — there are multiple buttons competing for attention.\n\nAction: Make the primary action visually dominant (larger, higher contrast). Rewrite the CTA copy to describe the specific outcome the user gets (e.g. "Start building free" not "Get started"). Remove or visually de-emphasise secondary CTAs above the fold.\n\nKeep the existing visual style, design system, and branding. Do not redesign the navigation, footer, or unrelated sections.`,
  claude: `Inspect the hero section component and fix the CTA hierarchy. Identify which button represents the primary conversion goal.\n\nChanges needed:\n- Make the primary button visually dominant (use the primary color, increase size)\n- Rewrite button copy to be outcome-based\n- Reduce visual weight of secondary buttons\n- Ensure changes are responsive at 375px, 768px, and 1280px\n\nDo not refactor unrelated components. Do not change routing or auth logic.`,
};

export default function AIBuilderQAAuditorPage() {
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
              AI Builder QA Auditor
            </h1>
            <p className="mb-4 text-base text-zinc-400 sm:text-xl">
              Audit AI-built websites. Get the exact fix prompts to improve them.
            </p>
            <p className="mb-6 max-w-xl text-sm leading-relaxed text-zinc-500">
              Built something fast with an AI builder? This tool audits the UX, QA gaps, and product
              clarity issues — then gives you ready-to-copy fix prompts to paste straight back into
              your builder.
            </p>

            {/* Builder logos */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-zinc-600">Works for:</span>
              {builders.map((b) => (
                <span
                  key={b}
                  className="rounded border border-zinc-800 px-2 py-0.5 font-mono text-xs text-zinc-500"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* The tool */}
        <div className="border-b border-zinc-100 px-5 py-12 sm:px-8 sm:py-14">
          <div className="mx-auto max-w-5xl">
            <AuditTool />
          </div>
        </div>

        {/* What the audit covers */}
        <div className="bg-zinc-50 px-5 py-14 sm:px-8">
          <div className="mx-auto max-w-4xl">
            <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">
              What gets audited
            </p>
            <h2 className="mb-8 text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">
              8 categories. Prioritised by impact.
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {auditCovers.map((item) => (
                <div key={item.label} className="rounded-lg border border-zinc-200 bg-white p-4">
                  <p className="mb-1.5 text-xs font-semibold text-zinc-900">{item.label}</p>
                  <p className="text-xs leading-relaxed text-zinc-500">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fix prompts preview */}
        <div className="border-b border-zinc-100 px-5 py-14 sm:px-8">
          <div className="mx-auto max-w-4xl">
            <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Fix prompts
            </p>
            <h2 className="mb-3 text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">
              Not just the issue. The fix, ready to paste.
            </h2>
            <p className="mb-8 max-w-2xl text-sm text-zinc-500">
              Every issue in the audit has a tool-specific fix prompt. Select the builder you used,
              copy the prompt, paste it back in. Done.
            </p>

            {/* Example */}
            <div className="overflow-hidden rounded-xl border border-zinc-200">
              <div className="border-b border-zinc-100 bg-zinc-50 px-5 py-3">
                <p className="font-mono text-xs text-zinc-500">
                  Issue: <span className="text-zinc-800">{fixPromptExample.issue}</span>
                </p>
              </div>
              <div className="grid divide-y divide-zinc-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                <div className="p-5">
                  <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">
                    Lovable prompt
                  </p>
                  <p className="whitespace-pre-line text-xs leading-relaxed text-zinc-700">
                    {fixPromptExample.lovable}
                  </p>
                </div>
                <div className="p-5">
                  <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">
                    Claude prompt
                  </p>
                  <p className="whitespace-pre-line text-xs leading-relaxed text-zinc-700">
                    {fixPromptExample.claude}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why this matters */}
        <div className="bg-zinc-50 px-5 py-14 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">
              What this demonstrates
            </p>
            <h2 className="mb-8 text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">
              Product thinking + AI tooling in one workflow.
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  label: "Product judgment",
                  text: "Identifies what matters for a real product launch — not a generic checklist.",
                },
                {
                  label: "UX thinking",
                  text: "Spots friction that accumulates quietly: competing CTAs, broken mobile states, missing trust.",
                },
                {
                  label: "AI tooling fluency",
                  text: "Knows how to communicate with AI builders — different tools need different prompt styles.",
                },
                {
                  label: "QA discipline",
                  text: "Every issue has severity, effort, and impact. The output is actionable, not advisory.",
                },
              ].map((s) => (
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
              Try it on your next AI-built project.
            </h2>
            <p className="mb-6 text-sm text-zinc-400">
              Enter any URL above. Get a prioritised audit and fix prompts in under 10 seconds.
            </p>
            <Link
              href="/products/pm-operating-system"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
            >
              Also try the PM Operating System →
            </Link>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
