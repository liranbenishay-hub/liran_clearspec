"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// ── Navigation structure ─────────────────────────────────────────────────────
// These sections are designed to be replaced independently.
// Product Cases and PM Operating System are the two sections flagged for future expansion.

const WORK_ITEMS = [
  {
    label: "Product Cases",
    href: "/example",
    description: "Real decisions, real tradeoffs",
  },
  {
    label: "PM Operating System",
    href: "/try",
    description: "The framework in action",
  },
];

const PERSONAL_ITEMS = [
  {
    label: "About Me",
    href: "/about",
    description: "Background and philosophy",
  },
  {
    label: "Resume",
    href: null, // disabled — replace with external link or /resume route when ready
    description: "Coming soon",
    disabled: true,
  },
];

// ── Sidebar component ────────────────────────────────────────────────────────

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── Mobile hamburger button ── */}
      <button
        className="fixed left-4 top-4 z-50 flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-400 md:hidden"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
      >
        {mobileOpen ? (
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar panel ── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-zinc-950
          border-r border-zinc-800/60
          transition-transform duration-200 ease-in-out
          md:translate-x-0 md:static md:h-screen md:sticky md:top-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* ── Brand ── */}
        <div className="border-b border-zinc-800/60 px-5 py-5">
          <Link
            href="/"
            className="block"
            onClick={() => setMobileOpen(false)}
          >
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-100">
              Clearspec
            </p>
            <p className="mt-0.5 text-xs text-zinc-500">
              Liran Ben Ishay
            </p>
          </Link>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-5">

          {/* Work section — designed to be replaced/expanded */}
          <div>
            <p className="mb-1.5 px-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
              Work
            </p>
            <ul className="space-y-0.5">
              {WORK_ITEMS.map((item) => (
                <NavItem
                  key={item.href}
                  label={item.label}
                  href={item.href!}
                  active={pathname === item.href || pathname?.startsWith(item.href + "/")}
                  onClick={() => setMobileOpen(false)}
                />
              ))}
            </ul>
          </div>

          {/* Personal section */}
          <div>
            <p className="mb-1.5 px-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
              About
            </p>
            <ul className="space-y-0.5">
              {PERSONAL_ITEMS.map((item) => (
                item.disabled ? (
                  <DisabledNavItem key={item.label} label={item.label} />
                ) : (
                  <NavItem
                    key={item.href}
                    label={item.label}
                    href={item.href!}
                    active={pathname === item.href}
                    onClick={() => setMobileOpen(false)}
                  />
                )
              ))}
            </ul>
          </div>

        </nav>

        {/* ── Bottom: Settings (coming soon) ── */}
        <div className="border-t border-zinc-800/60 px-3 py-4">
          <div className="flex items-center gap-2.5 rounded-md px-2 py-2 opacity-40 cursor-not-allowed">
            <svg
              width="14"
              height="14"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
              className="shrink-0 text-zinc-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-xs text-zinc-500">Settings</span>
            <span className="ml-auto rounded px-1.5 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wide text-zinc-700 border border-zinc-800">
              soon
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function NavItem({
  label,
  href,
  active,
  onClick,
}: {
  label: string;
  href: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className={`
          flex items-center rounded-md px-2 py-2 text-sm transition-colors duration-100
          ${active
            ? "bg-zinc-800 text-zinc-100"
            : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
          }
        `}
      >
        {active && (
          <span className="mr-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
        )}
        <span className={active ? "" : "ml-[14px]"}>{label}</span>
      </Link>
    </li>
  );
}

function DisabledNavItem({ label }: { label: string }) {
  return (
    <li>
      <span className="flex cursor-not-allowed items-center rounded-md px-2 py-2 text-sm text-zinc-700 opacity-50">
        <span className="ml-[14px]">{label}</span>
        <svg
          width="10"
          height="10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          className="ml-1.5 text-zinc-700"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </span>
    </li>
  );
}
