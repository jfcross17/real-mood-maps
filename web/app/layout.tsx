import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "The National Pulse — A weekly reading of the American mood",
  description:
    "A weekly editorial reading of the American mood, built for political consultants, campaign strategists, and policy teams.",
  openGraph: {
    title: "The National Pulse",
    description: "A weekly reading of the American mood.",
    siteName: "The National Pulse",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-bg text-text antialiased">
        <div className="paper-grain" aria-hidden />
        {children}
      </body>
    </html>
  );
}
