import React from "react";
import { GeneralSectionProps } from "../types/invoice-types";

const TaxSection: React.FC<GeneralSectionProps> = ({
  formData,
  setFormData,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  function numberToWords(num: number): string {
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
  }

  const handleAutoCalcuate = () => {
    console.log(formData, "Form DAta");

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
    setFormData((prev) => ({
      ...prev,
      totalTaxableAmount,
      taxDuty,
      cgstPercentage: String(cgstPercentage),
      cgstAmount,
      sgstPercentage: String(sgstPercentage),
      sgstAmount,
      igstPercentage: String(igstPercentage),
      igstAmount,
      totalInvoiceInWords,
      totalInvoicePayable: String(totalInvoicePayable.toFixed(2)),
    }));
  };

  return (
    <section className="mb-8">
      <div className="flex justify-between align-middle w-full ">
        <h3 className="text-xl font-semibold mb-4">Tax Information</h3>
        <button
          name="Auto Calculate"
          onClick={handleAutoCalcuate}
          className="mt-6 px-4 py-2 cursor-pointer bg-green-500 text-white rounded hover:bg-green-600"
          type="button"
        >
          Auto Calculate
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="taxDuty" className="block mb-1">
            Tax Duty:
          </label>
          <input
            type="number"
            id="taxDuty"
            name="taxDuty"
            className="w-full px-3 py-2 border rounded"
            min="0"
            value={formData.taxDuty || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="totalTaxableAmount" className="block mb-1">
            Total Taxable Amount:
          </label>
          <input
            type="text"
            id="totalTaxableAmount"
            name="totalTaxableAmount"
            className="w-full px-3 py-2 border rounded"
            min="0"
            value={formData.totalTaxableAmount || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="cgstPercentage" className="block mb-1">
            CGST (%):
          </label>
          <input
            type="number"
            id="cgstPercentage"
            name="cgstPercentage"
            className="w-full px-3 py-2 border rounded"
            min="0"
            value={formData.cgstPercentage || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="cgstAmount" className="block mb-1">
            CGST:
          </label>
          <input
            type="text"
            id="cgstAmount"
            name="cgstAmount"
            className="w-full px-3 py-2 border rounded"
            min="0"
            value={formData.cgstAmount || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="sgstPercentage" className="block mb-1">
            SGST (%):
          </label>
          <input
            type="number"
            id="sgstPercentage"
            name="sgstPercentage"
            className="w-full px-3 py-2 border rounded"
            min="0"
            value={formData.sgstPercentage || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="sgstAmount" className="block mb-1">
            SGST:
          </label>
          <input
            type="text"
            id="sgstAmount"
            name="sgstAmount"
            className="w-full px-3 py-2 border rounded"
            min="0"
            value={formData.sgstAmount || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="igstPercentage" className="block mb-1">
            IGST (%):
          </label>
          <input
            type="number"
            id="igstPercentage"
            name="igstPercentage"
            className="w-full px-3 py-2 border rounded"
            min="0"
            value={formData.igstPercentage || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="igstAmount" className="block mb-1">
            IGST:
          </label>
          <input
            type="number"
            id="igstAmount"
            name="igstAmount"
            className="w-full px-3 py-2 border rounded"
            min="0"
            value={formData.igstAmount || ""}
            onChange={handleChange}
          />
        </div>
      </div>
    </section>
  );
};

export default TaxSection;
