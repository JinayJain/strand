import Button from "@/components/Button";
import Layout from "@/components/Layout";
import { api } from "@/utils/api";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Home() {
  const { data: storyQuery } = api.story.getCurrentStory.useQuery();
  const randomStoryMutation = api.story.getRandomStoryStrand.useMutation();
  const router = useRouter();

  const handleRandomStory = (storyId: string) => {
    return async () => {
      const randomStrand = await randomStoryMutation.mutateAsync({
        id: storyId,
      });

      if (randomStrand) {
        await router.push(`/s/${randomStrand.id}`);
      }
    };
  };

  return (
    <Layout redirectToOnboarding={false}>
      <div className="mt-8 space-y-2">
        <h1 className="text-2xl font-bold">Write stories with the world.</h1>
        <p>
          Every day is a new story. Choose any storyline to continue, and answer
          the question “what happens next?” Then, see how others continue your
          story, creating branching storylines from a single prompt.
        </p>
      </div>

      {storyQuery?.current && (
        <div className="mt-4 space-y-2">
          <h3 className="text-xl font-bold">Today&apos;s Prompt</h3>

          <div className="bg-gray-100 p-4">
            <h4 className="text-lg italic">{storyQuery.current.title}</h4>
            <p className="text-gray-500">{storyQuery.current.root.content}</p>
            <div className="mt-4 flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
              <Link href={`/s/${storyQuery.current.root.id}`}>
                <Button className="plausible-event-name=click-continue-story w-full sm:w-auto">
                  Explore
                </Button>
              </Link>
              <Button
                className="plausible-event-name=click-random-storyline w-full sm:w-auto"
                onClick={handleRandomStory(storyQuery.current.id)}
              >
                Continue a story
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="mt-2 flex space-x-2">
        <a
          className="text-sm text-gray-500 underline hover:text-gray-700"
          href="https://forms.gle/KAibEGc2r4MWYaVq9"
          target="_blank"
        >
          Suggest a prompt
        </a>
        <span className="text-sm text-gray-500">•</span>
        <Link
          className="text-sm text-gray-500 underline hover:text-gray-700"
          href="/archive"
        >
          View the archive
        </Link>
        {storyQuery?.nextDate && (
          <>
            <span className="text-sm text-gray-500">•</span>
            <p className="text-sm text-gray-500">
              Next prompt {dayjs(storyQuery.nextDate).fromNow()}
            </p>
          </>
        )}
      </div>
    </Layout>
  );
}
