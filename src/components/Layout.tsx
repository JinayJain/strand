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
    <nav className="flex items-center justify-between py-4">
      <Link href="/">
        <h1 className="inline-block text-4xl font-bold">Twine</h1>
      </Link>

      <div>
        {status === "authenticated" ? (
          <>
            <p className="mr-4 inline-block">{session?.user?.name}</p>
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
      <main>{children}</main>
    </div>
  );
}
