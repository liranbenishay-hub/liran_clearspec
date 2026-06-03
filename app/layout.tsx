import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clearspec — The PM Operating System, Built in Public",
  description:
    "Most PM tools help you write documents. Clearspec forces you to think first. A structured framework for product decisions, tradeoffs, and decision records — extracted from real PM work.",
  keywords: ["product management", "PM framework", "decision record", "product strategy", "PM operating system"],
  openGraph: {
    title: "Clearspec — The PM Operating System, Built in Public",
    description:
      "Most PM tools help you write documents. Clearspec forces you to think first.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
