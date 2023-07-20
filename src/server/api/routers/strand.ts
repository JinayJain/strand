import { z } from "zod";
import {
  createTRPCRouter,
  permissionedProcedure,
  permissionedProcedureWithAuth,
} from "@/server/api/trpc";
import type { Strand } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import dayjs from "dayjs";

export const strandRouter = createTRPCRouter({
  getStrand: permissionedProcedure("strand:read:any")
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const [strand, ancestors] = await ctx.prisma.$transaction([
        ctx.prisma.strand.findUnique({
          where: {
            id: input.id,
          },
          include: {
            author: true,
            story: true,
            children: {
              select: {
                id: true,
                content: true,
              },
            },
          },
        }),
        ctx.prisma.$queryRaw`
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
      `,
      ]);

      if (!strand) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Strand not found",
        });
      }

      const hasContributed = ctx.session
        ? (await ctx.prisma.strand.findFirst({
            where: {
              author_id: ctx.session.user.id,
              story_id: strand.story_id,
            },
          })) !== null
        : false;

      const isActiveStory = dayjs(strand.story.active_date).isSame(
        dayjs(),
        "day"
      );

      return {
        ...strand,
        ancestors: ancestors as Pick<Strand, "id" | "content" | "parent_id">[],
        hasContributed,
        isActiveStory,
      };
    }),
  createChildStrand: permissionedProcedureWithAuth("strand:create:own")
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
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Parent strand not found",
        });
      }

      const contribution = await ctx.prisma.strand.findFirst({
        where: {
          author_id: ctx.session.user.id,
          story_id: parentStrand.story_id,
        },
      });

      if (contribution) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User has already contributed to this story",
        });
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
  reportStrand: permissionedProcedureWithAuth("strand:read:any")
    .input(
      z.object({
        id: z.string(),
        reason: z.string().min(1).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.strandReport.create({
        data: {
          user_id: ctx.session.user.id,
          reason: input.reason,
          strand_id: input.id,
        },
      });
    }),
});
