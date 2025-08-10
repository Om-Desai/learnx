import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LearnX",
  description: "Interactive learning with text, video, and quizzes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <header className="border-b">
            <div className="max-w-5xl mx-auto flex items-center gap-4 p-4">
              <Link href="/" className="font-semibold">LearnX</Link>
              <nav className="ml-auto flex gap-4 text-sm">
                <Link href="/register">Register</Link>
                <Link href="/login">Login</Link>
                <Link href="/dashboard">Dashboard</Link>
              </nav>
            </div>
          </header>
          <main className="max-w-5xl mx-auto p-4">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
