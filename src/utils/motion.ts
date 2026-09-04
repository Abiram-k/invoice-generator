import type { TargetAndTransition, Transition, Variants } from "framer-motion";

export const easeOutTransition: Transition = {
  duration: 0.35,
  ease: [0.22, 1, 0.36, 1],
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: easeOutTransition },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

export const listItem: Variants = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0, transition: easeOutTransition },
  exit: { opacity: 0, x: -12, transition: { duration: 0.18 } },
};

export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: easeOutTransition },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

// Highlight pulse used to draw attention to values that were just calculated.
export const flashRing: TargetAndTransition = {
  boxShadow: [
    "0 0 0 0 rgba(79, 70, 229, 0)",
    "0 0 0 4px rgba(79, 70, 229, 0.18)",
    "0 0 0 0 rgba(79, 70, 229, 0)",
  ],
  transition: { duration: 1.1, ease: "easeOut" },
};

export const iconPop: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 500, damping: 22 } },
  exit: { opacity: 0, scale: 0.6, transition: { duration: 0.15 } },
};
