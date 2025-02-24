import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@workspace/ui/globals.css';
import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev';

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
