import { ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white shadow-sm hover:bg-brand-strong focus-visible:ring-brand/30 dark:text-surface",
  secondary: "bg-card text-ink-soft border border-line shadow-sm hover:border-muted/40 focus-visible:ring-brand/20",
  danger: "bg-danger-soft text-danger border border-danger/20 hover:bg-danger hover:text-white focus-visible:ring-danger/25",
  ghost: "text-ink-soft hover:bg-brand-soft focus-visible:ring-brand/20",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2.5 text-sm gap-2",
  lg: "px-6 py-3 text-base gap-2.5",
};

type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"
> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
};

// Shared button with consistent styling and press feedback.
export const Button = ({
  variant = "primary",
  size = "md",
  icon,
  className,
  children,
  ...buttonProps
}: ButtonProps) => (
  <motion.button
    whileHover={{ y: -1 }}
    whileTap={{ scale: 0.97 }}
    transition={{ type: "spring", stiffness: 400, damping: 25 }}
    className={`inline-flex cursor-pointer items-center justify-center rounded-xl font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${sizeClasses[size]} ${className ?? ""}`}
    {...buttonProps}
  >
    {icon}
    {children}
  </motion.button>
);

export default Button;
