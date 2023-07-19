import { z } from "zod";
import {
  createTRPCRouter,
  permissionedProcedure,
  permissionedProcedureWithAuth,
} from "@/server/api/trpc";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

export const storyRouter = createTRPCRouter({
  getCurrentStory: permissionedProcedure("strandStory:read:any").query(
    async ({ ctx }) => {
      const [current, next] = await ctx.prisma.$transaction([
        ctx.prisma.strandStory.findFirst({
          where: {
            active_date: {
              equals: dayjs.utc().startOf("day").toDate(),
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
        }),
        ctx.prisma.strandStory.findFirst({
          where: {
            active_date: {
              gt: dayjs.utc().startOf("day").toDate(),
            },
          },
          orderBy: {
            active_date: "asc",
          },
          select: {
            active_date: true,
          },
        }),
      ]);

      return {
        current,
        nextDate: next?.active_date,
      };
    }
  ),

  getRandomStoryStrand: permissionedProcedure(
    "strand:read:any",
    "strandStory:read:any"
  )
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

  getStories: permissionedProcedure("strandStory:read:any")
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

  createStory: permissionedProcedureWithAuth("strandStory:create:own")
    .input(
      z.object({
        title: z.string().nonempty().max(256),
        prompt: z.string().nonempty(),
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
});
