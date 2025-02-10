// General Info Types
export interface IGeneralData {
  invoiceNumber?: string;
  invoiceDate?: string;
  companyAddress?: string;
  email?: string;
  gstin?: string;
  invoiceDetails?: {
    description?: string;
    duty?: string;
    rate?: string;
    amount?: string;
  }[];
  totalTaxableAmount?: string;
  taxDuty?: string;
  cgstPercentage?: string;
  cgstAmount?: string;
  sgstPercentage?: string;
  sgstAmount?: string;
  igstPercentage?: string;
  igstAmount?: string;
  totalInvoicePayable?: string;
  totalInvoiceInWords?: string;
}

// component type
export interface GeneralSectionProps {
  formData: IGeneralData;
  setFormData: React.Dispatch<React.SetStateAction<IGeneralData>>;
  handleSetRow?: React.Dispatch<React.SetStateAction<number>>;
  row?:number
}

