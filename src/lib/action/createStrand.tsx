"use server";

import { TurnstileServerValidationResponse } from "@marsidev/react-turnstile";
import { sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";

import { CLOUDFLARE_TURNSTILE_URL, MAX_STRAND_LENGTH } from "../constants";
import { db } from "../db";
import { strand } from "../db/schema/strand";
import env from "../env";

const createStrandStatement = db
  .insert(strand)
  .values({
    content: sql.placeholder("content"),
    parent_id: sql.placeholder("parent_id"),
    story_id: sql.placeholder("story_id"),
  })
  .returning()
  .prepare("add_strand");

export default async function createStrand(
  parentId: number,
  storyId: string,
  formData: FormData
) {
  async function validateTurnstile(turnstileToken: string) {
    let cloudFlareFormData = new FormData();
    cloudFlareFormData.append("secret", env.CLOUDFLARE_SECRET_KEY);
    cloudFlareFormData.append("response", turnstileToken);
    const idempotencyKey = crypto.randomUUID();
    cloudFlareFormData.append("idempotency_key", idempotencyKey);

    const turnstileRes = await fetch(CLOUDFLARE_TURNSTILE_URL, {
      method: "POST",
      body: cloudFlareFormData,
    });

    const turnstileData =
      (await turnstileRes.json()) as TurnstileServerValidationResponse;
    return turnstileData;
  }

  const validator = z.object({
    content: z.string().min(1).max(MAX_STRAND_LENGTH),
    "cf-turnstile-response": z.string().min(1),
  });

  const data = validator.parse(
    Object.fromEntries(formData.entries()) as Record<string, unknown>
  );

  const turnstileResult = await validateTurnstile(
    data["cf-turnstile-response"]
  );

  if (!turnstileResult.success) {
    console.warn("Turnstile failed", turnstileResult);
    return;
  }

  const newStrand = await createStrandStatement.execute({
    content: data.content,
    parent_id: parentId,
    story_id: storyId,
  });

  redirect(`/strand/${newStrand[0].id}`);
}
