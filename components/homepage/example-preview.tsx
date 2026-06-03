import Link from "next/link";

export default function ExamplePreview() {
  return (
    <section className="border-t border-zinc-200 bg-white px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-10 sm:mb-12">
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-widest text-zinc-400">
            Output Preview
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            This is what you get.
          </h2>
          <p className="mt-4 max-w-lg text-sm text-zinc-500 sm:text-base">
            The full Decision Record, visible without a login. Nothing hidden.
            The output is yours to copy, paste, and use.
          </p>
        </div>

        {/* Decision record preview — overflow-x scroll on mobile */}
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

          {/* Record content — scrollable on mobile */}
          <div className="decision-record overflow-x-auto p-6 text-zinc-300 sm:p-8">
            <div className="min-w-[280px]">
              <div className="text-zinc-600 mb-4 text-xs sm:text-sm">
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              </div>
              <div className="mb-1 font-semibold text-zinc-100">DECISION RECORD</div>
              <div className="mb-4 text-zinc-500 text-xs">Settlement Transparency Initiative</div>
              <div className="text-zinc-700 mb-6 text-xs sm:text-sm">
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              </div>

              <div className="space-y-5">
                <div>
                  <div className="mb-1 text-[9px] font-semibold uppercase tracking-widest text-zinc-500 sm:text-xs">
                    PROBLEM STATEMENT
                  </div>
                  <div className="text-xs text-zinc-300 sm:text-sm">
                    Merchants had no visibility into settlement status. The tab showed only amount and bank
                    name — no timing, no hold reasons, no next action. This drove avoidable support tickets.
                  </div>
                </div>

                <div>
                  <div className="mb-1 text-[9px] font-semibold uppercase tracking-widest text-zinc-500 sm:text-xs">
                    OPERATIONAL PAIN
                  </div>
                  <div className="text-xs text-zinc-300 sm:text-sm">
                    Merchants emailed support: &quot;Where is my settlement?&quot; Support teams manually queried
                    internal systems and responded with answers that went stale within hours.
                  </div>
                </div>

                <div>
                  <div className="mb-1 text-[9px] font-semibold uppercase tracking-widest text-zinc-500 sm:text-xs">
                    TRADEOFFS
                  </div>
                  <div className="text-xs space-y-1 sm:text-sm">
                    <div>
                      <span className="text-zinc-500">Chosen gives up: </span>
                      <span className="text-zinc-300">Multi-config scenario in V1.</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">Rejected option: </span>
                      <span className="text-zinc-300">Build both scenarios before shipping.</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">Rejected gives up: </span>
                      <span className="text-zinc-300">Timeline — entire merchant base delayed.</span>
                    </div>
                  </div>
                </div>

                <div className="text-zinc-700 text-xs sm:text-sm">
                  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                </div>
                <div className="text-[10px] text-zinc-600">
                  Generated with Clearspec · clearspec.pm
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Link to full example */}
        <div className="mt-6 text-center sm:mt-8">
          <Link
            href="/example"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900"
          >
            See the complete example with open questions and MVP scope →
          </Link>
        </div>
      </div>
    </section>
  );
}
