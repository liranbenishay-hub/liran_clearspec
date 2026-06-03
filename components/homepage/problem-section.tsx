export default function ProblemSection() {
  return (
    <section className="border-t border-zinc-200 bg-white px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-8 text-2xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-4xl">
          Most PMs describe what they built.
          <br />
          <span className="text-zinc-400">They rarely show how they decided.</span>
        </h2>

        <div className="space-y-5 text-sm leading-relaxed text-zinc-600 sm:text-base">
          <p>
            Case studies describe outcomes. They don&apos;t show the moment of decision — what was
            rejected, what was deferred, who had the authority, what the tradeoff cost. A hiring
            manager reading a PM&apos;s portfolio sees a series of wins with the hard parts edited out.
          </p>
          <p>
            PM frameworks describe what good product managers should do. They don&apos;t capture what
            happens when compliance and UX flexibility are in tension, when a CEO flag overrides
            standard prioritization, or when a cross-team ownership gap turns a shipped feature into
            a production bug. Generic frameworks are correct in the abstract and useless in the specific.
          </p>
          <p>
            Clearspec is different because it was extracted from real decisions — not synthesized from
            best practices. It is a PM operating system applied to fintech platforms, partner portals,
            compliance systems, and AI product strategy across six years of actual product work.
          </p>
        </div>
      </div>
    </section>
  );
}
