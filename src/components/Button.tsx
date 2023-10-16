import clsx from "clsx";

type ButtonVariant = "dark" | "light";

export default function Button({
  children,
  variant = "dark",
  className,
  ...props
}: React.ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
}) {
  return (
    <button
      className={clsx(
        "border border-black px-4 py-2",
        {
          "bg-black hover:bg-dark text-white": variant === "dark",
          "bg-white hover:bg-light": variant === "light",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
