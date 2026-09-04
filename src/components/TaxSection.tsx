import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { Calculator, Check, Eraser, IndianRupee, Info, Percent } from "lucide-react";
import toast from "react-hot-toast";
import { useInvoiceStore } from "../store/useInvoiceStore";
import { TextField } from "./Field";
import { Button } from "./Button";
import { Tooltip } from "./Tooltip";
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });
  };

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
  const handleAutoCalcuate = () => {
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
            ? "GST is applied and recalculates as you edit the line items."
            : "No GST on this invoice yet. Apply it to add CGST and SGST to the payable total."}
        </p>

        <div className="flex items-center gap-2">
          <Tooltip
            content={
              <>
                <span className="mb-1.5 block text-sm font-semibold text-ink">
                  How GST is calculated
                </span>
                Each line item contributes duty x rate. Those amounts add up to the
                total taxable amount, and the duty counts add up to the tax duty.
                Calculate GST adds CGST and SGST at 9% each of that taxable amount
                (IGST 0%), so the payable total becomes the taxable amount plus GST.
                Remove GST clears it and the payable falls back to the taxable amount
                alone.
              </>
            }
          >
            {(triggerProps) => (
              <button
                type="button"
                aria-label="How GST is calculated"
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
            onClick={handleAutoCalcuate}
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

      <motion.div animate={flashControls} className="space-y-5 rounded-xl">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {taxPairs.map(({ key, title, percentageName, amountName }) => (
            <motion.div
              key={key}
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="rounded-xl border border-line bg-surface/60 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand">
                    <Percent className="h-3.5 w-3.5" />
                  </span>
                  {title}
                </h3>
                <span className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand tabular-nums">
                  {formData[percentageName] || "0"}%
                </span>
              </div>

              <p className="mt-4 text-xs font-medium tracking-wide text-muted uppercase">
                Amount
              </p>
              <p className="mt-0.5 flex items-baseline gap-1 text-2xl font-semibold text-ink tabular-nums">
                <IndianRupee className="h-4 w-4 text-muted" />
                {formatAmount(formData[amountName])}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="border-t border-line pt-5">
          <p className="mb-3 text-xs font-medium tracking-wide text-muted uppercase">
            Calculation basis
          </p>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <TextField
              id="taxDuty"
              name="taxDuty"
              label="Tax Duty"
              type="number"
              min="0"
              placeholder="0"
              hint="Total duty count across the line items."
              icon={<Calculator className="h-4 w-4" />}
              value={formData.taxDuty || ""}
              onChange={handleChange}
            />

            <TextField
              id="totalTaxableAmount"
              name="totalTaxableAmount"
              label="Total Taxable Amount"
              placeholder="0.00"
              hint="Sum of every line item amount."
              icon={<IndianRupee className="h-4 w-4" />}
              value={formData.totalTaxableAmount || ""}
              onChange={handleChange}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TaxSection;
