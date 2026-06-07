"use client";

import { useSidebar } from "@/contexts/sidebar-context";
import Sidebar from "@/components/sidebar";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();

  return (
    // min-h-full: body scroll works; content can be longer than viewport
    <div className="flex min-h-full bg-zinc-950">
      <Sidebar />
      {/* Content area — pushed right by the fixed sidebar via margin */}
      <div
        className={`
          flex flex-1 flex-col bg-white
          transition-[margin] duration-200 ease-in-out
          ${collapsed ? "lg:ml-14" : "lg:ml-60"}
        `}
      >
        {/* Mobile top-bar spacer — sidebar is fixed, so content needs to start below it */}
        <div className="h-14 shrink-0 lg:hidden" />
        {children}
      </div>
    </div>
  );
}
