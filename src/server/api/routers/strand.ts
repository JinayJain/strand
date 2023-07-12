import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import type { Strand } from "@prisma/client";

export const strandRouter = createTRPCRouter({
  getRootStrands: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.strand.findMany({
      where: {
        parent: null,
      },
      include: {
        user: true,
      },
    });
  }),
  getStrandWithTree: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const strand = await ctx.prisma.strand.findUnique({
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

      if (!strand) {
        throw new Error("Strand not found");
      }

      const ancestors = await ctx.prisma.$queryRaw`
        WITH RECURSIVE ancestors AS (
          SELECT id, parentId, content, 1 AS depth
          FROM strand
          WHERE id = ${input.id}
          UNION ALL
          SELECT t.id, t.parentId, t.content, a.depth + 1
          FROM strand t
          JOIN ancestors a ON t.id = a.parentId
        )
        SELECT id, parentId, content
        FROM ancestors
        WHERE id != ${input.id}
        ORDER BY depth DESC
      `;

      return {
        ...strand,
        ancestors: ancestors as Pick<Strand, "id" | "content" | "parentId">[],
      };
    }),
  createStrand: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1).max(256),
        parentId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.strand.create({
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
