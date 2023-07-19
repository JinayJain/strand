import dayjs from "dayjs";
import Link from "next/link";
import Button from "./Button";

export const StoryCard = ({
  id,
  rootId,
  title,
  activeDate,
  prompt,
}: {
  id: string;
  rootId: string;
  title: string;
  activeDate: Date | null;
  prompt: string;
}) => (
  <div key={id} className="space-y-1">
    {activeDate && (
      <p className="text-xs text-gray-400">
        {dayjs.utc(activeDate).format("MMMM D, YYYY")}
      </p>
    )}
    <div className="bg-gray-100 p-4 sm:flex sm:items-center sm:space-x-2">
      <div className="flex-1">
        <h4 className="text-lg italic">{title}</h4>
        <p className="text-gray-500">{prompt}</p>
      </div>
      <div>
        <Link href={`/s/${rootId}`}>
          <Button className="mt-4 w-full border-gray-500 sm:mt-0 sm:w-auto">
            Explore
          </Button>
        </Link>
      </div>
    </div>
  </div>
);
