import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV === "production"
      ? "https://shadowtalk.app"
      : "http://localhost:3000"
  ),

  title: "ShadowTalk - Anonymous Encrypted Chat",
  description:
    "End-to-end encrypted anonymous chat with automatic message deletion. No accounts, no tracking, no logs.",
  keywords: ["chat", "encrypted", "e2ee", "privacy", "anonymous"],

  openGraph: {
    title: "ShadowTalk - Anonymous Encrypted Chat",
    description:
      "End-to-end encrypted anonymous chat. Talk freely. Talk safely.",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ShadowTalk - Anonymous Encrypted Chat",
    description:
      "End-to-end encrypted anonymous chat with no accounts required.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-950 text-white`}>
        {children}
        <Toaster position="top-center" theme="dark" expand richColors />
      </body>
    </html>
  );
}
