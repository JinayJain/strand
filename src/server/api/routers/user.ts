import { z } from "zod";
import {
  createTRPCRouter,
  permissionedProcedureWithAuth,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { hasOnboarded } from "@/utils/user";

export const userRouter = createTRPCRouter({
  setUserName: permissionedProcedureWithAuth("user:update:own")
    .input(
      z.object({
        username: z
          .string()
          .nonempty()
          .max(256)
          .regex(/^[a-zA-Z0-9_]+$/, {
            message:
              "Username should only contain letters, numbers, and underscores.",
          }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (hasOnboarded(ctx.session.user)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "User has already onboarded.",
        });
      }

      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          username: input.username,
        },
      });
    }),
});
