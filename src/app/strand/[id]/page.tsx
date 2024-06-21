import dayjs from "dayjs";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";

import Button from "@/components/Button";
import { PageParams, validateParams } from "@/lib/client/params";
import {
  getStrandAncestry,
  getStrandContinuations,
  getStrandWithStory,
} from "@/lib/query/strand";

import StrandAncestry from "./StrandContents";
import StrandInput from "./StrandInput";

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

      <StrandAncestry ancestry={ancestry} className="pb-8" />

      <hr className="border-light" />

      <div>
        <div className="mb-4">
          <h3 className="font-bold">What happens next?</h3>
          <p className="text-sm text-mid">
            {continuations.length !== 0
              ? "Select an option to find out, or continue the story yourself!"
              : "Continue the story yourself!"}
          </p>
        </div>

        {continuations.length === 0 ? null : (
          <>
            <div className="space-y-4">
              {continuations.map((continuation) => (
                <Link href={`/strand/${continuation.id}`} key={continuation.id}>
                  <div className="group mb-4 flex items-center space-x-2">
                    <div className="h-4 w-4 rounded-full border-2 border-dark group-hover:bg-light" />
                    <p className="flex-1 hover:text-mid">
                      {continuation.content}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <p className="text-sm text-mid">Or...</p>
          </>
        )}

        <StrandInput
          parentId={id}
          storyId={strandWithStory.story.id}
          className="mt-1"
        />
      </div>

      <hr className="border-light" />
    </div>
  );
}
