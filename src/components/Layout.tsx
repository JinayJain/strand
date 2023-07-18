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

function Metadata() {
  const PAGE_TITLE = "Strand - Daily stories written by strangers";
  const PAGE_DESCRIPTION =
    "Strand is a crowdsourced storytelling app that lets strangers write stories together, one sentence at a time.";
  const PAGE_IMAGE = "https://strand.jinay.dev/api/og";
  const PAGE_TWITTER_HANDLE = "@TheStrandApp";

  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="charset" content="utf-8" />
      <meta property="og:title" content={PAGE_TITLE} />
      <meta property="og:description" content={PAGE_DESCRIPTION} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={PAGE_IMAGE} />

      <meta name="twitter:title" content={PAGE_TITLE} />
      <meta name="twitter:description" content={PAGE_DESCRIPTION} />
      <meta name="twitter:image" content={PAGE_IMAGE} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={PAGE_TWITTER_HANDLE} />

      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#da532c" />
      <meta name="theme-color" content="#ffffff" />
    </Head>
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
      <Metadata />
      <Nav session={session} />
      <main className={clsx("my-4 flex-1", mainClass)}>{children}</main>
      <Footer />
    </div>
  );
}
