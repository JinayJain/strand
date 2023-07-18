import React, { useEffect } from "react";
import Head from "next/head";
import { Source_Serif_4 } from "next/font/google";
import Link from "next/link";
import Button from "./Button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import clsx from "clsx";
import { type Role } from "@prisma/client";
import Page404 from "@/pages/404";
import { hasOnboarded } from "@/utils/user";

const baseFont = Source_Serif_4({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-base",
});

function Nav({ session }: { session: ReturnType<typeof useSession>["data"] }) {
  return (
    <nav className="flex items-center justify-between border-b-2 border-gray-200 py-4">
      <Link href="/">
        <h1 className="inline-block text-2xl font-bold hover:text-gray-500">
          Strand
        </h1>
      </Link>

      <div>
        {session ? (
          <div className="space-x-4">
            <p className="inline-block text-gray-500">
              {session.user.username}
            </p>
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

      <Link
        className="text-sm text-gray-500 hover:text-yellow-500"
        href="/cool-people-only"
      >
        •
      </Link>

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
  redirectToOnboarding = true,
  mainClass,
  allowedRoles,
}: {
  children: React.ReactNode;
  pageTitle?: string;
  redirectToOnboarding?: boolean;
  mainClass?: string;
  allowedRoles?: Role[];
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const title = pageTitle ? `${pageTitle} / Strand` : "Strand";

  useEffect(() => {
    const fn = async () => {
      const ONBOARDING_PAGE = "/onboarding";

      if (
        status === "authenticated" &&
        !hasOnboarded(session.user) &&
        redirectToOnboarding
      ) {
        await router.push({
          pathname: ONBOARDING_PAGE,
          query: { redirect: router.asPath },
        });
      }
    };

    void fn();
  }, [redirectToOnboarding, router, session?.user, status]);

  if (status === "loading") {
    return <div />;
  }

  if (allowedRoles && !allowedRoles.includes(session?.user.role ?? "GUEST")) {
    return <Page404 />; // TODO: Redirect to 404 page instead
  }

  return (
    <div
      className={`${baseFont.variable} mx-auto flex min-h-screen flex-col px-4 font-cardo max-md:container md:max-w-4xl`}
    >
      <Head>
        <title>{title}</title>
      </Head>
      <Nav session={session} />
      <main className={clsx("my-4 flex-1", mainClass)}>{children}</main>
      <Footer />
    </div>
  );
}
