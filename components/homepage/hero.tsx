import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-zinc-950 px-6 pb-24 pt-16">
      <div className="mx-auto max-w-4xl">
        {/* Eyebrow */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          <span className="font-mono text-xs text-zinc-400">
            PM Operating System · V1
          </span>
        </div>

        {/* Headline */}
        <h1 className="mb-6 text-5xl font-semibold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
          The PM Operating System,
          <br />
          <span className="text-zinc-400">Built in Public.</span>
        </h1>

        {/* Sub-headline */}
        <p className="mb-10 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
          Most PM tools help you write documents.
          <br />
          <span className="text-zinc-200">Clearspec forces you to think first.</span>
        </p>

        {/* CTA */}
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/try"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100"
          >
            Try the Framework
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/example"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
          >
            See an example
          </Link>
        </div>

        {/* Trust signal */}
        <p className="mt-8 text-xs text-zinc-600">
          No account required · No data stored · Your thinking, structured
        </p>
      </div>
    </section>
  );
}
