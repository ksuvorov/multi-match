import { Bricolage_Grotesque, Space_Mono } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import type { Metadata, Viewport } from 'next';

import { QueryProvider } from '@/app/providers/query';
import { cn } from "@/lib/utils";

import AnonymousSessionProvider from './components/anonymousSessionProvider';

import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-sans',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
})

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
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(bricolage.variable, spaceMono.variable)}>
      <body>
        <QueryProvider>
          <AnonymousSessionProvider />
          <div className="flex flex-col flex-1">
            {children}
          </div>
          <SpeedInsights />
          <Analytics />
        </QueryProvider>
      </body>
    </html>
  );
}
