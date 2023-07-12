import clsx from "clsx";

export default function Textbox({
  className,
  value,
  onChange,
  placeholder,
}: {
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <textarea
      className={clsx("inline-block w-full border bg-gray-100 p-2", className)}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
}
