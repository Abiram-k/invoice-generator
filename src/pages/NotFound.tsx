import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { fadeUp, staggerContainer } from "../utils/motion";
import NotFoundArt from "../components/illustrations/NotFoundArt";

const NotFound = () => {
  const { t } = useTranslation();
  const COMPANY_NAME = import.meta.env.VITE_COMPANY_NAME;

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md rounded-card border border-line bg-card p-8 text-center shadow-sm"
      >
        <motion.div variants={fadeUp} className="mb-4 flex justify-center">
          <NotFoundArt className="h-40 w-auto" />
        </motion.div>

        <motion.h1 variants={fadeUp} className="text-3xl font-semibold text-ink">
          {t("notFound.title")}
        </motion.h1>

        <motion.p variants={fadeUp} className="mt-2 text-sm text-muted">
          {t("notFound.message")}
        </motion.p>

        <motion.div variants={fadeUp} className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white dark:text-surface transition-colors duration-200 hover:bg-brand-strong focus:outline-none focus-visible:ring-4 focus-visible:ring-brand/30"
          >
            {t("notFound.action")}
          </Link>
        </motion.div>

        {COMPANY_NAME ? (
          <motion.p variants={fadeUp} className="mt-6 text-xs text-muted">
            {COMPANY_NAME}
          </motion.p>
        ) : null}
      </motion.div>
    </div>
  );
};

export default NotFound;
