import Link from "next/link";

import { SelectStrand } from "@/lib/db/schema/strand";

export default function StrandAncestry({
  ancestry,
  ...props
}: {
  ancestry: Pick<SelectStrand, "id" | "content">[];
} & React.ComponentPropsWithoutRef<"p">) {
  return (
    <p {...props}>
      {ancestry.map((ancestor) => (
        <span key={ancestor.id} className="hover:text-mid">
          <Link href={`/strand/${ancestor.id}`}>{ancestor.content}</Link>{" "}
        </span>
      ))}
    </p>
  );
}
