import Button from "@/components/Button";
import Layout from "@/components/Layout";
import { StoryCard } from "@/components/StoryCard";
import TextInput from "@/components/TextInput";
import Textbox from "@/components/Textbox";
import { api } from "@/utils/api";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Admin() {
  const { data: stories, refetch } = api.story.getStories.useQuery({});

  const createStory = api.story.createStory.useMutation();

  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [activeDate, setActiveDate] = useState<string | undefined>();

  const handleCreate = async () => {
    const result = await createStory.mutateAsync({
      title: title,
      prompt: text,
      activeDate,
    });

    if (result) {
      setTitle("");
      setText("");
      setActiveDate(undefined);
      await refetch();
    }
  };

  return (
    <Layout pageTitle="Admin" allowedRoles={["ADMIN"]}>
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="space-y-2">
        <h1 className="text-xl font-bold">New Story</h1>
        <TextInput placeholder="Title" value={title} onChange={setTitle} />
        <Textbox
          value={text}
          onChange={(value) => setText(value)}
          placeholder="Once upon a time..."
        />
        <div className="space-x-2">
          <label>Active Date</label>
          <input
            type="date"
            onChange={(e) => setActiveDate(e.target.value)}
            className="border p-1"
          />
        </div>
        <Button onClick={handleCreate}>Create</Button>
      </div>

      <h1 className="mb-4 mt-8 text-xl font-bold">All Stories</h1>
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
