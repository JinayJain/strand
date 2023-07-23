import dayjs from "dayjs";
import Link from "next/link";
import Button from "./Button";
import { pluralize } from "@/utils/ui";

export const StoryCard = ({
  id,
  rootId,
  title,
  activeDate,
  prompt,
  strandCount,
}: {
  id: string;
  rootId: string;
  title: string;
  activeDate: Date | null;
  prompt: string;
  strandCount?: number;
}) => (
  <div key={id} className="space-y-1">
    <div className="flex space-x-2">
      {activeDate && (
        <p className="text-xs text-gray-400">
          {dayjs(activeDate).format("MMMM D, YYYY")}
        </p>
      )}
    </div>
    <div className="bg-gray-100 p-4 sm:flex sm:items-center sm:space-x-2">
      <div className="flex-1">
        <h4 className="text-lg italic">{title}</h4>
        <p className="text-gray-500">{prompt}</p>
      </div>
      <div className="text-center">
        <Link href={`/s/${rootId}`}>
          <Button className="mt-4 w-full border-gray-500 sm:mt-0 sm:w-auto">
            Explore
          </Button>
        </Link>
        {strandCount && (
          <p className="text-xs text-gray-400">
            {pluralize(strandCount, "strand")}
          </p>
        )}
      </div>
    </div>
  </div>
);
