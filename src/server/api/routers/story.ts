import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

export const storyRouter = createTRPCRouter({
  createStory: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        prompt: z.string(),
        activeDate: z.date().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const storyId = uuidv4();

      return ctx.prisma.strandStory.create({
        data: {
          id: storyId,
          title: input.title,
          active_date: input.activeDate,
          root: {
            create: {
              story_id: storyId,
              content: input.prompt,
              author_id: ctx.session.user.id,
            },
          },
        },
        include: {
          root: true,
        },
      });
    }),

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
