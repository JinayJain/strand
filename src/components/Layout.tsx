import React from "react";
import Head from "next/head";
import { Source_Serif_4 } from "next/font/google";
import Link from "next/link";
import Button from "./Button";
import { signOut, useSession } from "next-auth/react";

const baseFont = Source_Serif_4({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-base",
});

function Nav() {
  const { data: session, status } = useSession();
  return (
    <nav className="flex items-center justify-between border-b-2 border-gray-200 py-4">
      <Link href="/">
        <h1 className="inline-block text-2xl font-bold hover:text-gray-500">
          Strand
        </h1>
      </Link>

      <div>
        {status === "authenticated" ? (
          <div className="space-x-4">
            <p className="inline-block text-gray-500">{session?.user?.name}</p>
            <Button onClick={signOut}>Sign out</Button>
          </div>
        ) : (
          <Link href="/api/auth/signin">
            <Button>Sign in</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="flex justify-center space-x-2 border-t-2 border-gray-200 py-4">
      <p className="text-sm text-gray-500">
        Created by{" "}
        <a
          href="https://jinay.dev/"
          className="text-gray-500 underline hover:text-gray-700"
        >
          Jinay Jain
        </a>
      </p>

      <span className="text-sm text-gray-500">•</span>

      <a
        className="text-sm text-gray-500 underline hover:text-gray-700"
        href="https://forms.gle/6TrTAVSMXKsEJGsY8"
        target="_blank"
      >
        Share feedback
      </a>
    </footer>
  );
}

export default function Layout({
  children,
  pageTitle,
}: {
  children: React.ReactNode;
  pageTitle: string;
}) {
  return (
    <div
      className={`${baseFont.variable} mx-auto flex min-h-screen flex-col px-4 font-cardo max-md:container md:max-w-4xl`}
    >
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Nav />
      <main className="my-4 flex-1">{children}</main>
      <Footer />
    </div>
  );
}
