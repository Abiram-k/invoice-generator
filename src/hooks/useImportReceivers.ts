import { useCallback } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { useReceiverStore } from "../store/useReceiverStore";
import { parseReceiversJson } from "../utils/parseReceiversJson";

// Adds receivers from raw JSON, whether it came from a file or a paste, and
// reports the outcome. Parse errors carry a translation key.
export const useImportReceivers = () => {
  const { t } = useTranslation();
  const addReceivers = useReceiverStore((state) => state.addReceivers);

  return useCallback(
    (raw: string): boolean => {
      try {
        const count = addReceivers(parseReceiversJson(raw));
        toast.success(t("toast.imported", { count }));
        return true;
      } catch (error) {
        toast.error(
          error instanceof Error
            ? t(`toast.${error.message}`, {
                defaultValue: t("toast.importFailed"),
              })
            : t("toast.importFailed")
        );
        return false;
      }
    },
    [addReceivers, t]
  );
};
