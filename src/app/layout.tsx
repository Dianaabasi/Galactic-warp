import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { OnchainProviders } from "@/components/OnchainProviders";
import "@coinbase/onchainkit/styles.css";
import FarcasterProvider from "@/components/FarcasterProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const appUrl = process.env.NEXT_PUBLIC_URL || "https://galactic-warp.vercel.app";

export const metadata: Metadata = {
  title: "Galactic Warp",
  description: "A Farcaster Mini-App Space Shooter on Base",
  openGraph: {
    title: "Galactic Warp",
    description: "Play the ultimate space shooter on Base. Mint tickets, blast enemies, and top the leaderboard.",
    images: [`${appUrl}/opengraph-image.png`],
  },
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: `${appUrl}/opengraph-image.png`,
      button: {
        title: "Play Galactic Warp",
        action: {
          type: "launch_frame",
          name: "Galactic Warp",
          url: appUrl,
          splashImageUrl: `${appUrl}/logo.png`,
          splashBackgroundColor: "#050510",
        },
      },
    }),
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FarcasterProvider>
          <OnchainProviders>
            {children}
          </OnchainProviders>
        </FarcasterProvider>
      </body>
    </html>
  );
}
