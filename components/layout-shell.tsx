"use client";

import { useSidebar } from "@/contexts/sidebar-context";
import Sidebar from "@/components/sidebar";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();

  return (
    <div className="flex h-full bg-zinc-950">
      <Sidebar />
      {/* Content area */}
      <div
        className={`
          flex flex-1 flex-col bg-white
          transition-[margin] duration-200 ease-in-out
          ${collapsed ? "lg:ml-14" : "lg:ml-60"}
        `}
        style={{ minHeight: 0 }}
      >
        {/* Mobile top-bar spacer */}
        <div className="h-14 shrink-0 lg:hidden" />
        {/* min-h-0 allows flex children to shrink below content height,
            enabling application-level layouts with internal scroll */}
        <div className="flex flex-1 flex-col min-h-0">{children}</div>
      </div>
    </div>
  );
}
