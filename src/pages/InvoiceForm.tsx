import { useState } from "react";
import GeneralSection from "../components/GeneralSection";
import InvoiceDetails from "../components/InvoiceDetails";
import TaxSection from "../components/TaxSection";
import TotalPayable from "../components/TotalPayable";
import { IGeneralData } from "../types/invoice-types";
import { Button } from "../components/Button";

import { useDataContext } from "../hooks/Context";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function InvoiceForm() {
  const { setData } = useDataContext();
  const [row, setRow] = useState(1);
  const [formData, setFormData] = useState<IGeneralData>({
    // general
    invoiceNumber: "",
    invoiceDate: "",
    companyAddress: "",
    email: "",
    gstin: "",

    // details description
    invoiceDetails: Array.from({ length: row }, () => ({
      description: "",
      duty: "",
      rate: "",
      amount: "",
    })),

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
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = [];
    if (!formData.invoiceDetails?.length) {
      toast.error("Add duties (requried 1) !");
      errors.push("details");
    } else if (!formData.invoiceNumber) {
      toast.error("Add Invoice number!");
      errors.push("invoiceNumber");
    } else if (!formData.invoiceDate) {
      toast.error("Add Invoice Date!");
      errors.push("invoiceDate");
    } else if (!formData.companyAddress) {
      toast.error("Add Reciever Company address!");
      errors.push("invoiceName");
    } else if (!formData.totalInvoiceInWords || !formData.totalInvoicePayable) {
      toast.error("Add total Amount and in words");
      errors.push("invoiceName");
    }
    return errors.length == 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (setData) setData(formData);
    navigate("/pdf-preview");
    // console.log(formData);
  };

  const handleAddRow = () => {
    setFormData((prev) => ({
      ...prev,
      invoiceDetails: [
        ...(prev.invoiceDetails || []),
        {
          description: "",
          duty: "",
          rate: "",
          amount: "",
        },
      ],
    }));
    setRow((prev) => prev + 1);
  };

  const handleRemoveRow = () => {
    if (
      formData?.invoiceDetails?.length &&
      formData?.invoiceDetails.length > 1
    ) {
      setFormData((prev) => ({
        ...prev,
        invoiceDetails: prev.invoiceDetails?.slice(0, -1),
      }));
      setRow((prev) => prev - 1);
    }
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
        <button
          className=" p-1 rounded me-2 px-5 text-white bg-green-600 mb-5"
          type="button"
          onClick={handleAddRow}
        >
          Add Row
        </button>
        {formData.invoiceDetails?.length&&formData.invoiceDetails?.length>1 &&
        <button
        className=" p-1 rounded mb-5 px-5 bg-red-600 text-white "
        type="button"
        onClick={handleRemoveRow}
        >
          Delete Row
        </button>
        }

        <TaxSection formData={formData} setFormData={setFormData} />
        <TotalPayable formData={formData} setFormData={setFormData} />

        <Button />
      </form>
    </>
  );
}
