import { InvoiceFromCompany } from "../types/invoice-types";

const companyLogos: Record<InvoiceFromCompany, string> = {
  "BLUE SKY ENTERPRICESS": "/BSE-logo-no-bg.png",
  "RAJAGOPALAN P.V": "/RAJAGOPALAN P.V.jpg",
};

// Public path of the selected company's logo, encoded for names with spaces.
export const getCompanyLogo = (company?: InvoiceFromCompany): string | undefined => {
  const logo = company ? companyLogos[company] : undefined;
  return logo ? encodeURI(logo) : undefined;
};
