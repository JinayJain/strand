import Button from "@/components/Button";
import Layout from "@/components/Layout";
import TextInput from "@/components/TextInput";
import Textbox from "@/components/Textbox";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useState } from "react";

export default function StrandNew() {
  const createStory = api.story.createStory.useMutation();
  const router = useRouter();

  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [activeDate, setActiveDate] = useState<string | undefined>();

  const handleCreate = async () => {
    const activeDateObj = activeDate ? new Date(activeDate) : undefined;

    const result = await createStory.mutateAsync({
      title: title,
      prompt: text,
      activeDate: activeDateObj,
    });
    await router.push(`/s/${result.root.id}`);
  };

  return (
    <Layout pageTitle="Strand">
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
          <input type="date" onChange={(e) => setActiveDate(e.target.value)} />
        </div>
        <Button onClick={handleCreate}>Create</Button>
      </div>
    </Layout>
  );
}
