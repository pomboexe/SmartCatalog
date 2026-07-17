import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClass: Record<ButtonVariant, string> = {
  primary: "bg-ink text-mist hover:bg-ink-soft",
  secondary: "border border-ink/12 bg-surface text-ink hover:bg-mist",
  danger: "bg-coral text-mist hover:bg-coral/90",
};

export function Button({
  className = "",
  variant = "primary",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-xl px-4 py-3 font-display text-sm font-bold tracking-wide transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 ${variantClass[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
