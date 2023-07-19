import Button from "@/components/Button";
import Layout from "@/components/Layout";
import Textbox from "@/components/Textbox";
import { api } from "@/utils/api";
import dayjs from "dayjs";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RiTwitterFill } from "react-icons/ri";

export default function Strand() {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [isReporting, setIsReporting] = useState<boolean>(false);
  const [reportReason, setReportReason] = useState<string>();

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
  const reportStrand = api.strand.reportStrand.useMutation();

  const [text, setText] = useState<string>("");

  const handleSubmit = async () => {
    const createdStrand = await createChildStrand.mutateAsync({
      content: text,
      parentId: strandId,
    });

    setText("");

    await router.push(`/s/${createdStrand.id}`);
  };

  const handleReport = async () => {
    await reportStrand.mutateAsync({
      id: strandId,
      reason: reportReason,
    });

    setIsReporting(false);
    setReportReason("");
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
    : "" + "\n\n";

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
              by {strandQuery.author.username ?? "Anonymous"}
              {strandQuery.ancestors.length > 0 && (
                <> and {strandQuery.ancestors.length} more</>
              )}
            </h3>

            <Link href={shareUrl} target="_blank">
              <Button icon={<RiTwitterFill size={24} />} className="mt-2">
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

      <div className="space-y-2">
        <a
          className="text-sm text-gray-500 underline hover:text-gray-700"
          onClick={() => setIsReporting((value) => !value)}
          href="#"
        >
          Report
        </a>

        {isReporting && (
          <>
            <Textbox
              value={reportReason}
              onChange={setReportReason}
              placeholder="(optional) Reason for reporting"
            />
            <Button onClick={handleReport}>Report</Button>
          </>
        )}
      </div>
    </Layout>
  );
}
