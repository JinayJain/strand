import { and, eq, not, sql } from "drizzle-orm";
import { cache } from "react";

import { db } from "@/lib/db";
import { story } from "@/lib/db/schema/story";
import { SelectStrand, strand } from "@/lib/db/schema/strand";

import { nullable } from "../types";

export const revalidate = 0;

const getStrandStatement = db
  .select()
  .from(strand)
  .where(eq(strand.id, sql.placeholder("id")))
  .leftJoin(story, eq(story.id, strand.story_id))
  .prepare("get_strand");

export const getStrandWithStory = cache(async (id: number) => {
  const [strand] = await getStrandStatement.execute({ id });
  return nullable(strand);
});

export const getStrandAncestry = cache(
  async (id: number): Promise<(SelectStrand & { depth: number })[]> => {
    return await db.execute(sql`
    WITH RECURSIVE ancestors AS (
      SELECT ${strand}.*, 0 AS depth
      FROM ${strand}
      WHERE ${strand.id} = ${id}

      UNION ALL

      SELECT t.*, a.depth + 1
      FROM ${strand} t
      JOIN ancestors a ON t.id = a.parent_id
    )
    SELECT * FROM ancestors
    ORDER BY depth DESC
  `);
  }
);

const getStrandContinuationsStatement = db
  .select()
  .from(strand)
  .where(eq(strand.parent_id, sql.placeholder("id")))
  .prepare("get_strand_continuations");

export const getStrandContinuations = cache(async (id: number) => {
  return await getStrandContinuationsStatement.execute({ id });
});

// jump to a random strand in the story
export const jumpToRandomStrand = cache(
  async (storyId: string, strandId: number) => {
    const [randomStrand] = await db
      .select()
      .from(strand)
      .where(and(eq(strand.story_id, storyId), not(eq(strand.id, strandId))))
      .orderBy(sql`random()`)
      .limit(1)
      .execute();

    return nullable(randomStrand);
  }
);
