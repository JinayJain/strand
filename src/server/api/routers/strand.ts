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
        author: true,
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
          author: true,
          story: {
            select: {
              title: true,
            },
          },
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
          SELECT id, parent_id, content, 1 AS depth
          FROM strand
          WHERE id = ${input.id}
          UNION ALL
          SELECT t.id, t.parent_id, t.content, a.depth + 1
          FROM strand t
          JOIN ancestors a ON t.id = a.parent_id
        )
        SELECT id, parent_id, content
        FROM ancestors
        WHERE id != ${input.id}
        ORDER BY depth DESC
      `;

      return {
        ...strand,
        ancestors: ancestors as Pick<Strand, "id" | "content" | "parent_id">[],
      };
    }),
  createChildStrand: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1).max(256),
        parentId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const parentStrand = await ctx.prisma.strand.findUnique({
        where: {
          id: input.parentId,
        },
      });

      if (!parentStrand) {
        throw new Error("Parent strand not found");
      }

      const childStrand = await ctx.prisma.strand.create({
        data: {
          content: input.content,
          parent_id: input.parentId,
          author_id: ctx.session.user.id,
          story_id: parentStrand.story_id,
        },
      });

      return childStrand;
    }),
});
