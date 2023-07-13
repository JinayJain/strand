import React from "react";
import Head from "next/head";
import { Cardo } from "next/font/google";
import Link from "next/link";
import Button from "./Button";
import { signOut, useSession } from "next-auth/react";

const cardo = Cardo({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-cardo",
});

function Nav() {
  const { data: session, status } = useSession();
  return (
    <nav className="flex items-center justify-between border-b-2 border-gray-200 py-4">
      <Link href="/">
        <h1 className="inline-block text-2xl font-bold">Strand</h1>
      </Link>

      <div>
        {status === "authenticated" ? (
          <>
            <p className="mr-4 inline-block text-gray-500">
              {session?.user?.name}
            </p>
            <Button onClick={signOut}>Sign out</Button>
          </>
        ) : (
          <Link href="/api/auth/signin">
            <Button>Sign in</Button>
          </Link>
        )}
      </div>
    </nav>
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
      className={`${cardo.variable} mx-auto px-4 font-cardo max-md:container md:max-w-4xl`}
    >
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Nav />
      <main className="mt-4">{children}</main>
    </div>
  );
}
