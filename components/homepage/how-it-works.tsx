const steps = [
  {
    number: "01",
    label: "Describe the problem",
    description: "Start with the broken process, not the feature you want to build.",
  },
  {
    number: "02",
    label: "Name the operational pain",
    description: "Who is suffering? What are they doing instead? Quantify the cost.",
  },
  {
    number: "03",
    label: "Define success",
    description: "One metric. If you can't name it before scoping, you're not done with discovery.",
  },
  {
    number: "04",
    label: "Scope the 80% case",
    description: "Build the most common scenario. Name and commit to Phase 2 at the same time.",
  },
  {
    number: "05",
    label: "Document the tradeoff",
    description: "Name the rejected alternative. Name what each option gives up.",
  },
  {
    number: "06",
    label: "Surface open questions",
    description: "Blockers are first-class objects. Name them, assign ownership, don't hide them.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-zinc-50 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-16 max-w-xl">
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-widest text-zinc-400">
            The Framework
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            Six questions.
            <br />
            One decision record.
          </h2>
          <p className="mt-4 text-zinc-500">
            The output is a structured Decision Record — the same format used across 13 product
            initiatives and 18 cross-team decisions in production fintech platforms.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid gap-px bg-zinc-200 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white p-8"
            >
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
