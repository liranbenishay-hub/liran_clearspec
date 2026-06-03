import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <Link
            href="/"
            className="font-mono text-xs font-semibold tracking-tight text-zinc-900"
          >
            CLEARSPEC
          </Link>
          <p className="text-xs text-zinc-400">
            Built by{" "}
            <Link href="/about" className="text-zinc-600 transition-colors hover:text-zinc-900">
              Liran Ben Ishay
            </Link>
            {" "}· PM Operating System, Built in Public
          </p>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/products/pm-operating-system" className="text-xs text-zinc-400 transition-colors hover:text-zinc-700">
              Try It
            </Link>
            <Link href="/example" className="text-xs text-zinc-400 transition-colors hover:text-zinc-700">
              Example
            </Link>
            <Link href="/about" className="text-xs text-zinc-400 transition-colors hover:text-zinc-700">
              About
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
