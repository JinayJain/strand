import clsx from "clsx";

export default function TextInput({
  className,
  value,
  onChange,
  placeholder,
  error,
  hint,
}: {
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  hint?: string;
}) {
  return (
    <>
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
      {error && <p className="text-sm text-red-700">[!] {error}</p>}
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </>
  );
}
