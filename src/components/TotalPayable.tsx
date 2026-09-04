import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { Check, IndianRupee, Type, WholeWord } from "lucide-react";
import toast from "react-hot-toast";

import { useInvoiceStore } from "../store/useInvoiceStore";
import { TextField } from "./Field";
import { Button } from "./Button";
import { numberToWords } from "../utils/numberToWords";
import { flashRing, iconPop } from "../utils/motion";

const TotalPayable = () => {
  const { formData, setFormData } = useInvoiceStore();
  const flashControls = useAnimationControls();
  const [justConverted, setJustConverted] = useState(false);

  // Clears the converted confirmation state shortly after it is shown.
  useEffect(() => {
    if (!justConverted) return;

    const timer = setTimeout(() => setJustConverted(false), 1800);
    return () => clearTimeout(timer);
  }, [justConverted]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });
  };

  // Writes the payable amount out in words, rounded to the nearest rupee.
  const handleConvertToWords = () => {
    const amount = Number(formData.totalInvoicePayable);

    if (!formData.totalInvoicePayable || Number.isNaN(amount)) {
      toast.error("Enter the total invoice payable first.");
      return;
    }

    if (amount < 0) {
      toast.error("The payable amount cannot be negative.");
      return;
    }

    const words = numberToWords(Math.round(amount));

    setFormData({
      totalInvoiceInWords: words.charAt(0).toUpperCase() + words.slice(1),
    });
    setJustConverted(true);
    flashControls.start(flashRing);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-brand-soft/60 px-4 py-3">
        <p className="text-sm text-ink-soft">
          Convert the payable amount into words, or type them yourself.
        </p>
        <Button
          type="button"
          size="sm"
          onClick={handleConvertToWords}
          icon={
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={justConverted ? "done" : "convert"}
                variants={iconPop}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex"
              >
                {justConverted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <WholeWord className="h-4 w-4" />
                )}
              </motion.span>
            </AnimatePresence>
          }
        >
          {justConverted ? "Converted" : "Convert to words"}
        </Button>
      </div>

      <motion.div
        animate={flashControls}
        className="grid grid-cols-1 gap-5 rounded-xl md:grid-cols-2"
      >
        <TextField
          id="totalInvoicePayable"
          name="totalInvoicePayable"
          label="Total Invoice Payable"
          placeholder="0.00"
          icon={<IndianRupee className="h-4 w-4" />}
          className="font-semibold"
          value={formData.totalInvoicePayable}
          onChange={handleChange}
        />

        <TextField
          id="totalInvoiceInWords"
          name="totalInvoiceInWords"
          label="Total Invoice in Words"
          placeholder="Rupees only"
          icon={<Type className="h-4 w-4" />}
          value={formData.totalInvoiceInWords}
          onChange={handleChange}
        />
      </motion.div>
    </div>
  );
};

export default TotalPayable;
