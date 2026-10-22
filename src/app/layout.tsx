import type { Metadata } from "next";
import { Oswald, Source_Sans_3 } from "next/font/google";
import { Suspense } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const display = Oswald({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Fixed Reaction",
    template: "%s · Fixed Reaction",
  },
  description:
    "Official Fixed Reaction site — merch, free music streams, tour dates, and socials.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <Suspense
          fallback={
            <header className="border-b border-ink/10 bg-paper/70 px-4 py-3 md:px-6">
              <span className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-[0.04em] text-ink">
                Fixed Reaction
              </span>
            </header>
          }
        >
          <SiteHeader />
        </Suspense>
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
