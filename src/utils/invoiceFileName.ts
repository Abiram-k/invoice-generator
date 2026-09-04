import { InvoiceFromCompany } from "../types/invoice-types";
import { Month } from "../types/month";
import { monthNames } from "./getCurrentMonth";

const companyShortNames: Record<InvoiceFromCompany, string> = {
  "BLUE SKY ENTERPRICESS": "Bluesky",
  "RAJAGOPALAN P.V": "Rajagopalan",
};

const sanitize = (value: string): string => value.replace(/[^a-zA-Z0-9]/g, "");

// A billing month later than the current one belongs to the previous year.
const getMonthYear = (month: Month): number => {
  const today = new Date();
  const monthIndex = monthNames.indexOf(month);

  return monthIndex > today.getMonth()
    ? today.getFullYear() - 1
    : today.getFullYear();
};

// Builds the default PDF name, e.g. Bini_Aug_2026_Bluesky_invoice.
export const buildInvoiceFileName = (
  company: InvoiceFromCompany,
  receiverName?: string,
  month?: Month | null
): string =>
  [
    receiverName ? sanitize(receiverName) : "",
    month ? `${month.slice(0, 3)}_${getMonthYear(month)}` : "",
    companyShortNames[company] ?? sanitize(company ?? ""),
    "invoice",
  ]
    .filter(Boolean)
    .join("_");
