import dayjs from "dayjs";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";

import { PageParams, validateParams } from "@/lib/client/params";
import {
  getStrandAncestry,
  getStrandContinuations,
  getStrandWithStory,
} from "@/lib/query/strand";

import StrandContents from "./StrandContents";

export default async function StoryPage({ params }: { params: PageParams }) {
  const { id } = validateParams(
    params,
    z.object({
      id: z.coerce.number(),
    })
  );

  const [strandWithStory, ancestry, continuations] = await Promise.all([
    getStrandWithStory(id),
    getStrandAncestry(id),
    getStrandContinuations(id),
  ]);

  if (!strandWithStory?.story) {
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
        {continuations.length > 0 && (
          <p className="text-sm text-mid">
            Click one to explore its storyline!
          </p>
        )}
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
