import { createTRPCRouter } from "@/server/api/trpc";
import { strandRouter } from "./routers/strand";
import { storyRouter } from "./routers/story";
import { userRouter } from "./routers/user";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(utc);
dayjs.extend(relativeTime);

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
