import { z } from "zod";
import {
  createTRPCRouter,
  permissionedProcedure,
  permissionedProcedureWithAuth,
  type TRPCContext,
} from "@/server/api/trpc";
import type { Strand } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import dayjs from "dayjs";
import { MAX_STRAND_LENGTH_CHARS } from "@/utils/consts";

type ContributionStatus = "unauthenticated" | "own" | "contributed" | "allowed";

async function getContributionStatus(
  ctx: TRPCContext,
  parentStrand: Strand
): Promise<ContributionStatus> {
  if (!ctx.session) {
    return "unauthenticated";
  }

  if (parentStrand.author_id === ctx.session.user.id) {
    return "own";
  }

  const contribution = await ctx.prisma.strand.findFirst({
    where: {
      author_id: ctx.session.user.id,
      parent_id: parentStrand.id,
    },
  });

  console.log(contribution);

  if (contribution) {
    return "contributed";
  }

  return "allowed";
}

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
          SELECT id, parent_id, content, author_id, 1 AS depth
          FROM strand
          WHERE id = ${input.id}
          UNION ALL
          SELECT t.id, t.parent_id, t.content, t.author_id, a.depth + 1
          FROM strand t
          JOIN ancestors a ON t.id = a.parent_id
        )
        SELECT id, parent_id, content, author_id
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

      const contributionStatus = await getContributionStatus(ctx, strand);

      const isActiveStory = dayjs
        .tz(strand.story.active_date)
        .isSame(dayjs(), "day");

      return {
        ...strand,
        ancestors: ancestors as Pick<
          Strand,
          "id" | "content" | "parent_id" | "author_id"
        >[],
        contributionStatus,
        isActiveStory,
      };
    }),
  createChildStrand: permissionedProcedureWithAuth("strand:create:own")
    .input(
      z.object({
        content: z.string().min(1).max(MAX_STRAND_LENGTH_CHARS),
        parentId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const parentStrand = await ctx.prisma.strand.findUnique({
        where: {
          id: input.parentId,
        },
        include: {
          story: true,
        },
      });

      if (!parentStrand) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Parent strand not found",
        });
      }

      const isActive = dayjs
        .tz(parentStrand.story.active_date)
        .isSame(dayjs(), "day");

      if (!isActive) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Cannot contribute to an inactive story",
        });
      }

      // A user cannot extend their own strand, or contribute to a strand they've already contributed to
      const contributionStatus = await getContributionStatus(ctx, parentStrand);

      switch (contributionStatus) {
        case "unauthenticated":
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Must be logged in to contribute to a strand",
          });
        case "own":
          throw new TRPCError({
            code: "CONFLICT",
            message: "Cannot extend your own strand",
          });
        case "contributed":
          throw new TRPCError({
            code: "CONFLICT",
            message:
              "Cannot contribute to a strand you've already contributed to",
          });
        default:
          break;
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
  findAvailableStrand: permissionedProcedureWithAuth("strand:read:any")
    .input(z.object({ storyId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // find a strand that the user is able to contribute to
      const strandCount = await ctx.prisma.strand.count({
        where: {
          author_id: {
            not: ctx.session.user.id,
          },
          children: {
            none: {
              author_id: ctx.session.user.id,
            },
          },
          story_id: input.storyId,
        },
      });

      const strand = await ctx.prisma.strand.findFirst({
        where: {
          author_id: {
            not: ctx.session.user.id,
          },
          children: {
            none: {
              author_id: ctx.session.user.id,
            },
          },
          story_id: input.storyId,
        },
        skip: Math.floor(Math.random() * strandCount),
        select: {
          id: true,
        },
      });

      return strand;
    }),
});
