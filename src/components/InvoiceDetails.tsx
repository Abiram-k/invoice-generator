import { AnimatePresence, motion } from "framer-motion";
import { Calculator, Hash, IndianRupee, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useInvoiceStore } from "../store/useInvoiceStore";
import { TextField, TextareaField } from "./Field";
import { listItem } from "../utils/motion";
import { calculateInvoiceTotals } from "../utils/invoiceTotals";

const rowGrid =
  "grid grid-cols-1 gap-4 md:grid-cols-[2.5rem_minmax(0,2.4fr)_1fr_1fr_1fr_2.5rem] md:items-start md:gap-3";


const mobileLabel = "mb-1.5 block text-xs font-medium text-muted md:sr-only";

const InvoiceDetails = () => {
  const { t } = useTranslation();
  const { formData, setFormData } = useInvoiceStore();
  const rows = formData.invoiceDetails ?? [];

  const handleInvoiceDetailChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedDetails = rows.map((detail, i) => {
      if (i !== index) return detail;

      const updatedDetail = { ...detail, [field]: value };
      const qty = Number(updatedDetail.duty) || 0;
      const rate = Number(updatedDetail.rate) || 0;
      updatedDetail.amount = String(qty * rate);

      return updatedDetail;
    });

    setFormData({
      invoiceDetails: updatedDetails,
      ...calculateInvoiceTotals({ ...formData, invoiceDetails: updatedDetails }),
    });
  };

  // Removes a single line item and recalculates the totals that depended on it.
  const handleRemoveRow = (index: number) => {
    if (rows.length <= 1) return;

    const updatedDetails = rows.filter((_, i) => i !== index);

    setFormData({
      invoiceDetails: updatedDetails,
      ...calculateInvoiceTotals({ ...formData, invoiceDetails: updatedDetails }),
    });
  };

  return (
    <div className="space-y-3">
      {/* Column headers, desktop only. Each field keeps its own label for smaller screens. */}
      <div className={`${rowGrid} hidden px-3 pb-1 text-xs font-medium tracking-wide text-muted uppercase md:grid`}>
        <span>#</span>
        <span>{t("details.description_label")}</span>
        <span>{t("details.duty")}</span>
        <span>{t("details.rate")}</span>
        <span>{t("details.amount")}</span>
        <span className="sr-only">{t("details.actions")}</span>
      </div>

      <AnimatePresence initial={false}>
        {rows.map((detail, index) => (
          <motion.div
            key={index}
            layout
            variants={listItem}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`${rowGrid} rounded-xl border border-line bg-surface/60 p-3 transition-colors duration-200 hover:border-muted/30`}
          >
            <span className="hidden pt-2 md:flex md:justify-center">
              <motion.span
                layout
                className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-soft text-xs font-semibold text-brand"
              >
                {index + 1}
              </motion.span>
            </span>

            <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted uppercase md:hidden">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-soft text-brand">
                {index + 1}
              </span>
              {t("details.item")}
            </p>

            <TextareaField
              id={`description-${index}`}
              label={t("details.description_label")}
              labelClassName={mobileLabel}
              rows={2}
              placeholder={t("details.descriptionPlaceholder")}
              value={detail.description || ""}
              onChange={(e) =>
                handleInvoiceDetailChange(index, "description", e.target.value)
              }
            />

            <TextField
              id={`duty-${index}`}
              label={t("details.duty")}
              labelClassName={mobileLabel}
              type="number"
              inputMode="numeric"
              min="0"
              placeholder="0"
              icon={<Hash className="h-4 w-4" />}
              value={detail.duty || ""}
              onChange={(e) =>
                handleInvoiceDetailChange(index, "duty", e.target.value)
              }
            />

            <TextField
              id={`rate-${index}`}
              label={t("details.rate")}
              labelClassName={mobileLabel}
              type="number"
              inputMode="decimal"
              min="0"
              placeholder="0"
              icon={<IndianRupee className="h-4 w-4" />}
              value={detail.rate || ""}
              onChange={(e) =>
                handleInvoiceDetailChange(index, "rate", e.target.value)
              }
            />

            <TextField
              id={`amount-${index}`}
              label={t("details.amount")}
              labelClassName={mobileLabel}
              readOnly
              tabIndex={-1}
              icon={<Calculator className="h-4 w-4" />}
              className="bg-surface font-semibold text-ink"
              placeholder="0"
              value={detail.amount || ""}
              onChange={() => undefined}
            />

            <div className="flex justify-end md:pt-1.5">
              <motion.button
                type="button"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleRemoveRow(index)}
                disabled={rows.length <= 1}
                aria-label={t("details.removeItem", { index: index + 1 })}
                className="cursor-pointer rounded-lg p-2 text-muted transition-colors duration-200 hover:bg-danger-soft hover:text-danger disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted"
              >
                <Trash2 className="h-4 w-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default InvoiceDetails;
