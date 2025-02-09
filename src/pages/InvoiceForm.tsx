import { useState } from "react";
import GeneralSection from "../components/GeneralSection";
import InvoiceDetails from "../components/InvoiceDetails";
import TaxSection from "../components/TaxSection";
import TotalPayable from "../components/TotalPayable";
import { IGeneralData } from "../types/invoice-types";
import { Button } from "../components/Button";

import { useDataContext } from "../hooks/Context";

export default function InvoiceForm() {
  const { setData } = useDataContext();
  const [formData, setFormData] = useState<IGeneralData>({
    // general
    invoiceNumber: "",
    invoiceDate: "",
    companyAddress: "",
    email: "",
    gstin: "",

    // details description
    invoiceDetails: [
      {
        description: "",
        duty: "",
        rate: "",
        amount: "",
      },
    ],

    // tax section
    totalTaxableAmount: "",
    taxDuty: "",
    cgstPercentage: "",
    cgstAmount: "",
    sgstPercentage: "",
    sgstAmount: "",
    igstPercentage: "",
    igstAmount: "",

    // total payable
    totalInvoicePayable: "",
    totalInvoiceInWords: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (setData) setData(formData);
    console.log(formData);
  };

  return (
    <>
      <form
        className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6">Invoice Form</h2>

        <GeneralSection formData={formData} setFormData={setFormData} />
        <InvoiceDetails formData={formData} setFormData={setFormData} />
        <TaxSection formData={formData} setFormData={setFormData} />
        <TotalPayable formData={formData} setFormData={setFormData} />

        <Button />
      </form>
    </>
  );
}
