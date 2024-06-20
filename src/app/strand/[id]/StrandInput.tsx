"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import clsx from "clsx";
import { useState } from "react";

import Button from "@/components/Button";
import Textarea from "@/components/Textarea";
import createStrand from "@/lib/action/createStrand";
import clientEnv from "@/lib/clientEnv";
import { MAX_STRAND_LENGTH } from "@/lib/constants";

function StrandInput({
  parentId,
  storyId,
  ...props
}: {
  parentId: number;
  storyId: string;
} & React.ComponentPropsWithoutRef<"form">) {
  const createStrandAction = createStrand.bind(null, parentId, storyId);
  const [text, setText] = useState("");

  const remainingChars = MAX_STRAND_LENGTH - text.length;

  return (
    <form action={createStrandAction} {...props}>
      <Textarea
        className="w-full"
        maxLength={MAX_STRAND_LENGTH}
        name="content"
        onChange={(e) => setText(e.target.value)}
        value={text}
        placeholder="Add your own continuation"
      />
      <div className="flex items-center justify-end space-x-2">
        <p
          className={clsx("inline text-sm", {
            "bg-dark text-light": remainingChars === 0,
            "text-mid": remainingChars > 0,
          })}
        >
          {remainingChars === 0 ? "Max length reached" : remainingChars}
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
  );
}

export default StrandInput;
