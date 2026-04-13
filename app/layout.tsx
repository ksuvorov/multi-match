import { SpeedInsights } from '@vercel/speed-insights/next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import type { Metadata, Viewport } from 'next';

import {QueryProvider} from '@/app/providers/query';
import { cn } from "@/lib/utils";

import AnonymousSessionProvider from './components/anonymousSessionProvider';

import "./globals.css";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MultiMatch",
  description: "MultiMatch application",
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
  },
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(geistSans.variable, geistMono.variable, "font-sans", inter.variable)}>
      <body>
        <QueryProvider>
          <AnonymousSessionProvider />
          {children}
          <SpeedInsights />
          <Analytics />
        </QueryProvider>
      </body>
    </html>
  );
}
