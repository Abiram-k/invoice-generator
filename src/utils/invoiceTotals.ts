import { IGeneralData } from "../types/invoice-types";
import { numberToWords } from "./numberToWords";

export type InvoiceTotals = Pick<
  IGeneralData,
  | "taxDuty"
  | "totalTaxableAmount"
  | "cgstAmount"
  | "sgstAmount"
  | "igstAmount"
  | "totalInvoicePayable"
  | "totalInvoiceInWords"
>;

const emptyTotals: InvoiceTotals = {
  taxDuty: "",
  totalTaxableAmount: "",
  cgstAmount: "",
  sgstAmount: "",
  igstAmount: "",
  totalInvoicePayable: "",
  totalInvoiceInWords: "",
};

const toNumber = (value?: string): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

// Uses the percentage when one is set, otherwise keeps whatever amount was typed in.
const resolveTaxAmount = (
  taxableAmount: number,
  percentage?: string,
  amount?: string
): number =>
  percentage?.trim()
    ? (taxableAmount * toNumber(percentage)) / 100
    : toNumber(amount);

// Recalculates duty count, taxable amount, tax amounts and the payable totals from the line items.
export const calculateInvoiceTotals = (formData: IGeneralData): InvoiceTotals => {
  const { duties, taxableAmount } = (formData.invoiceDetails ?? []).reduce(
    (acc, detail) => ({
      duties: acc.duties + toNumber(detail.duty),
      taxableAmount: acc.taxableAmount + toNumber(detail.amount),
    }),
    { duties: 0, taxableAmount: 0 }
  );

  if (!duties && !taxableAmount) return emptyTotals;

  const cgstAmount = resolveTaxAmount(
    taxableAmount,
    formData.cgstPercentage,
    formData.cgstAmount
  );
  const sgstAmount = resolveTaxAmount(
    taxableAmount,
    formData.sgstPercentage,
    formData.sgstAmount
  );
  const igstAmount = resolveTaxAmount(
    taxableAmount,
    formData.igstPercentage,
    formData.igstAmount
  );

  const totalInvoicePayable = taxableAmount + cgstAmount + sgstAmount + igstAmount;
  const words = numberToWords(Math.round(totalInvoicePayable));

  return {
    taxDuty: String(duties),
    totalTaxableAmount: taxableAmount.toFixed(2),
    cgstAmount: cgstAmount.toFixed(2),
    sgstAmount: sgstAmount.toFixed(2),
    igstAmount: igstAmount.toFixed(2),
    totalInvoicePayable: totalInvoicePayable.toFixed(2),
    totalInvoiceInWords: words.charAt(0).toUpperCase() + words.slice(1),
  };
};
