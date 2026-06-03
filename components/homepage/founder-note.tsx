import Link from "next/link";

export default function FounderNote() {
  return (
    <section className="bg-zinc-50 px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 font-mono text-xs font-medium uppercase tracking-widest text-zinc-400">
          Why I built this
        </p>

        <h2 className="mb-10 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          A note from the founder.
        </h2>

        <div className="space-y-6 text-base leading-relaxed text-zinc-600">
          <p>
            I'm Liran Ben Ishay, a Product Manager with six years in fintech — partner portals,
            payment platforms, compliance systems, and AI product strategy. I've shipped case
            management systems for financial crime operations, rebuilt partner pricing frameworks
            from scratch, and scoped AI products for ISO partners managing hundreds of merchants.
          </p>
          <p>
            Over those years I noticed something. Every time a new person joined my team, I had to
            re-explain why a decision was made. Why we soft-delete instead of hard-delete. Why ISO
            merchants don't get direct support access. Why the permission tier must be resolved
            before design starts. The knowledge lived in my head, not in a system. When I was on
            reserve duty, it lived nowhere.
          </p>
          <p>
            Clearspec is the system I built to fix that — first for myself, then for anyone who
            thinks product decisions should be documented with the same rigor as the products
            themselves. The methodology here is not borrowed from books. It was extracted from real
            decisions, real tradeoffs, and real post-mortems. Some of those decisions were right.
            A few were wrong. All of them are in here.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-6">
          <div>
            <p className="text-sm font-semibold text-zinc-900">Liran Ben Ishay</p>
            <p className="text-sm text-zinc-500">Product Manager · Fintech · B2B Platform Products</p>
          </div>
          <Link
            href="/about"
            className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900"
          >
            More about the thinking behind Clearspec →
          </Link>
        </div>
      </div>
    </section>
  );
}
