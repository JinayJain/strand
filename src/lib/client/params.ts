import { notFound } from "next/navigation";
import { ZodType, z } from "zod";

export type PageParams = Record<string, unknown>;

export function validateParams<T extends ZodType>(
  params: PageParams,
  schema: T
): z.infer<T> {
  const parsed = schema.safeParse(params);

  if (!parsed.success) {
    notFound();
  }

  return parsed.data;
}
