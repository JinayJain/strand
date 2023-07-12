import Button from "@/components/Button";
import Layout from "@/components/Layout";
import Textbox from "@/components/Textbox";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useState } from "react";

export default function StrandNew() {
  const createStrand = api.strand.createStrand.useMutation();
  const router = useRouter();

  const [text, setText] = useState<string>("");

  const handleCreate = async () => {
    const result = await createStrand.mutateAsync({
      content: text,
    });

    await router.push(`/t/${result.id}`);
  };

  return (
    <Layout pageTitle="Strand">
      {/* <textarea
        className="block"
        placeholder="Start your story here"
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea> */}
      <Textbox
        value={text}
        onChange={(value) => setText(value)}
        placeholder="Start your story here"
      />

      <Button className="mt-2" onClick={handleCreate}>
        Create
      </Button>
    </Layout>
  );
}
