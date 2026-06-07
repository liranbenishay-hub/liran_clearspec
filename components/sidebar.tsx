"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { PRODUCTS, STATUS_LABELS } from "@/lib/products";
import { useSidebar } from "@/contexts/sidebar-context";

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconHome() {
  return <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
}
function IconBox() {
  return <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
}
function IconUser() {
  return <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
}
function IconDoc() {
  return <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
}
function IconSettings() {
  return <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
}
function IconMenu() {
  return <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>;
}
function IconX() {
  return <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
}
function IconChevronLeft() {
  return <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>;
}
function IconChevronRight() {
  return <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>;
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { collapsed, setCollapsed } = useSidebar();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // ── Mobile top bar ──────────────────────────────────────────────────────────
  return (
    <>
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center border-b border-zinc-800 bg-zinc-950 px-4 lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
          aria-label="Open navigation"
        >
          <IconMenu />
        </button>
        <Link href="/" className="ml-3">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-200">
            Liran Ben Ishay
          </span>
        </Link>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/70 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* ── Sidebar panel ─────────────────────────────────────────────────── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col
          bg-zinc-950 border-r border-zinc-800/60
          transition-all duration-200 ease-in-out
          ${mobileOpen ? "translate-x-0 w-60" : "-translate-x-full w-60"}
          lg:translate-x-0
          ${collapsed ? "lg:w-14" : "lg:w-60"}
        `}
      >
        {/* Brand row */}
        <div className={`flex items-center border-b border-zinc-800/60 ${collapsed ? "lg:justify-center lg:px-0 lg:py-4 px-5 py-5" : "px-5 py-5"}`}>
          <Link
            href="/"
            className={`block min-w-0 ${collapsed ? "lg:hidden" : ""}`}
            onClick={() => setMobileOpen(false)}
          >
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-100">
              Liran Ben Ishay
            </p>
            <p className="mt-0.5 text-xs text-zinc-500">Product Manager</p>
          </Link>

          {/* Collapsed logo dot — desktop only */}
          {collapsed && (
            <Link href="/" className="hidden lg:block" title="Home">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-800 font-mono text-xs font-bold text-zinc-200">
                L
              </span>
            </Link>
          )}

          {/* Close button — mobile only */}
          <button
            onClick={() => setMobileOpen(false)}
            className={`ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-600 hover:text-zinc-300 transition-colors lg:hidden`}
            aria-label="Close"
          >
            <IconX />
          </button>

          {/* Collapse toggle — desktop only */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`hidden lg:flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-zinc-600 hover:text-zinc-300 transition-colors ${collapsed ? "mx-auto" : "ml-auto"}`}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <IconChevronRight /> : <IconChevronLeft />}
          </button>
        </div>

        {/* Navigation */}
        <nav className={`flex flex-1 flex-col gap-1 overflow-y-auto py-4 ${collapsed ? "lg:items-center lg:px-0 px-3" : "px-3"}`}>

          {/* Home */}
          <NavItem
            href="/"
            label="Home"
            icon={<IconHome />}
            active={isActive("/")}
            collapsed={collapsed}
            onClick={() => setMobileOpen(false)}
          />

          {/* Products */}
          <div className={`mt-3 ${collapsed ? "lg:w-full" : ""}`}>
            {!collapsed && (
              <SectionLabel icon={<IconBox />} label="Products" />
            )}
            {collapsed && (
              <div className="hidden lg:flex justify-center py-1">
                <span className="text-zinc-600"><IconBox /></span>
              </div>
            )}
            <div className={`mt-1 space-y-0.5 ${collapsed ? "" : "pl-2"}`}>
              {PRODUCTS.filter((p) => !p.hideFromNav).map((product) => (
                <SubNavItem
                  key={product.id}
                  href={product.href}
                  label={product.title}
                  active={isActive(product.href)}
                  badge={STATUS_LABELS[product.status] || undefined}
                  collapsed={collapsed}
                  onClick={() => setMobileOpen(false)}
                />
              ))}
            </div>
          </div>

          {/* About + Resume */}
          <div className={`mt-3 ${collapsed ? "lg:w-full" : ""}`}>
            {!collapsed && (
              <SectionLabel icon={<IconUser />} label="Personal" />
            )}
            {collapsed && (
              <div className="hidden lg:flex justify-center py-1">
                <span className="text-zinc-600"><IconUser /></span>
              </div>
            )}
            <div className={`mt-1 space-y-0.5 ${collapsed ? "" : "pl-2"}`}>
              <SubNavItem href="/about" label="About Me" active={isActive("/about")} collapsed={collapsed} onClick={() => setMobileOpen(false)} />
              <SubNavItem href="/resume" label="Resume" active={isActive("/resume")} collapsed={collapsed} onClick={() => setMobileOpen(false)} />
            </div>
          </div>
        </nav>

        {/* Settings */}
        <div className={`border-t border-zinc-800/60 py-4 ${collapsed ? "lg:flex lg:justify-center lg:px-0 px-3" : "px-3"}`}>
          <div className={`flex cursor-not-allowed items-center gap-2.5 rounded-md px-2 py-2 opacity-35 ${collapsed ? "lg:justify-center" : ""}`} title="Settings — coming soon">
            <span className="text-zinc-500"><IconSettings /></span>
            {!collapsed && (
              <>
                <span className="text-xs text-zinc-500">Settings</span>
                <span className="ml-auto rounded border border-zinc-800 px-1.5 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wide text-zinc-700">
                  soon
                </span>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 px-2 py-1">
      <span className="text-zinc-600">{icon}</span>
      <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-600">{label}</span>
    </div>
  );
}

function NavItem({
  href, label, icon, active, collapsed, onClick,
}: {
  href: string; label: string; icon: React.ReactNode; active: boolean; collapsed: boolean; onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={`
        flex items-center gap-2.5 rounded-md px-2 py-2 text-sm transition-colors duration-100
        ${collapsed ? "lg:justify-center lg:px-0 lg:w-10 lg:h-10 lg:mx-auto" : ""}
        ${active ? "bg-zinc-800 text-zinc-100" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"}
      `}
    >
      <span className={active ? "text-blue-400" : "text-zinc-600"}>{icon}</span>
      {!collapsed && <span className="lg:inline">{label}</span>}
      <span className={`${collapsed ? "lg:hidden" : "hidden"}`}>{label}</span>
    </Link>
  );
}

function SubNavItem({
  href, label, active, badge, collapsed, onClick,
}: {
  href: string; label: string; active: boolean; badge?: string; collapsed: boolean; onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={`
        flex items-center rounded-md text-sm transition-colors duration-100
        ${collapsed ? "lg:justify-center lg:w-10 lg:h-8 lg:mx-auto lg:px-0 px-2 py-1.5 justify-between" : "px-2 py-1.5 justify-between"}
        ${active ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:bg-zinc-800/40 hover:text-zinc-300"}
      `}
    >
      {/* Collapsed: just a dot */}
      {collapsed ? (
        <span className={`hidden lg:block h-1.5 w-1.5 rounded-full ${active ? "bg-blue-500" : "bg-zinc-700"}`} />
      ) : (
        <span className="flex items-center gap-1.5">
          {active && <span className="h-1 w-1 shrink-0 rounded-full bg-blue-500" />}
          <span className={active ? "" : "ml-2.5"}>{label}</span>
        </span>
      )}
      {/* Badge — only when not collapsed */}
      {!collapsed && badge && (
        <span className="rounded border border-zinc-700 px-1.5 py-0.5 font-mono text-[9px] text-zinc-600">
          {badge}
        </span>
      )}
      {/* Mobile: always show label */}
      {collapsed && (
        <span className="lg:hidden flex items-center gap-1.5">
          {active && <span className="h-1 w-1 shrink-0 rounded-full bg-blue-500" />}
          <span className={active ? "" : "ml-2.5"}>{label}</span>
        </span>
      )}
    </Link>
  );
}
