import { MouseEvent } from "react";
import { flushSync } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useThemeStore } from "../store/useThemeStore";
import { iconPop } from "../utils/motion";

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => { ready: Promise<void> };
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Theme switch that paints the new theme outward from the button.
export const ThemeToggle = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === "dark";

  // Eases the colour change when the browser cannot run a view transition.
  const runFallbackTransition = () => {
    const root = document.documentElement;

    root.classList.add("theme-transition");
    toggleTheme();
    window.setTimeout(() => root.classList.remove("theme-transition"), 460);
  };

  const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
    const startViewTransition = (document as ViewTransitionDocument)
      .startViewTransition;

    if (!startViewTransition || prefersReducedMotion()) {
      runFallbackTransition();
      return;
    }

    const { top, left, width, height } =
      event.currentTarget.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = startViewTransition.call(document, () => {
      flushSync(() => toggleTheme());
    });

    transition.ready.then(() => {
      const root = document.documentElement;
      const duration = 800;

      // The new theme sweeps out from the button.
      root.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );

      // The old theme dissolves behind it so the sweeping edge never looks hard.
      root.animate(
        { opacity: [1, 0] },
        {
          duration,
          easing: "cubic-bezier(0.4, 0, 0.6, 1)",
          pseudoElement: "::view-transition-old(root)",
        }
      );
    });
  };

  return (
    <motion.button
      type="button"
      onClick={handleToggle}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      aria-label={isDark ? t("theme.toLight") : t("theme.toDark")}
      title={isDark ? t("theme.toLight") : t("theme.toDark")}
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-line bg-card text-ink-soft shadow-sm transition-colors duration-200 hover:border-muted/40 hover:text-ink focus:outline-none focus-visible:ring-4 focus-visible:ring-brand/20"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          variants={iconPop}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
};

export default ThemeToggle;
