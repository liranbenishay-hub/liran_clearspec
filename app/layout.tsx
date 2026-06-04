import type { Metadata } from "next";
import "./globals.css";
import { SidebarProvider } from "@/contexts/sidebar-context";
import LayoutShell from "@/components/layout-shell";

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
        <SidebarProvider>
          <LayoutShell>{children}</LayoutShell>
        </SidebarProvider>
      </body>
    </html>
  );
}
