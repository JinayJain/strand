"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";

import Button from "@/components/Button";
import Textarea from "@/components/Textarea";
import createStrand from "@/lib/action/createStrand";
import clientEnv from "@/lib/clientEnv";
import { MAX_STRAND_LENGTH } from "@/lib/constants";
import { SelectStrand } from "@/lib/db/schema/strand";

export default function StrandContents({
  ancestry,
  parentId,
  storyId,
}: {
  ancestry: Pick<SelectStrand, "id" | "content">[];
  parentId: number;
  storyId: string;
}) {
  const [text, setText] = useState("");

  const createStrandAction = createStrand.bind(null, parentId, storyId);

  return (
    <>
      <p>
        {ancestry.map((ancestor) => (
          <span key={ancestor.id} className="hover:text-mid">
            <Link href={`/strand/${ancestor.id}`}>{ancestor.content}</Link>{" "}
          </span>
        ))}

        <span className="font-handwriting font-bold text-mid">{text}</span>
      </p>

      <form action={createStrandAction}>
        <Textarea
          className="w-full"
          maxLength={MAX_STRAND_LENGTH}
          name="content"
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
        <div className="flex items-center justify-end space-x-2">
          <p
            className={clsx("inline text-sm", {
              "bg-dark text-light": text.length == MAX_STRAND_LENGTH,
              "text-mid": text.length < MAX_STRAND_LENGTH,
            })}
          >
            {MAX_STRAND_LENGTH - text.length}
          </p>
          <Button type="submit">Add</Button>
        </div>

        <Turnstile
          siteKey={clientEnv.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY}
          options={{
            appearance: "always",
            theme: "light",
          }}
        />
      </form>
    </>
  );
}
