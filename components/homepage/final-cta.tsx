import Link from "next/link";

export default function FinalCta() {
  return (
    <section className="bg-zinc-950 px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Start with a problem
          <br />
          you're actually working on.
        </h2>
        <p className="mb-10 text-lg text-zinc-400">
          The framework works on any product problem — fintech, SaaS, platform, consumer.
          The questions are the same. The rigor is the same.
        </p>
        <Link
          href="/try"
          className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100"
        >
          Try the Framework
          <span aria-hidden>→</span>
        </Link>
        <p className="mt-6 text-sm text-zinc-600">
          No account required · No data stored · Your thinking, structured
        </p>
      </div>
    </section>
  );
}
