import clsx from "clsx";

const DISPLAY_USED_LENGTH_THRESHOLD = 0.7;

export default function Textbox({
  className,
  value,
  onChange,
  disabled = false,
  placeholder,
  maxLength,
}: {
  className?: string;
  value?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
}) {
  const usedLength = value?.length ?? 0;
  return (
    <div className="relative">
      <textarea
        className={clsx(
          "inline-block w-full border bg-gray-100 p-2 placeholder:italic",
          disabled && "opacity-50",
          className
        )}
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange?.(e.target.value)}
      />
      {maxLength && usedLength > maxLength * DISPLAY_USED_LENGTH_THRESHOLD && (
        <div className="absolute bottom-2 right-2 text-sm text-gray-500">
          {value?.length ?? 0}/{maxLength}
        </div>
      )}
    </div>
  );
}
