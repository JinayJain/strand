import clsx from "clsx";

export default function Textbox({
  className,
  value,
  onChange,
  disabled = false,
  placeholder,
}: {
  className?: string;
  value?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <textarea
      className={clsx(
        "inline-block w-full border bg-gray-100 p-2 placeholder:italic",
        disabled && "opacity-50",
        className
      )}
      disabled={disabled}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
}
