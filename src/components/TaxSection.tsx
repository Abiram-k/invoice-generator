import { ReactNode, useEffect, useState } from "react";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import {
  Calculator,
  Check,
  Eraser,
  Hash,
  IndianRupee,
  Info,
  Percent,
  Receipt,
} from "lucide-react";
import toast from "react-hot-toast";

import { useInvoiceStore } from "../store/useInvoiceStore";
import { Button } from "./Button";
import { Tooltip } from "./Tooltip";
import PayableArt from "./illustrations/PayableArt";
import { calculateInvoiceTotals } from "../utils/invoiceTotals";
import { flashRing, iconPop } from "../utils/motion";

type TaxFieldName =
  | "cgstPercentage"
  | "cgstAmount"
  | "sgstPercentage"
  | "sgstAmount"
  | "igstPercentage"
  | "igstAmount";

type TaxPair = {
  key: string;
  title: string;
  percentageName: TaxFieldName;
  amountName: TaxFieldName;
};

const taxPairs: TaxPair[] = [
  { key: "cgst", title: "CGST", percentageName: "cgstPercentage", amountName: "cgstAmount" },
  { key: "sgst", title: "SGST", percentageName: "sgstPercentage", amountName: "sgstAmount" },
  { key: "igst", title: "IGST", percentageName: "igstPercentage", amountName: "igstAmount" },
];

