import clsx from "clsx";

export default function Button({
  className,
  children,
  onClick,
}: {
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      className={clsx("inline-block border p-2 hover:bg-gray-200", className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
