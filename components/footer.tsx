import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Link
            href="/"
            className="font-mono text-xs font-semibold tracking-tight text-zinc-900"
          >
            CLEARSPEC
          </Link>
          <p className="text-xs text-zinc-400">
            Built by{" "}
            <Link href="/about" className="text-zinc-600 hover:text-zinc-900 transition-colors">
              Liran Ben Ishay
            </Link>
            {" "}· The PM Operating System, Built in Public
          </p>
          <div className="flex items-center gap-6">
            <Link href="/try" className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors">
              Try It
            </Link>
            <Link href="/example" className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors">
              Example
            </Link>
            <Link href="/about" className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors">
              About
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
