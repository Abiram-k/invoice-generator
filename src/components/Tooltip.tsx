import { ReactNode, useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface TooltipProps {
  content: ReactNode;
  children: (props: {
    "aria-describedby"?: string;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onFocus: () => void;
    onBlur: () => void;
  }) => ReactNode;
}

// Small hover and focus tooltip anchored under its trigger.
export const Tooltip = ({ content, children }: TooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <span className="relative inline-flex">
      {children({
        "aria-describedby": isOpen ? tooltipId : undefined,
        onMouseEnter: () => setIsOpen(true),
        onMouseLeave: () => setIsOpen(false),
        onFocus: () => setIsOpen(true),
        onBlur: () => setIsOpen(false),
      })}

      <AnimatePresence>
        {isOpen ? (
          <motion.span
            id={tooltipId}
            role="tooltip"
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 z-40 mt-2 w-72 rounded-xl border border-line bg-card p-3.5 text-left text-xs leading-relaxed font-normal text-ink-soft shadow-lg"
          >
            {content}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  );
};

export default Tooltip;
