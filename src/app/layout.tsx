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

export const metadata: Metadata = {
  title: "Galactic Warp",
  description: "A Farcaster Mini-App Space Shooter on Base",
  openGraph: {
    title: "Galactic Warp",
    description: "Play the ultimate space shooter on Base. Mint tickets, blast enemies, and top the leaderboard.",
    images: ["/opengraph-image.png"], // Instructions: Add this image to public/
  },
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": "https://galactic-warp.vercel.app/opengraph-image.png", // To be updated
    // Button 1: Launch App (Frame v2 style)
    "fc:frame:button:1": "Play Galactic Warp",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": "https://galactic-warp.vercel.app", // To be updated
    "fc:frame:post_url": "https://galactic-warp.vercel.app/api/frame", // Placeholder
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
