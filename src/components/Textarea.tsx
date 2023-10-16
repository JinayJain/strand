import clsx from "clsx";

export default function Textarea({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"textarea">) {
  return (
    <textarea
      className={clsx(
        "border border-black bg-white px-4 py-2 text-black",
        className
      )}
      {...props}
    />
  );
}
