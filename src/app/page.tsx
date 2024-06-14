import { and } from "drizzle-orm";
import Link from "next/link";

import Button from "@/components/Button";

import { getActiveStory } from "../lib/query/story";

export const revalidate = 60;

export default async function Home() {
  const activeStory = await getActiveStory();

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Write stories with the world.</h1>
        <p>
          Every day is a new story. Choose any storyline to continue, and answer
          the question “what happens next?” Then, see how others continue your
          story, creating branching storylines from a single prompt.
        </p>
      </div>
      <div className="space-y-4">
        {activeStory ? (
          <div>
            <h3 className="bg-black p-2 text-lg font-bold text-white">
              Today&apos;s Story
            </h3>
            <div className="border border-black p-2">
              <h3 className="text-lg italic">{activeStory.story.title}</h3>
              {activeStory.strand && (
                <>
                  <p className="mb-4">{activeStory.strand.content}</p>
                  <div>
                    <Link href={`/strand/${activeStory.strand.id}`} passHref>
                      <Button>Read</Button>
                    </Link>
                    <span className="ml-2 text-sm text-mid">
                      Contribute to today&apos;s story, no sign up required!
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <p className="italic text-mid">
            No story has been published today, check back later!
          </p>
        )}

        <p className="mt-4 text-sm italic text-mid">
          psst. I&apos;m a software engineer who recently quit my job to work on
          passion projects like this one.{" "}
          <a href="https://90days.jinay.dev/">Follow along</a> if you&apos;re
          interested!
        </p>
      </div>
    </div>
  );
}
