import clsx from "clsx";

type ButtonVariant = "dark" | "light";
type ButtonSize = "sm" | "md" | "lg";

export default function Button({
  children,
  variant = "dark",
  size = "md",
  className,
  ...props
}: React.ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button
      className={clsx(
        "border border-black px-4 py-2",
        {
          "bg-black text-white hover:bg-dark": variant === "dark",
          "bg-white hover:bg-light": variant === "light",
        },
        {
          "text-sm": size === "sm",
          "text-base": size === "md",
          "text-lg": size === "lg",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
