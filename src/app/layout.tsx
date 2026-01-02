import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import * as React from "react";
import { Toaster } from "sonner";
import { DemoProvider } from "@/lib/demo/store";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { Loader } from "@/components/ui/loader";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CIE | Complaint Intelligence",
  description: "Advanced Complaint Intelligence Engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground font-sans`}
      >
        <DemoProvider>
          <React.Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-background"><Loader /></div>}>
            <AuthGuard>
              {children}
              <Toaster position="top-right" />
            </AuthGuard>
          </React.Suspense>
        </DemoProvider>
      </body>
    </html>
  );
}
