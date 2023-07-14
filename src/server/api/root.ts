import { createTRPCRouter } from "@/server/api/trpc";
import { strandRouter } from "./routers/strand";
import { storyRouter } from "./routers/story";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  strand: strandRouter,
  story: storyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
