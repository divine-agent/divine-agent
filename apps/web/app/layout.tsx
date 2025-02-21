import type { ReactNode } from "react";
import type { Metadata } from "next";
import "@workspace/ui/globals.css";

export const metadata: Metadata = {
  title: "Divine Agent",
  description: "Agent Platform for Observability • Evaluation • Playground",
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
