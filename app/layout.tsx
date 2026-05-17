import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/Footer";
import { ScrollFix } from "@/components/ScrollFix";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const stylishFont = Inter({
  variable: "--font-stylish",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fluxora AI Spend Audit | Optimize your SaaS stack",
  description: "Audit your startup's AI tool spending, detect overspending, right-size enterprise seats, and optimize your bottom line.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${stylishFont.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ScrollFix />
          <div className="min-h-screen bg-transparent text-foreground selection:bg-primary/20 relative">
            <main className="flex-grow relative">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
