import { createTRPCRouter } from "@/server/api/trpc";
import { twineRouter } from "./routers/twine";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  twine: twineRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
