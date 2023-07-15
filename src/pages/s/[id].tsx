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

  const { data: strandQuery } = api.strand.getStrand.useQuery({
    id: strandId,
  });
  const createChildStrand = api.strand.createChildStrand.useMutation();

  const [text, setText] = useState<string>("");

  const handleSubmit = async () => {
    const createdStrand = await createChildStrand.mutateAsync({
      content: text,
      parentId: strandId,
    });

    setText("");

    await router.push(`/s/${createdStrand.id}`);
  };

  return (
    <Layout pageTitle="Strand">
      {strandQuery && (
        <div className="mb-8 mt-4">
          <div className="mb-4">
            <h1 className="text-2xl font-bold">{strandQuery.story.title}</h1>
            <h3 className="text-base italic text-gray-500">
              by {strandQuery.author.name}
              {strandQuery.ancestors.length > 0 && (
                <> and {strandQuery.ancestors.length} more</>
              )}
            </h3>
          </div>
          <p>
            {[...strandQuery.ancestors, strandQuery].map((ancestor) => (
              <Link href={`/s/${ancestor.id}`} key={ancestor.id}>
                <span key={ancestor.id} className="hover:text-gray-500">
                  {ancestor.content}{" "}
                </span>
              </Link>
            ))}

            <span className="italic text-gray-500">{text}</span>
          </p>
        </div>
      )}

      {strandQuery && strandQuery.hasContributed ? (
        <p className="text-sm text-gray-500">
          You&apos;ve already contributed to today&apos;s story.
        </p>
      ) : (
        <div className="mt-4 space-y-2">
          <Textbox
            value={text}
            onChange={setText}
            placeholder="What happens next?"
          />
          <div className="flex items-center space-x-2">
            <Button onClick={handleSubmit}>Add</Button>
          </div>
        </div>
      )}

      {strandQuery && strandQuery.children.length !== 0 && (
        <div>
          <h3 className="mb-1 mt-8 text-lg font-bold text-gray-500">
            Continuations
          </h3>
          <div>
            {strandQuery.children.map((child) => (
              <Link
                key={child.id}
                href={`/s/${child.id}`}
                className="block hover:text-gray-500"
              >
                {child.content}
              </Link>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}
