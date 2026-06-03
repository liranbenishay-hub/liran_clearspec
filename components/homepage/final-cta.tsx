import Link from "next/link";

export default function FinalCta() {
  return (
    <section className="bg-zinc-950 px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-5 text-2xl font-semibold tracking-tight text-white sm:text-4xl">
          Start with a problem
          <br />
          you&apos;re actually working on.
        </h2>
        <p className="mb-8 text-sm text-zinc-400 sm:text-lg">
          The framework works on any product problem — fintech, SaaS, platform, consumer.
          The questions are the same. The rigor is the same.
        </p>
        <Link
          href="/products/pm-operating-system"
          className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 sm:px-8 sm:py-4"
        >
          Try the Framework →
        </Link>
        <p className="mt-5 text-xs text-zinc-600">
          No account required · No data stored · Your thinking, structured
        </p>
      </div>
    </section>
  );
}
