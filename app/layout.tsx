import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/sidebar";

export const metadata: Metadata = {
  title: "Liran Ben Ishay — Product Manager",
  description:
    "Product Manager with 6+ years in fintech, B2B SaaS, and platform products. Building Clearspec — the PM Operating System, built in public.",
  keywords: ["product management", "PM portfolio", "fintech", "Clearspec", "Liran Ben Ishay"],
  openGraph: {
    title: "Liran Ben Ishay — Product Manager",
    description: "Product Manager · Fintech · Platform Products · AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="font-sans antialiased h-full">
        <div className="flex min-h-full bg-zinc-950">
          {/* Fixed sidebar — lg: always visible, <lg: drawer */}
          <Sidebar />

          {/* Content area */}
          <div className="flex flex-1 flex-col overflow-x-hidden bg-white lg:ml-60">
            {/* Spacer for mobile top bar */}
            <div className="h-14 shrink-0 lg:hidden" />
            {/* Page content */}
            <div className="flex flex-1 flex-col">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
