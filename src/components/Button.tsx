import clsx from "clsx";

export default function Button({
  className,
  children,
  onClick,
  type,
  icon,
}: {
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  type?: HTMLButtonElement["type"];
  icon?: React.ReactNode;
}) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center border p-2 text-center hover:bg-gray-200",
        className
      )}
      onClick={onClick}
      type={type}
    >
      {icon && <span className={clsx({ "mr-2": children })}>{icon}</span>}
      {children}
    </button>
  );
}
