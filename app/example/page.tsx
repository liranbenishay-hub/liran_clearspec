import Link from "next/link";
import Footer from "@/components/footer";

export const metadata = {
  title: "Example Decision Record — Clearspec",
  description:
    "A complete Decision Record from a real fintech initiative. See the Clearspec framework applied to a Merchant Settlement Transparency product decision.",
};

const openQuestions = [
  {
    id: 1,
    question:
      "Maximum settlement records per merchant from the reconciliation API — required before committing to single-API architecture for list + banner data.",
    owner: "Reconciliation / EP team",
    note: "Must resolve before architecture is finalized.",
  },
  {
    id: 2,
    question:
      "Proof of Payment data availability by settlement partner — confirmation of which payment partners have POP data in reconciliation before surfacing the download button.",
    owner: "FinOps",
    note: "Must resolve before QA.",
  },
];

export default function ExamplePage() {
  return (
    <>
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-4xl px-6 pb-24 pt-12">

          {/* Page header */}
          <div className="mb-12 border-b border-zinc-100 pb-10">
            <p className="mb-2 font-mono text-xs font-medium uppercase tracking-widest text-zinc-400">
              Example · Fintech Platform
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              Merchant Settlement Transparency Initiative
            </h1>
            <p className="mt-4 max-w-2xl text-zinc-500">
              A complete Decision Record applied to a real product problem in a fintech merchant
              portal. Every element below — the deferred scope, the tradeoff rationale, the
              pagination risk — is extracted from an actual product decision.
            </p>
            <p className="mt-3 text-sm text-zinc-400">
              Note: Company and system names have been abstracted. The methodology and decisions are real.
            </p>
          </div>

          {/* The Decision Record */}
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-950 shadow-xl">

            {/* Window chrome */}
            <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-zinc-700" />
              <div className="h-3 w-3 rounded-full bg-zinc-700" />
              <div className="h-3 w-3 rounded-full bg-zinc-700" />
              <span className="ml-3 font-mono text-xs text-zinc-500">
                decision-record · settlement-transparency-v1.md
              </span>
            </div>

            {/* Record body */}
            <div className="decision-record p-8 sm:p-12 text-zinc-300">

              {/* Title block */}
              <Divider />
              <div className="mb-1 font-semibold text-zinc-100 text-base">DECISION RECORD</div>
              <div className="mb-1 text-zinc-400 text-sm">Settlement Transparency Initiative</div>
              <div className="mb-4 text-zinc-600 text-xs">Extracted from real product work · Names abstracted</div>
              <Divider />

              {/* Problem statement */}
              <Section label="PROBLEM STATEMENT">
                <p>
                  Merchants using the Client Portal had no meaningful visibility into their
                  settlement status. The settlements tab displayed only amount, bank account name,
                  and total — with no indication of timing, hold reasons, required actions, or
                  what internal statuses meant to the merchant. This drove avoidable support
                  contact and eroded merchant trust in the platform.
                </p>
              </Section>

              {/* Operational pain */}
              <Section label="OPERATIONAL PAIN">
                <p>
                  Merchants opened support tickets to ask: &quot;Where is my settlement?&quot; and
                  &quot;Why is my settlement on hold?&quot; — questions that required manual
                  investigation by support teams who then had to query internal systems to produce
                  an answer that could have been shown directly in the product.
                </p>
                <div className="mt-4 pl-4 border-l border-zinc-700">
                  <span className="text-zinc-500">What they were doing instead: </span>
                  <span>
                    Merchants were emailing support teams. Support teams were querying internal
                    reconciliation data manually and responding with status updates that became
                    stale within hours. The cycle repeated for every settlement period. There was
                    no self-service path.
                  </span>
                </div>
              </Section>

              {/* Success metric */}
              <Section label="SUCCESS METRIC">
                <p className="text-zinc-200 font-medium">
                  Settlement-related support ticket reduction
                </p>
                <p className="mt-2 text-zinc-500 text-xs">
                  Secondary: Reduction in inbound support emails referencing settlement status,
                  timing, or hold reasons.
                </p>
              </Section>

              <ThinDivider />

              {/* MVP Scope */}
              <Section label="MVP SCOPE">
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-green-400 text-sm">✓</span>
                      <span className="text-zinc-300 text-xs font-semibold uppercase tracking-widest">
                        Build now (80% case)
                      </span>
                    </div>
                    <ul className="space-y-1.5 ml-4 text-sm text-zinc-300">
                      <li>— Standardized settlement record: amount, currency, merchant-facing status, ETA, initiation date, expected arrival date, bank account</li>
                      <li>— On-hold indicator with human-readable reason</li>
                      <li>— Return / failure reason and recommended next action</li>
                      <li>— Internal → merchant-facing status mapping (simplified for comprehension)</li>
                      <li>— Proof of Payment (POP) download when status is &quot;Sent&quot; and data is available</li>
                      <li>— Settlements moved to primary navigation (not buried in account settings)</li>
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-zinc-600 text-sm">○</span>
                      <span className="text-zinc-500 text-xs font-semibold uppercase tracking-widest">
                        Phase 2 (committed, not abandoned)
                      </span>
                    </div>
                    <ul className="space-y-1.5 ml-4 text-sm text-zinc-500">
                      <li>— Multi-settlement-configuration scenario (deferred pending reconciliation team data confirmation)</li>
                      <li>— Partner-facing settlement view in the Partner Portal (separate initiative, separate scope)</li>
                      <li>— Proof of Payment automation for additional payment partners beyond the initial two</li>
                    </ul>
                  </div>
                </div>
              </Section>

              <ThinDivider />

              {/* Tradeoffs */}
              <Section label="TRADEOFFS">
                <div className="space-y-4">
                  <div>
                    <span className="text-zinc-500 text-xs uppercase tracking-wider">Chosen approach gives up: </span>
                    <p className="mt-1">
                      Multi-settlement-config scenario in the first release. A small percentage of
                      merchants with multiple settlement configurations will not see complete data
                      in V1. This is an acceptable tradeoff given that single-config covers the
                      vast majority of the merchant base.
                    </p>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-xs uppercase tracking-wider">Rejected alternative: </span>
                    <p className="mt-1">
                      Building both the single-config and multi-config settlement scenarios together
                      before shipping any transparency improvements to any merchant.
                    </p>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-xs uppercase tracking-wider">Rejected alternative would have given up: </span>
                    <p className="mt-1">
                      Timeline. The reconciliation team could not confirm the maximum settlement
                      record count needed to safely architect the multi-config view before the
                      intended launch window. Waiting would have delayed the entire merchant base
                      from receiving any settlement visibility — including the merchants generating
                      the highest support ticket volume.
                    </p>
                  </div>
                </div>
              </Section>

              <ThinDivider />

              {/* Open questions */}
              <Section label="OPEN QUESTIONS">
                <div className="space-y-4">
                  {openQuestions.map((q) => (
                    <div key={q.id} className="flex items-start gap-3">
                      <span className="text-zinc-600 mt-0.5 shrink-0">□</span>
                      <div>
                        <p className="text-zinc-300">{q.question}</p>
                        <p className="mt-1 text-xs text-zinc-600">
                          Owner: <span className="text-zinc-400">{q.owner}</span>
                          {q.note && (
                            <> · <span className="text-zinc-500">{q.note}</span></>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Footer */}
              <Divider />
              <div className="text-xs text-zinc-600">
                Generated with Clearspec · clearspec.pm<br />
                The PM Operating System, Built in Public.
              </div>
              <Divider />

            </div>
          </div>

          {/* Methodology callout */}
          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            <CalloutCard
              label="Operational pain first"
              text="The discovery started from support ticket volume — not from a feature request or a user research session. The problem was already measurable."
            />
            <CalloutCard
              label="Explicit tradeoffs"
              text="The multi-config scenario was not cut because it was hard. It was deferred because the reconciliation team couldn't confirm a data constraint before the launch window."
            />
            <CalloutCard
              label="Open questions as blockers"
              text="The pagination risk was named in the spec before any engineering commitment was made. It was a named blocker, not a note in a Slack thread."
            />
          </div>

          {/* CTA */}
          <div className="mt-16 rounded-xl border border-zinc-100 bg-zinc-50 p-8 text-center">
            <h2 className="mb-3 text-xl font-semibold text-zinc-900">
              Apply this framework to your own product problem.
            </h2>
            <p className="mb-6 text-zinc-500">
              Six questions. One decision record. No account required.
            </p>
            <Link
              href="/try"
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
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

// ── Sub-components ──────────────────────────────────────────────────────────

function Divider() {
  return (
    <div className="decision-record text-zinc-700 my-5">
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    </div>
  );
}

function ThinDivider() {
  return <div className="my-6 border-t border-zinc-800" />;
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
        {label}
      </div>
      <div className="text-sm leading-relaxed text-zinc-300">{children}</div>
    </div>
  );
}

function CalloutCard({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6">
      <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">
        {label}
      </p>
      <p className="text-sm leading-relaxed text-zinc-600">{text}</p>
    </div>
  );
}
