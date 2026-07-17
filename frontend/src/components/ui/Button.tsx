import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className = "", children, ...props }: ButtonProps) {
  return (
    <button
      className={`mt-2 w-full rounded-xl bg-ink px-4 py-3.5 font-display text-sm font-bold tracking-wide text-white transition hover:bg-ink-soft active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
