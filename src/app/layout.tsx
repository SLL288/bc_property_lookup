import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BC Property Intelligence Lookup",
  description: "Lookup BC property zoning links, ALR status, and quick facts for Metro Vancouver addresses.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <div className="flex min-h-screen flex-col">
          <header className="border-b border-gray-200 bg-white/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
              <a href="/" className="text-lg font-semibold text-brand">BC Property Intelligence Lookup</a>
              <nav className="flex items-center gap-4 text-sm text-gray-700">
                <a href="/">Home</a>
                <a href="/about">About</a>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-gray-200 bg-white px-4 py-6 text-sm text-gray-700">
            <div className="mx-auto flex max-w-6xl flex-col gap-2">
              <p>Informational only. Verify zoning, bylaws, and legal constraints on official municipal sources.</p>
              <p>We do not guarantee accuracy.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
