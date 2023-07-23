import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "@/utils/api";
import "@/styles/globals.css";
import PlausibleProvider from "next-plausible";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Metadata from "@/components/Metadata";
import { Toaster } from "react-hot-toast";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  dayjs.extend(relativeTime);
  dayjs.extend(utc);
  dayjs.extend(timezone);

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
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 50000,
          style: {
            fontFamily: "var(--font-base)",
            background: "#fff",
            border: "1px solid #000",
            color: "#000",
            borderRadius: 0,
          },
          iconTheme: {
            primary: "#000",
            secondary: "#fff",
          },
        }}
      />
    </PlausibleProvider>
  );
};

export default api.withTRPC(MyApp);
