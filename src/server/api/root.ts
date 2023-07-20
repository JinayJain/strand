import { createTRPCRouter } from "@/server/api/trpc";
import { strandRouter } from "./routers/strand";
import { storyRouter } from "./routers/story";
import { userRouter } from "./routers/user";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { RESET_TIMEZONE } from "@/utils/consts";

dayjs.extend(relativeTime);
dayjs.extend(timezone);
dayjs.extend(utc);

dayjs.tz.setDefault(RESET_TIMEZONE);

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  strand: strandRouter,
  story: storyRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
