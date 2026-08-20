import "./globals.css";
import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import { AuthSessionProvider } from "@/components/auth/AuthSessionProvider";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: "Content Pyramid",
    template: "%s | Content Pyramid",
  },
  description:
    "A white-label platform for collecting, approving, and distributing community social content.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} min-h-screen bg-[#f6f7f2] text-[#13241f] antialiased`}>
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
