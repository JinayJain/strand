import clsx from "clsx";

export default function TextInput({
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
    <input
      type="text"
      className={clsx(
        "inline-block w-full border bg-gray-100 p-2 placeholder:italic",
        className
      )}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
}
