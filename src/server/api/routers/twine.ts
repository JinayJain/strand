import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { Twine } from "@prisma/client";

export const twineRouter = createTRPCRouter({
  getRootTwines: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.twine.findMany({
      where: {
        parent: null,
      },
      include: {
        user: true,
      },
    });
  }),
  getTwineWithTree: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const twine = await ctx.prisma.twine.findUnique({
        where: {
          id: input.id,
        },
        include: {
          user: true,
          children: {
            select: {
              id: true,
              content: true,
            },
          },
        },
      });

      if (!twine) {
        throw new Error("Twine not found");
      }

      const ancestors = await ctx.prisma.$queryRaw`
        WITH RECURSIVE ancestors AS (
          SELECT id, parentId, content, 1 AS depth
          FROM twine
          WHERE id = ${input.id}
          UNION ALL
          SELECT t.id, t.parentId, t.content, a.depth + 1
          FROM twine t
          JOIN ancestors a ON t.id = a.parentId
        )
        SELECT id, parentId, content
        FROM ancestors
        WHERE id != ${input.id}
        ORDER BY depth DESC
      `;

      return {
        ...twine,
        ancestors: ancestors as Pick<Twine, "id" | "content" | "parentId">[],
      };
    }),
  createTwine: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1).max(256),
        parentId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.twine.create({
        data: {
          content: input.content,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          parent: input.parentId
            ? {
                connect: {
                  id: input.parentId,
                },
              }
            : undefined,
        },
      });
    }),
});
