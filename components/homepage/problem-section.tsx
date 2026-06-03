export default function ProblemSection() {
  return (
    <section className="border-t border-zinc-200 bg-white px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-10 text-3xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-4xl">
          Most PMs describe what they built.
          <br />
          <span className="text-zinc-400">They rarely show how they decided.</span>
        </h2>

        <div className="space-y-6 text-base leading-relaxed text-zinc-600">
          <p>
            Case studies describe outcomes. They don't show the moment of decision — what was
            rejected, what was deferred, who had the authority, what the tradeoff cost. A hiring
            manager reading a PM's portfolio sees a series of wins with the hard parts edited out.
          </p>
          <p>
            PM frameworks describe what good product managers should do. They don't capture what
            happens when compliance and UX flexibility are in tension, when a CEO flag overrides
            standard prioritization, when a cross-team ownership gap turns a shipped feature into a
            production bug. Generic frameworks are correct in the abstract and useless in the specific.
          </p>
          <p>
            Clearspec is different because it was extracted from real decisions — not synthesized
            from best practices. It is a PM operating system that has been applied to fintech
            platforms, partner portals, compliance systems, and AI product strategy across six years
            of actual product work. The methodology here is not borrowed from books. Some of the
            decisions in it were right. A few were wrong. All of them are in here.
          </p>
        </div>
      </div>
    </section>
  );
}
