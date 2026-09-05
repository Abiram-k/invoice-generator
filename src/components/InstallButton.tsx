import { AnimatePresence, motion } from "framer-motion";
import { Download } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useInstallPrompt } from "../hooks/useInstallPrompt";

// Shows the install action only while the browser can install the app.
export const InstallButton = () => {
  const { t } = useTranslation();
  const { canInstall, promptInstall } = useInstallPrompt();

  return (
    <AnimatePresence>
      {canInstall ? (
        <motion.button
          type="button"
          onClick={promptInstall}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          aria-label={t("install.action")}
          title={t("install.action")}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-line bg-card text-ink-soft shadow-sm transition-colors duration-200 hover:border-muted/40 hover:text-ink focus:outline-none focus-visible:ring-4 focus-visible:ring-brand/20"
        >
          <Download className="h-4 w-4" />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
};

export default InstallButton;
