"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import Sidebar from "@/components/Sidebar";

const pageNames: Record<string, string> = {
  '/': 'Dashboard',
  '/analytics': 'Analytics',
  '/reflections': 'Reflections',
  '/settings': 'Settings',
  '/popup': 'Mentra',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isPopup = pathname?.startsWith("/popup");
  const pageName = pageNames[pathname || '/'] || 'Mentra';

  useEffect(() => {
    document.title = `${pageName} - Mentra | Mindful Focus`;
  }, [pathname, pageName]);

  return (
    <html lang="en">
      <head>
        <meta name="description" content="Mentra - AI-powered mindful productivity extension to help you build healthier digital habits" />
        <meta name="theme-color" content="#0ea5e9" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {isPopup ? (
          children
        ) : (
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="ml-64 flex-1 p-8">
              {children}
            </main>
          </div>
        )}
      </body>
    </html>
  );
}
