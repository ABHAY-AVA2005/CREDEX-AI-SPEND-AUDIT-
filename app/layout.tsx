import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

/**
 * RootLayout.tsx
 * The global shell for the Credex platform.
 * 
 * We enforce a Light theme here to maintain that clean, 
 * paper-like "Audit Memo" aesthetic across the entire app.
 */

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Credex AI Spend Audit | Optimize your SaaS stack",
  description: "Audit your startup's AI tool spending, detect overspending, and discover how to save by buying and selling credits on Credex.rocks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light" // Hard-coded light theme for that premium fintech feel
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
