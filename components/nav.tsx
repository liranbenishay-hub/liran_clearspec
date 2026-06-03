"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavProps {
  variant?: "dark" | "light";
}

export default function Nav({ variant = "light" }: NavProps) {
  const pathname = usePathname();

  const isDark = variant === "dark";

  const linkClass = (href: string) => {
    const isActive = pathname === href;
    const base = "text-sm font-medium transition-colors duration-150";
    if (isDark) {
      return `${base} ${isActive ? "text-white" : "text-zinc-400 hover:text-white"}`;
    }
    return `${base} ${isActive ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-900"}`;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 ${
        isDark
          ? "border-b border-zinc-800 bg-zinc-950/90"
          : "border-b border-zinc-200 bg-white/90"
      } backdrop-blur-sm`}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className={`font-mono text-sm font-semibold tracking-tight ${
              isDark ? "text-white" : "text-zinc-900"
            }`}
          >
            CLEARSPEC
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-8">
            <Link href="/try" className={linkClass("/try")}>
              Try It
            </Link>
            <Link href="/example" className={linkClass("/example")}>
              Example
            </Link>
            <Link href="/about" className={linkClass("/about")}>
              About
            </Link>

            {/* CTA */}
            <Link
              href="/try"
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors duration-150 ${
                isDark
                  ? "bg-white text-zinc-900 hover:bg-zinc-100"
                  : "bg-zinc-900 text-white hover:bg-zinc-700"
              }`}
            >
              Try the Framework →
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
