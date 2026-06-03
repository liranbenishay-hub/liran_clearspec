const steps = [
  {
    number: "01",
    label: "Describe the problem",
    description: "Start with the broken process, not the feature you want to build.",
  },
  {
    number: "02",
    label: "Name the operational pain",
    description: "Who suffers? What are they doing instead? Quantify the cost.",
  },
  {
    number: "03",
    label: "Define success",
    description: "One metric. If you can't name it before scoping, discovery isn't done.",
  },
  {
    number: "04",
    label: "Scope the 80% case",
    description: "Build the most common scenario. Name and commit to Phase 2.",
  },
  {
    number: "05",
    label: "Document the tradeoff",
    description: "Name the rejected alternative. Name what each option gives up.",
  },
  {
    number: "06",
    label: "Surface open questions",
    description: "Blockers are first-class. Name them, assign ownership.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-zinc-50 px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-10 max-w-xl sm:mb-16">
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-widest text-zinc-400">
            The Framework
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            Six questions.
            <br />
            One decision record.
          </h2>
          <p className="mt-4 text-sm text-zinc-500 sm:text-base">
            The same format used across 13 product initiatives and 18 cross-team decisions
            in production fintech platforms.
          </p>
        </div>

        {/* Steps grid — 1 col on mobile, 2 on sm, 3 on lg */}
        <div className="grid gap-px bg-zinc-200 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="bg-white p-6 sm:p-8">
              <p className="mb-3 font-mono text-2xl font-semibold text-zinc-200">
                {step.number}
              </p>
              <h3 className="mb-2 text-sm font-semibold text-zinc-900">
                {step.label}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
