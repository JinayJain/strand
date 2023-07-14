import Button from "@/components/Button";
import Layout from "@/components/Layout";
import { api } from "@/utils/api";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Home() {
  const currentStory = api.story.getCurrentStory.useQuery();
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
    <Layout pageTitle="Strand">
      <p>
        Strand is a collaborative storytelling experience. Every day, a new
        prompt begins a story. Each person can make one contribution to an
        existing story, answering the question “what happens next?” As stories
        unfold, numerous branching paths emerge, creating a captivating tapestry
        of interconnected storylines that take shape with each new contribution.
      </p>

      {currentStory.data && (
        <div className="mt-4 space-y-2">
          <h3 className="text-xl font-bold">Today&apos;s Prompt</h3>
          <div className="bg-gray-100 p-4">
            <h4 className="text-lg italic">{currentStory.data.title}</h4>
            <p className="text-gray-500">{currentStory.data.root.content}</p>
            <div className="mt-4 flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
              <Link href={`/s/${currentStory.data.root.id}`}>
                <Button className="w-full border-gray-500 sm:w-auto">
                  Continue the story
                </Button>
              </Link>
              <Button
                className="w-full border-gray-500 sm:w-auto"
                onClick={handleRandomStory(currentStory.data.id)}
              >
                Random storyline
              </Button>
            </div>
          </div>
          <div>
            <a
              className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
              href="https://forms.gle/6Z3Z6Z6Z6Z6Z6Z6Z6"
            >
              Suggest a prompt
            </a>
          </div>
        </div>
      )}
    </Layout>
  );
}
