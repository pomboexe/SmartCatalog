import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Input({ label, id, className = "", ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="block text-sm font-medium text-ink-soft" htmlFor={inputId}>
      {label}
      <input
        id={inputId}
        className={`mt-1.5 w-full rounded-xl border border-ink/12 bg-mist px-3.5 py-3 text-ink outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20 ${className}`}
        {...props}
      />
    </label>
  );
}
