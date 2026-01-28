import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Email Renderer",
  description: "HTML or React Email renderer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-zinc-800">
        <Suspense>{children}</Suspense>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
