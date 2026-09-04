import { ReactNode, useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  icon?: ReactNode;
  onClose: () => void;
  children?: ReactNode;
  footer?: ReactNode;
}

// Accessible animated dialog used for confirmations and short forms.
export const Modal = ({
  open,
  title,
  description,
  icon,
  onClose,
  children,
  footer,
}: ModalProps) => {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-card border border-line bg-card p-5 shadow-xl sm:p-6"
          >
            <div className="mb-5 flex items-start gap-3.5">
              {icon ? (
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                  {icon}
                </span>
              ) : null}

              <div className="flex-1">
                <h2 id={titleId} className="text-base font-semibold text-ink">
                  {title}
                </h2>
                {description ? (
                  <p className="mt-1 text-sm text-muted">{description}</p>
                ) : null}
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="cursor-pointer rounded-lg p-1.5 text-muted transition-colors duration-200 hover:bg-surface hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {children}

            {footer ? (
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                {footer}
              </div>
            ) : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
};

export default Modal;
