import clsx from "clsx";

export default function Input({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"input">) {
  return (
    <input
      className={clsx(
        "border border-black py-2 px-4 bg-white text-black",
        className
      )}
      {...props}
    />
  );
}
