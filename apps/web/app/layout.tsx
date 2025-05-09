import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@workspace/ui/globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Toaster } from '@workspace/ui/components/sonner';

if (process.env.NODE_ENV !== 'production') {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

export const metadata: Metadata = {
  title: 'Divine Agent',
  description: 'Agent Platform for Observability • Evaluation • Playground',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
