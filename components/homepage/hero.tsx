import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-zinc-950 px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-16">
      <div className="mx-auto max-w-4xl">
        {/* Eyebrow */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          <span className="font-mono text-xs text-zinc-400">
            PM Operating System · V1
          </span>
        </div>

        {/* Headline — responsive text scale */}
        <h1 className="mb-5 text-[2rem] font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
          The PM Operating System,
          <br />
          <span className="text-zinc-400">Built in Public.</span>
        </h1>

        {/* Sub-headline */}
        <p className="mb-8 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-xl">
          Most PM tools help you write documents.
          <br className="hidden sm:block" />
          <span className="text-zinc-200"> Clearspec forces you to think first.</span>
        </p>

        {/* CTAs */}
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <Link
            href="/products/pm-operating-system"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 sm:w-auto sm:justify-start"
          >
            Try the Framework
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/example"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white sm:w-auto sm:justify-start"
          >
            See an example
          </Link>
        </div>

        {/* Trust signal */}
        <p className="mt-6 text-xs text-zinc-600">
          No account required · No data stored · Your thinking, structured
        </p>
      </div>
    </section>
  );
}
