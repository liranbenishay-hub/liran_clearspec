import Link from "next/link";

export default function ExamplePreview() {
  return (
    <section className="border-t border-zinc-200 bg-white px-6 py-24">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-12">
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-widest text-zinc-400">
            Output Preview
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            This is what you get.
          </h2>
          <p className="mt-4 max-w-lg text-zinc-500">
            The full Decision Record, visible without a login. Nothing hidden.
            The output is yours to copy, paste, and use.
          </p>
        </div>

        {/* Decision record preview */}
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-950 shadow-xl">
          {/* Window chrome */}
          <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
            <div className="h-3 w-3 rounded-full bg-zinc-700" />
            <div className="h-3 w-3 rounded-full bg-zinc-700" />
            <div className="h-3 w-3 rounded-full bg-zinc-700" />
            <span className="ml-3 font-mono text-xs text-zinc-500">
              decision-record.md
            </span>
          </div>

          {/* Record content */}
          <div className="decision-record overflow-hidden p-8 text-zinc-300">
            <div className="text-zinc-600 mb-4">
              ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            </div>
            <div className="mb-1 font-semibold text-zinc-100">DECISION RECORD</div>
            <div className="mb-4 text-zinc-500">Settlement Transparency Initiative</div>
            <div className="text-zinc-700 mb-6">
              ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            </div>

            <div className="space-y-5">
              <div>
                <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  PROBLEM STATEMENT
                </div>
                <div className="text-sm text-zinc-300">
                  Merchants using the Client Portal had no meaningful visibility into their
                  settlement status. The settlements tab displayed only amount, bank account name,
                  and total — with no indication of timing, hold reasons, or what internal statuses
                  meant. This drove avoidable support contact and eroded merchant trust.
                </div>
              </div>

              <div>
                <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  OPERATIONAL PAIN
                </div>
                <div className="text-sm text-zinc-300">
                  Merchants opened support tickets to ask: "Where is my settlement?" — questions
                  that required manual investigation by support teams who then queried internal
                  systems to produce an answer that could have been shown directly.
                </div>
                <div className="mt-2 text-sm text-zinc-500">
                  What they were doing instead: Emailing support. Support teams manually querying
                  reconciliation data and responding with status updates that became stale within
                  hours. The cycle repeated every settlement period.
                </div>
              </div>

              <div>
                <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  SUCCESS METRIC
                </div>
                <div className="text-sm text-zinc-300">
                  Settlement-related support ticket reduction
                </div>
              </div>

              <div>
                <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  TRADEOFFS
                </div>
                <div className="text-sm space-y-1">
                  <div>
                    <span className="text-zinc-500">Chosen gives up: </span>
                    <span className="text-zinc-300">
                      Multi-settlement-config scenario in V1. Small % of merchants won't see
                      complete data.
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Rejected approach: </span>
                    <span className="text-zinc-300">
                      Building single-config and multi-config together before shipping.
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Rejected gives up: </span>
                    <span className="text-zinc-300">
                      Timeline — delaying the majority from getting any visibility at all.
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-zinc-700">
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              </div>
              <div className="text-xs text-zinc-600">
                Generated with Clearspec · clearspec.pm
              </div>
            </div>
          </div>
        </div>

        {/* Link to full example */}
        <div className="mt-8 text-center">
          <Link
            href="/example"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
          >
            See the complete example with open questions and MVP scope
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
