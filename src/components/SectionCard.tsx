import { ReactNode } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "../utils/motion";

interface SectionCardProps {
  step: number;
  title: string;
  icon: ReactNode;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}

// Numbered form section with an icon badge, wrapped in an animated card.
export const SectionCard = ({
  step,
  title,
  icon,
  description,
  action,
  children,
}: SectionCardProps) => (
  <motion.section
    variants={fadeUp}
    className="group rounded-card border border-line bg-card/80 p-5 shadow-sm backdrop-blur-[2px] transition-shadow duration-300 hover:shadow-md sm:p-7"
  >
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <motion.span
          whileHover={{ scale: 1.08, rotate: -4 }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand"
        >
          {icon}
          <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[11px] font-semibold text-white shadow-sm">
            {step}
          </span>
        </motion.span>
        <div>
          <h2 className="text-base font-semibold text-ink">{title}</h2>
          {description ? (
            <p className="mt-0.5 text-sm text-muted">{description}</p>
          ) : null}
        </div>
      </div>
      {action}
    </header>
    {children}
  </motion.section>
);

export default SectionCard;
