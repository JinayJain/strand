import { eq, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { story } from "@/lib/db/schema/story";
import { strand } from "@/lib/db/schema/strand";

import { nullable } from "../types";

export async function getActiveStory() {
  const [activeStory] = await db
    .select()
    .from(story)
    .where(eq(story.active_date, sql`CURRENT_DATE`))
    .leftJoin(strand, eq(story.root_id, strand.id));

  return nullable(activeStory);
}
