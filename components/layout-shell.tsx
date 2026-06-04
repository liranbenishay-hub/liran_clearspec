"use client";

import { useSidebar } from "@/contexts/sidebar-context";
import Sidebar from "@/components/sidebar";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();

  return (
    <div className="flex min-h-full bg-zinc-950">
      <Sidebar />
      {/* Content area — margin matches sidebar width, transitions smoothly */}
      <div
        className={`
          flex flex-1 flex-col overflow-x-hidden bg-white
          transition-[margin] duration-200 ease-in-out
          ${collapsed ? "lg:ml-14" : "lg:ml-60"}
        `}
      >
        {/* Mobile top-bar spacer */}
        <div className="h-14 shrink-0 lg:hidden" />
        <div className="flex flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}
