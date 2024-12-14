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

export const metadata: Metadata = {
  title: "Deal Closers",
  description: "DealClosers.ai | 10x Your Closing Power",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`dark ${GeistSans.variable}`}>
        <body>
          <TRPCReactProvider>
            <ClientInit />
            <main>{children}</main>
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}