// Shows an amount grouped in the Indian format, or a dash when nothing is calculated yet.
const formatAmount = (value?: string): string => {
  const parsed = Number(value);

  if (!value?.trim() || !Number.isFinite(parsed)) return "—";

  return parsed.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

interface SummaryRowProps {
  icon: ReactNode;
  label: string;
  value: string;
  badge?: string;
  divided?: boolean;
}

// One read only line of the tax summary.
const SummaryRow = ({ icon, label, value, badge, divided }: SummaryRowProps) => (
  <div
    className={`flex items-center justify-between gap-4 py-3 ${
      divided ? "border-t border-line" : ""
    }`}
  >
    <span className="flex items-center gap-2.5 text-sm text-ink-soft">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand">
        {icon}
      </span>
      {label}
      {badge ? (
        <span className="rounded-full bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand tabular-nums">
          {badge}
        </span>
      ) : null}
    </span>

    <span className="text-sm font-semibold text-ink tabular-nums">{value}</span>
  </div>
);

const TaxSection = () => {
  const { formData, setFormData } = useInvoiceStore();
  const flashControls = useAnimationControls();
  const [justCalculated, setJustCalculated] = useState(false);

  // Clears the calculated confirmation state shortly after it is shown.
  useEffect(() => {
    if (!justCalculated) return;

    const timer = setTimeout(() => setJustCalculated(false), 1800);
    return () => clearTimeout(timer);
  }, [justCalculated]);

  const isGstApplied = Boolean(
    formData.cgstPercentage?.trim() ||
      formData.sgstPercentage?.trim() ||
      formData.igstPercentage?.trim()
  );

  // Clears GST from the invoice and drops it back out of the payable totals.
  const handleRemoveGst = () => {
    const clearedGst = {
      cgstPercentage: "",
      sgstPercentage: "",
      igstPercentage: "",
      cgstAmount: "",
      sgstAmount: "",
      igstAmount: "",
    };

    setFormData({
      ...clearedGst,
      ...calculateInvoiceTotals({ ...formData, ...clearedGst }),
    });

    toast.success("GST removed from this invoice.");
  };

  // Applies the standard 9% CGST and SGST split, then refreshes every dependent total.
  const handleCalculateGst = () => {
    const percentages = {
      cgstPercentage: "9",
      sgstPercentage: "9",
      igstPercentage: "0",
    };

    setFormData({
      ...percentages,
      ...calculateInvoiceTotals({ ...formData, ...percentages }),
    });

    setJustCalculated(true);
    flashControls.start(flashRing);
  };

  return (
    <div className="space-y-5">
      <div className="relative z-30 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-brand-soft/60 px-4 py-3">
        <p className="text-sm text-ink-soft">
          {isGstApplied
            ? "GST is applied and every figure below updates as you edit the line items."
            : "No GST on this invoice yet. Apply it to add CGST and SGST to the payable total."}
        </p>

        <div className="flex items-center gap-2">
          <Tooltip
            content={
              <>
                <span className="mb-1.5 block text-sm font-semibold text-ink">
                  How these totals are calculated
                </span>
                Every figure comes from the line items: duty x rate gives each amount,
                those amounts add up to the taxable amount, and the duty counts add up
                to the tax duty. Calculate GST adds CGST and SGST at 9% each of the
                taxable amount (IGST 0%). The payable total is the taxable amount plus
                GST, and the words follow it automatically.
              </>
            }
          >
            {(triggerProps) => (
              <button
                type="button"
                aria-label="How these totals are calculated"
                className="cursor-help rounded-lg p-1.5 text-muted transition-colors duration-200 hover:bg-card hover:text-brand focus:outline-none focus-visible:ring-4 focus-visible:ring-brand/20"
                {...triggerProps}
              >
                <Info className="h-4 w-4" />
              </button>
            )}
          </Tooltip>

          <Button
            type="button"
            size="sm"
            onClick={handleCalculateGst}
            icon={
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={justCalculated ? "done" : "calc"}
                  variants={iconPop}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex"
                >
                  {justCalculated ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Calculator className="h-4 w-4" />
                  )}
                </motion.span>
              </AnimatePresence>
            }
          >
            {justCalculated ? "Calculated" : "Calculate GST"}
          </Button>

          <AnimatePresence initial={false}>
            {isGstApplied ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, width: 0 }}
                animate={{ opacity: 1, scale: 1, width: "auto" }}
                exit={{ opacity: 0, scale: 0.9, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <Button
                  type="button"
                  size="sm"
                  variant="danger"
                  onClick={handleRemoveGst}
                  icon={<Eraser className="h-4 w-4" />}
                >
                  Remove GST
                </Button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <motion.div
        animate={flashControls}
        className="grid grid-cols-1 gap-5 rounded-xl lg:grid-cols-5"
      >
        <div className="rounded-xl border border-line bg-surface/60 px-5 py-2 lg:col-span-3">
          <SummaryRow
            icon={<Hash className="h-3.5 w-3.5" />}
            label="Tax duty"
            value={formData.taxDuty?.trim() ? formData.taxDuty : "—"}
          />

          <SummaryRow
            icon={<Receipt className="h-3.5 w-3.5" />}
            label="Taxable amount"
            value={formatAmount(formData.totalTaxableAmount)}
            divided
          />

          {taxPairs.map(({ key, title, percentageName, amountName }) => (
            <SummaryRow
              key={key}
              icon={<Percent className="h-3.5 w-3.5" />}
              label={title}
              badge={`${formData[percentageName]?.trim() || "0"}%`}
              value={formatAmount(formData[amountName])}
              divided
            />
          ))}
        </div>

        <div className="relative flex flex-col justify-between overflow-hidden rounded-xl bg-brand p-5 text-white lg:col-span-2 dark:text-surface">
          <PayableArt className="pointer-events-none absolute -right-6 bottom-2 w-28 opacity-15 sm:-right-4 sm:bottom-16 sm:w-40 sm:opacity-20 lg:bottom-20 lg:w-44" />

          <div className="relative">
            <p className="text-xs font-semibold tracking-wide uppercase opacity-80">
              Total payable
            </p>
            <p className="mt-1.5 flex items-baseline gap-1 text-3xl font-semibold tabular-nums">
              <IndianRupee className="h-5 w-5 opacity-80" />
              {formatAmount(formData.totalInvoicePayable)}
            </p>
          </div>

          <div className="relative mt-5 rounded-xl bg-white/15 p-3.5 dark:bg-black/15">
            <p className="text-[11px] font-semibold tracking-wide uppercase opacity-80">
              In words
            </p>
            <p className="mt-1 text-sm leading-snug font-medium">
              {formData.totalInvoiceInWords?.trim() || "—"}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TaxSection;
