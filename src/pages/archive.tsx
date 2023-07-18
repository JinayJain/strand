import Button from "@/components/Button";
import Layout from "@/components/Layout";
import { api } from "@/utils/api";
import dayjs from "dayjs";
import Link from "next/link";
import { useMemo } from "react";

export default function Archive() {
  const endDate = useMemo(() => dayjs.utc().startOf("day").toDate(), []);

  const { data: stories } = api.story.getStories.useQuery({
    to: endDate,
  });

  return (
    <Layout pageTitle="Archive">
      <h1 className="mb-4 text-xl font-bold">All Stories</h1>
      <div className="space-y-6">
        {stories &&
          stories.map((story) => (
            <div key={story.id} className="space-y-1">
              {story.active_date && (
                <p className="text-xs text-gray-400">
                  {dayjs.utc(story.active_date).format("MMMM D, YYYY")}
                </p>
              )}
              <div className="bg-gray-100 p-4 sm:flex sm:items-center sm:space-x-2">
                <div className="flex-1">
                  <h4 className="text-lg italic">{story.title}</h4>
                  <p className="text-gray-500">{story.root.content}</p>
                </div>
                <div>
                  <Link href={`/s/${story.root.id}`}>
                    <Button className="mt-4 w-full border-gray-500 sm:mt-0 sm:w-auto">
                      Explore
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
      </div>
    </Layout>
  );
}
