import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Month } from "../types/month";
import { getCurrentMonth } from "../utils/getCurrentMonth";
import { IGeneralData } from "../types/invoice-types";

type InvoiceStore = {
  selectedInvoiceMonth: Month | null;
  setSelectedInvoiceMonth: (month: Month) => void;
  formData: IGeneralData;
  setFormData: (data: Partial<IGeneralData>) => void;
  resetForm: () => void;
};

export const useInvoiceStore = create<InvoiceStore>()(
  persist(
    (set) => ({
      selectedInvoiceMonth: getCurrentMonth(),
      setSelectedInvoiceMonth: (selectedInvoiceMonth: Month) =>
        set({ selectedInvoiceMonth }),
      formData: {
        invoiceFromCompany: "BLUE SKY ENTERPRICESS",
        invoiceNumber: "",
        invoiceDate: "",
        invoiceType: true,
        companyAddress: "",
        email: "",
        gstin: "",
        invoiceDetails: Array.from({ length: 1 }, () => ({
          description: "",
          duty: "",
          rate: "",
          amount: "",
        })),
        totalTaxableAmount: "",
        taxDuty: "",
        cgstPercentage: "",
        cgstAmount: "",
        sgstPercentage: "",
        sgstAmount: "",
        igstPercentage: "",
        igstAmount: "",
        totalInvoicePayable: "",
        totalInvoiceInWords: "",
      },
      setFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
      resetForm: () =>
        set(() => ({
          formData: {
            invoiceFromCompany: "BLUE SKY ENTERPRICESS",
            invoiceNumber: "",
            invoiceDate: "",
            invoiceType: true,
            companyAddress: "",
            email: "",
            gstin: "",
            invoiceDetails: Array.from({ length: 1 }, () => ({
              description: "",
              duty: "",
              rate: "",
              amount: "",
            })),
            totalTaxableAmount: "",
            taxDuty: "",
            cgstPercentage: "",
            cgstAmount: "",
            sgstPercentage: "",
            sgstAmount: "",
            igstPercentage: "",
            igstAmount: "",
            totalInvoicePayable: "",
            totalInvoiceInWords: "",
          },
        })),
    }),
    {
      name: "invoice-storage",
    }
  )
);
