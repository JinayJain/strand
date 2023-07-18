import Head from "next/head";

export default function Metadata() {
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
