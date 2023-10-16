import { faker } from "@faker-js/faker";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { story } from "@/lib/db/schema/story";
import { strand } from "@/lib/db/schema/strand";

const NUM_STORIES = 10;
const NUM_CHILD_STRANDS = 100;

async function main() {
  const newStrands: number[] = [];

  for (let i = 0; i < NUM_STORIES; i++) {
    await db.transaction(async (tx) => {
      const title = faker.commerce.productName();
      const storyId = faker.helpers.slugify(title).toLowerCase();

      await tx.insert(story).values({
        id: storyId,
        title,
      });

      const newStrand = await tx
        .insert(strand)
        .values({
          story_id: storyId,
          content: faker.lorem.sentence(),
        })
        .returning({ id: strand.id });

      await tx
        .update(story)
        .set({
          root_id: newStrand[0].id,
        })
        .where(eq(story.id, storyId));

      newStrands.push(newStrand[0].id);
    });
  }

  for (let i = 0; i < NUM_CHILD_STRANDS; i++) {
    const parentStrandId =
      newStrands[Math.floor(Math.random() * newStrands.length)];

    const parentStrand = await db
      .select()
      .from(strand)
      .where(eq(strand.id, parentStrandId));

    const newStrand = await db
      .insert(strand)
      .values({
        story_id: parentStrand[0].story_id,
        parent_id: parentStrandId,
        content: faker.lorem.sentence(),
      })
      .returning({ id: strand.id });

    newStrands.push(newStrand[0].id);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
