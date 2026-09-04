import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { Calculator, Check, IndianRupee, Percent } from "lucide-react";
import { useInvoiceStore } from "../store/useInvoiceStore";
import { TextField } from "./Field";
import { Button } from "./Button";
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

export const numberToWords = (num: number): string => {
  if (num === 0) return "zero";

  const ones = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const tens = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  function convert(n: number): string {
    if (n < 20) return ones[n];
    if (n < 100)
      return (
        tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "")
      );
    if (n < 1000)
      return (
        ones[Math.floor(n / 100)] +
        " hundred" +
        (n % 100 !== 0 ? " and " + convert(n % 100) : "")
      );
    if (n < 100000)
      return (
        convert(Math.floor(n / 1000)) +
        " thousand" +
        (n % 1000 !== 0 ? " " + convert(n % 1000) : "")
      );
    if (n < 10000000)
      return (
        convert(Math.floor(n / 100000)) +
        " lakh" +
        (n % 100000 !== 0 ? " " + convert(n % 100000) : "")
      );
    return (
      convert(Math.floor(n / 10000000)) +
      " crore" +
      (n % 10000000 !== 0 ? " " + convert(n % 10000000) : "")
    );
  }

  return convert(num);
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

  const handleAutoCalcuate = () => {
    if (!formData || !formData.invoiceDetails) return;

    let { total, duties } = formData.invoiceDetails.reduce(
      (acc, details) => {
        if (details && details.amount && details.duty) {
          let currentDutyAmount = parseFloat(details.amount);
          let currentDuty = parseFloat(details.duty);
          return {
            duties: acc.duties + (isNaN(currentDuty) ? 0 : currentDuty),
            total:
              acc.total + (isNaN(currentDutyAmount) ? 0 : currentDutyAmount),
          };
        }
        return acc;
      },
      { total: 0, duties: 0 }
    );

    const cgstPercentage = 9;
    const sgstPercentage = 9;
    const igstPercentage = 0;

    let cgstAmount = String(((total * cgstPercentage) / 100).toFixed(2));
    let sgstAmount = String(((total * sgstPercentage) / 100).toFixed(2));
    let igstAmount = String(((total * igstPercentage) / 100).toFixed(2));

    let totalTaxableAmount = String(total.toFixed(2));
    let taxDuty = String(duties);

    let totalInvoicePayable =
      parseFloat(totalTaxableAmount) +
      parseFloat(cgstAmount) +
      parseFloat(sgstAmount) +
      parseFloat(igstAmount);

    let totalInvoiceInWords = numberToWords(Math.round(totalInvoicePayable));

    totalInvoiceInWords =
      totalInvoiceInWords.charAt(0).toUpperCase() +
      totalInvoiceInWords.slice(1);

    setFormData({
      totalTaxableAmount,
      taxDuty,
      cgstPercentage: String(cgstPercentage),
      cgstAmount,
      sgstPercentage: String(sgstPercentage),
      sgstAmount,
      igstPercentage: String(igstPercentage),
      igstAmount,
      totalInvoiceInWords,
      totalInvoicePayable: totalInvoicePayable.toFixed(2),
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
