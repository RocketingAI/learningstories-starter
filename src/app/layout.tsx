import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";
import ClientInit from "~/lib/client-init";
import { headers } from 'next/headers';
import { MDXProvider } from '@mdx-js/react'
import { cn } from "~/lib/utils";
import { ThemeProvider } from "~/components/theme-provider";

export const metadata: Metadata = {
  title: "Deal Closers",
  description: "DealClosers.ai | 10x Your Closing Power",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' }
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(GeistSans.variable)} suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
          <ClerkProvider>
            <TRPCReactProvider headers={headers()}>
              <ClientInit />
              <SignedIn>
                <main>{children}</main>
              </SignedIn>
              <SignedOut>
                <div className={cn("flex", "items-center", "justify-center", "min-h-screen")}>
                  <div className={cn("text-center")}>
                    <h1 className={cn("text-2xl", "font-bold", "mb-4")}>Please Sign In</h1>
                    <p>You need to be signed in to access this page.</p>
                  </div>
                </div>
              </SignedOut>
            </TRPCReactProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
