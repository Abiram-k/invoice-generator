import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { Calculator, Check, IndianRupee, Percent } from "lucide-react";
import { useInvoiceStore } from "../store/useInvoiceStore";
import { TextField } from "./Field";
import { Button } from "./Button";
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
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-brand-soft/60 px-4 py-3">
        <p className="text-sm text-ink-soft">
          Fill the values manually, or calculate CGST and SGST at 9% from the line items.
        </p>
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
          {justCalculated ? "Calculated" : "Auto Calculate"}
        </Button>
      </div>

      <motion.div animate={flashControls} className="space-y-5 rounded-xl">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <TextField
            id="taxDuty"
            name="taxDuty"
            label="Tax Duty"
            type="number"
            min="0"
            placeholder="0"
            icon={<Calculator className="h-4 w-4" />}
            value={formData.taxDuty || ""}
            onChange={handleChange}
          />

          <TextField
            id="totalTaxableAmount"
            name="totalTaxableAmount"
            label="Total Taxable Amount"
            placeholder="0.00"
            icon={<IndianRupee className="h-4 w-4" />}
            value={formData.totalTaxableAmount || ""}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {taxPairs.map(({ key, title, percentageName, amountName }) => (
            <motion.div
              key={key}
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="rounded-xl border border-line bg-surface/60 p-4"
            >
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand">
                  <Percent className="h-3.5 w-3.5" />
                </span>
                {title}
              </h3>
              <div className="space-y-3">
                <TextField
                  id={percentageName}
                  name={percentageName}
                  label="Percentage (%)"
                  type="number"
                  min="0"
                  placeholder="0"
                  icon={<Percent className="h-4 w-4" />}
                  value={formData[percentageName] || ""}
                  onChange={handleChange}
                />
                <TextField
                  id={amountName}
                  name={amountName}
                  label="Amount"
                  placeholder="0.00"
                  icon={<IndianRupee className="h-4 w-4" />}
                  value={formData[amountName] || ""}
                  onChange={handleChange}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default TaxSection;
