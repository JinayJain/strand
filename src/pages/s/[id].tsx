import Button from "@/components/Button";
import Layout from "@/components/Layout";
import Textbox from "@/components/Textbox";
import { api } from "@/utils/api";
import { MAX_STRAND_LENGTH_CHARS } from "@/utils/consts";
import dayjs from "dayjs";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
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
  const findAvailableStrand = api.strand.findAvailableStrand.useMutation();

  const [text, setText] = useState<string>("");

  const handleSubmit = async () => {
    const createdStrand = await createChildStrand.mutateAsync({
      content: text,
      parentId: strandId,
    });

    setText("");

    await router.push(`/s/${createdStrand.id}`);
  };

  const handleFindAvailable = async () => {
    if (!strandQuery) return;

    const foundStrand = await findAvailableStrand.mutateAsync({
      storyId: strandQuery.story.id,
    });

    if (foundStrand) {
      await router.push(`/s/${foundStrand.id}`);
    } else {
      toast.error("No available strands found. Thanks for contributing!");
    }
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

  const getContributionBox = () => {
    if (!strandQuery || !strandQuery.isActiveStory) {
      return null;
    }

    switch (strandQuery.contributionStatus) {
      case "allowed":
        return (
          <div className="space-y-2">
            <Textbox
              value={text}
              onChange={setText}
              placeholder="What happens next?"
              maxLength={MAX_STRAND_LENGTH_CHARS}
            />
            <Button onClick={handleSubmit}>Add</Button>
          </div>
        );
      case "contributed":
        return (
          <p className="text-sm text-gray-500">
            You&apos;ve already contributed to this strand. Try sharing it with
            your friends!{" "}
            <a
              href="#"
              onClick={handleFindAvailable}
              className="text-sm underline hover:text-gray-700"
            >
              Find another strand
            </a>
          </p>
        );
      case "own":
        return (
          <p className="text-sm text-gray-500">
            This is your strand. Try sharing it with your friends to continue
            the story!{" "}
            <a
              href="#"
              onClick={handleFindAvailable}
              className="text-sm underline hover:text-gray-700"
            >
              Find another strand
            </a>
          </p>
        );
      case "unauthenticated":
        return (
          <div className="space-y-2">
            <Textbox
              disabled
              value={text}
              onChange={setText}
              placeholder="Sign in to contribute"
              maxLength={MAX_STRAND_LENGTH_CHARS}
            />
            <Button onClick={signIn}>Sign in</Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout pageTitle={strandQuery?.story.title} mainClass="space-y-4 mt-8">
      {strandQuery && (
        <div>
          <div className="mb-4">
            {!strandQuery.isActiveStory && (
              <h3 className="text-sm italic text-gray-500">
                {strandQuery.story.active_date
                  ? dayjs(strandQuery.story.active_date).format("MMMM D, YYYY")
                  : "Unscheduled"}
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

      {getContributionBox()}

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
