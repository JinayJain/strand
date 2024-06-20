import clsx from "clsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { Metadata } from "next";
import PlausibleProvider from "next-plausible";
import { Nothing_You_Could_Do, Source_Serif_4 } from "next/font/google";
import Link from "next/link";

import "./globals.css";

dayjs.extend(utc);

const baseFont = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-base",
});
const handwritingFont = Nothing_You_Could_Do({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-handwriting",
});

export const metadata: Metadata = {
  title: "Strand",
  description: "A collaborative storytelling platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <PlausibleProvider
          domain="strand.jinay.dev"
          customDomain="https://stat.lab.jinay.dev"
          enabled={process.env.NODE_ENV === "production"}
          trackOutboundLinks
          taggedEvents
        />
      </head>
      <body
        className={clsx(
          baseFont.variable,
          handwritingFont.variable,
          "mx-auto mb-12 max-w-screen-md bg-white px-4 font-base text-base text-black"
        )}
      >
        <nav className="sticky flex items-center justify-between py-4 hover:text-mid">
          <Link href="/" className="font-handwriting text-2xl">
            Strand
          </Link>
        </nav>

        {children}
      </body>
    </html>
  );
}
