import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import dayjs from "dayjs";

export const storyRouter = createTRPCRouter({
  getCurrentStory: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.strandStory.findFirst({
      where: {
        active_date: {
          equals: dayjs().startOf("day").toDate(),
        },
      },
      include: {
        root: {
          select: {
            id: true,
            content: true,
          },
        },
      },
    });
  }),

  getRandomStoryStrand: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const storyStrandCount = await ctx.prisma.strand.count({
        where: {
          story_id: input.id,
        },
      });

      const randomIndex = Math.floor(Math.random() * storyStrandCount);

      return ctx.prisma.strand.findFirst({
        where: {
          story_id: input.id,
        },
        select: {
          id: true,
        },
        skip: randomIndex,
        take: 1,
      });
    }),

  getStories: publicProcedure
    .input(
      z.object({
        from: z.date().optional(),
        to: z.date().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      return ctx.prisma.strandStory.findMany({
        where: {
          active_date: {
            gte: input.from,
            lte: input.to,
          },
        },
        orderBy: {
          active_date: "desc",
        },
        include: {
          root: true,
        },
      });
    }),
});
