import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Maximize, Minimize } from "lucide-react";
import toast from "react-hot-toast";

import { iconPop } from "../utils/motion";

// Switches the browser in and out of fullscreen for the whole app.
export const FullscreenToggle = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const syncFullscreenState = () =>
      setIsFullscreen(Boolean(document.fullscreenElement));

    syncFullscreenState();
    document.addEventListener("fullscreenchange", syncFullscreenState);

    return () =>
      document.removeEventListener("fullscreenchange", syncFullscreenState);
  }, []);

  const handleToggle = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }

      await document.documentElement.requestFullscreen();
    } catch {
      toast.error("Fullscreen is not available in this browser.");
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleToggle}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-line bg-card text-ink-soft shadow-sm transition-colors duration-200 hover:border-muted/40 hover:text-ink focus:outline-none focus-visible:ring-4 focus-visible:ring-brand/20"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isFullscreen ? "exit" : "enter"}
          variants={iconPop}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex"
        >
          {isFullscreen ? (
            <Minimize className="h-4 w-4" />
          ) : (
            <Maximize className="h-4 w-4" />
          )}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
};

export default FullscreenToggle;
