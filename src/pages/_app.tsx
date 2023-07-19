import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "@/utils/api";
import "@/styles/globals.css";
import PlausibleProvider from "next-plausible";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import Metadata from "@/components/Metadata";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  dayjs.extend(utc);
  dayjs.extend(relativeTime);

  return (
    <PlausibleProvider
      domain="strand.jinay.dev"
      customDomain="https://stat.lab.jinay.dev"
      enabled={process.env.NODE_ENV === "production"}
      trackOutboundLinks
      taggedEvents
    >
      <Metadata />
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </PlausibleProvider>
  );
};

export default api.withTRPC(MyApp);
