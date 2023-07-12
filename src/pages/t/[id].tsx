import Button from "@/components/Button";
import Layout from "@/components/Layout";
import Textbox from "@/components/Textbox";
import { api } from "@/utils/api";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Strand() {
  const router = useRouter();
  const { id } = router.query;
  const strandId = (id ?? "") as string;

  const strandQuery = api.strand.getStrandWithTree.useQuery({ id: strandId });
  const createStrand = api.strand.createStrand.useMutation();

  const [text, setText] = useState<string>("");

  const handleSubmit = async () => {
    const createdStrand = await createStrand.mutateAsync({
      content: text,
      parentId: strandId,
    });

    setText("");

    await router.push(`/t/${createdStrand.id}`);
  };

  return (
    <Layout pageTitle="Strand">
      {strandQuery.data && (
        <>
          <ul>
            {strandQuery.data.ancestors.map((strand) => (
              <li key={strand.id}>
                <Link href={`/t/${strand.id}`} className="hover:text-gray-500">
                  {strand.content}
                </Link>
              </li>
            ))}
          </ul>
          <p>{strandQuery.data.content}</p>
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

      {strandQuery.data && (
        <ul>
          {strandQuery.data.children.map((strand) => (
            <li key={strand.id} className="text-gray-300 hover:text-gray-400">
              <Link href={`/t/${strand.id}`}>{strand.content}</Link>
            </li>
          ))}
        </ul>
      )}
    </Layout>
  );
}
