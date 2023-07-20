import Layout from "@/components/Layout";
import { StoryCard } from "@/components/StoryCard";
import { api } from "@/utils/api";
import dayjs from "dayjs";
import { useMemo } from "react";

export default function Archive() {
  const endDate = useMemo(() => dayjs().startOf("day").toDate(), []);

  const { data: stories } = api.story.getStories.useQuery({
    to: endDate,
  });

  return (
    <Layout pageTitle="Archive">
      <h1 className="mb-4 text-xl font-bold">All Stories</h1>
      <div className="space-y-6">
        {stories &&
          stories.map((story) => (
            <StoryCard
              key={story.id}
              id={story.id}
              rootId={story.root.id}
              title={story.title}
              activeDate={story.active_date}
              prompt={story.root.content}
            />
          ))}
      </div>
    </Layout>
  );
}
