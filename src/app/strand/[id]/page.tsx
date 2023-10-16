import dayjs from "dayjs";
import { eq, sql } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";

import { PageParams, validateParams } from "@/lib/client/params";
import { db } from "@/lib/db";
import { story } from "@/lib/db/schema/story";
import { SelectStrand, strand } from "@/lib/db/schema/strand";

import StrandContents from "./StrandContents";

const getStrandStatement = db
  .select()
  .from(strand)
  .where(eq(strand.id, sql.placeholder("id")))
  .leftJoin(story, eq(story.id, strand.story_id))
  .prepare("get_strand");

async function getStrandWithStory(id: number) {
  const [strand] = await getStrandStatement.execute({ id });
  return strand;
}

async function getStrandAncestry(
  id: number
): Promise<(SelectStrand & { depth: number })[]> {
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

const getStrandContinuationsStatement = db
  .select()
  .from(strand)
  .where(eq(strand.parent_id, sql.placeholder("id")))
  .prepare("get_strand_continuations");

async function getStrandContinuations(id: number) {
  return await getStrandContinuationsStatement.execute({ id });
}

export default async function StoryPage({ params }: { params: PageParams }) {
  const { id } = validateParams(
    params,
    z.object({
      id: z.coerce.number(),
    })
  );

  const strandWithStory = await getStrandWithStory(id);
  const ancestry = await getStrandAncestry(id);
  const continuations = await getStrandContinuations(id);

  if (ancestry.length === 0 || !strandWithStory.story) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{strandWithStory.story.title}</h1>
        <h3 className="text-mid">
          {dayjs(strandWithStory.story.active_date).format("MMMM D, YYYY")}
        </h3>
      </div>

      <StrandContents
        ancestry={ancestry}
        parentId={id}
        storyId={strandWithStory.story.id}
      />

      <div className="space-y-2">
        <h2 className="text-xl font-bold">Continuations</h2>
        {continuations.map((continuation) => (
          <p key={continuation.id} className="hover:text-mid">
            <Link href={`/strand/${continuation.id}`}>
              {continuation.content}
            </Link>
          </p>
        ))}

        {continuations.length === 0 && (
          <p>No continuations yet. Add your own!</p>
        )}
      </div>
    </div>
  );
}
