import Button from "@/components/Button";
import Layout from "@/components/Layout";
import Textbox from "@/components/Textbox";
import { api } from "@/utils/api";
import dayjs from "dayjs";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const TwitterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
  </svg>
);

export default function Strand() {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);

  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const { id } = router.query;
  const strandId = (id ?? "") as string;
  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const { data: strandQuery } = api.strand.getStrand.useQuery({
    id: strandId,
  });
  const isAuthor = session?.user.id === strandQuery?.author.id;

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

  const shareText = strandQuery
    ? isAuthor && strandQuery.isActiveStory
      ? `Just added my part to today's story, "${
          strandQuery.story.title ?? ""
        }" on Strand. Curious to see what comes next! Come join me in shaping this tale.`
      : `Check out this version of ${
          strandQuery.isActiveStory ? "today's" : "a"
        } crowdsourced story "${strandQuery.story.title}" written by ${
          strandQuery.ancestors.length + 1
        } strangers on Strand.`
    : "";

  const shareUrl = encodeURI(
    `https://twitter.com/share?url=${
      currentUrl ?? "https://strand.jinay.dev/"
    }&via=TheStrandApp&text=${shareText}`
  );

  return (
    <Layout pageTitle={strandQuery?.story.title} mainClass="space-y-4 mt-8">
      {strandQuery && (
        <div>
          <div className="mb-4">
            {!strandQuery.isActiveStory && (
              <h3 className="text-sm italic text-gray-500">
                {dayjs(strandQuery.story.active_date)
                  .utc()
                  .format("MMMM D, YYYY")}
              </h3>
            )}
            <h1 className="text-2xl font-bold">{strandQuery.story.title}</h1>

            <h3 className="text-base italic text-gray-500">
              by {strandQuery.author.name}
              {strandQuery.ancestors.length > 0 && (
                <> and {strandQuery.ancestors.length} more</>
              )}
            </h3>

            <Link href={shareUrl} target="_blank">
              <Button icon={<TwitterIcon />} className="mt-2">
                Share
              </Button>
            </Link>
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

      {strandQuery &&
        strandQuery.isActiveStory &&
        (strandQuery.hasContributed ? (
          <p className="text-sm text-gray-500">
            You&apos;ve already contributed to today&apos;s story.
          </p>
        ) : (
          <div className="space-y-2">
            {sessionStatus === "authenticated" ? (
              <>
                <Textbox
                  value={text}
                  onChange={setText}
                  placeholder="What happens next?"
                />

                <Button onClick={handleSubmit}>Add</Button>
              </>
            ) : (
              <>
                <Textbox placeholder="Sign up to contribute" disabled />
                <Button onClick={() => signIn()}>Sign up</Button>
              </>
            )}
          </div>
        ))}

      <div className="space-y-1">
        <h3 className="text-lg font-bold text-gray-500">Continuations</h3>
        {strandQuery && strandQuery.children.length !== 0 ? (
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
        ) : (
          <p className="text-sm text-gray-500">No continuations yet.</p>
        )}
      </div>
    </Layout>
  );
}
