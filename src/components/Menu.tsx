import { ReactNode, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, MoreVertical } from "lucide-react";
import { Button } from "./Button";

export interface MenuItem {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  selected?: boolean;
  tone?: "default" | "danger";
  separated?: boolean;
}

interface MenuProps {
  items: MenuItem[];
  label?: string;
  icon?: ReactNode;
  triggerText?: string;
}

// Dropdown menu for secondary actions, closing on outside click or Escape.
export const Menu = ({ items, label = "More actions", icon, triggerText }: MenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <Button
        type="button"
        variant="secondary"
        className="px-3"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={label}
        title={label}
        onClick={() => setIsOpen((open) => !open)}
        icon={icon ?? <MoreVertical className="h-4 w-4" />}
      >
        {triggerText}
      </Button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-xl border border-line bg-card p-1.5 shadow-lg"
          >
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  setIsOpen(false);
                  item.onClick();
                }}
                className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40 ${
                  item.tone === "danger"
                    ? "text-danger hover:bg-danger-soft"
                    : "text-ink-soft hover:bg-brand-soft hover:text-ink"
                } ${item.separated ? "mt-1.5 border-t border-line pt-3" : ""}`}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
                {item.selected ? <Check className="h-4 w-4 text-brand" /> : null}
              </button>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default Menu;
