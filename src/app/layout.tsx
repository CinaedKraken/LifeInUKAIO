import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SettingsProvider } from "@/context/SettingsContext";
import NavBar from "@/components/NavBar";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#111827",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://cinaedkraken.github.io/LifeInUKAIO"),
  title: "Life in UK AIO - Bilingual Mock Test & Study Guide",
  description: "Bilingual (EN/ZH) Mock Tests and Complete Study Guide for Life in the UK Citizenship Exam",
  manifest: "/LifeInUKAIO/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Life in UK AIO",
  },
  icons: {
    icon: "/LifeInUKAIO/favicon.ico",
    apple: "/LifeInUKAIO/icons/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SettingsProvider>
          <NavBar />
          <main className="flex-1 flex flex-col">{children}</main>
          <ServiceWorkerRegister />
        </SettingsProvider>
      </body>
    </html>
  );
}
