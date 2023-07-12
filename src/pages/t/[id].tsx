import Button from "@/components/Button";
import Layout from "@/components/Layout";
import Textbox from "@/components/Textbox";
import { api } from "@/utils/api";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Twine() {
  const router = useRouter();
  const { id } = router.query;
  const twineId = (id ?? "") as string;

  const twineQuery = api.twine.getTwineWithTree.useQuery({ id: twineId });
  const createTwine = api.twine.createTwine.useMutation();

  const [text, setText] = useState<string>("");

  const handleSubmit = async () => {
    const createdTwine = await createTwine.mutateAsync({
      content: text,
      parentId: twineId,
    });

    setText("");

    await router.push(`/t/${createdTwine.id}`);
  };

  return (
    <Layout pageTitle="Twine">
      {twineQuery.data && (
        <>
          <ul>
            {twineQuery.data.ancestors.map((twine) => (
              <li key={twine.id}>
                <Link href={`/t/${twine.id}`} className="hover:text-gray-500">
                  {twine.content}
                </Link>
              </li>
            ))}
          </ul>
          <p>{twineQuery.data.content}</p>
        </>
      )}

      <Textbox
        className="block"
        placeholder="Continue the story"
        value={text}
        onChange={(value) => setText(value)}
      />
      <Button className="mt-2" onClick={handleSubmit}>
        Submit
      </Button>

      {twineQuery.data && (
        <ul>
          {twineQuery.data.children.map((twine) => (
            <li key={twine.id} className="text-gray-300 hover:text-gray-400">
              <Link href={`/t/${twine.id}`}>{twine.content}</Link>
            </li>
          ))}
        </ul>
      )}
    </Layout>
  );
}
