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
    invoiceType: true,
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
      toast.error("Add at least one duty!");
      errors.push("invoiceDetails");
      return false;
    } else {
      let isValid = formData.invoiceDetails.every((details) => {
        const isAnyFieldFilled =
          (details.amount !== undefined && details.amount !== "") ||
          (details.duty !== undefined && details.duty !== "") ||
          (details.description !== undefined && details.description !== "") ||
          (details.rate !== undefined && details.rate !== "");

        return (
          !isAnyFieldFilled ||
          (details.amount &&
            details.duty &&
            details.description &&
            details.rate) // Otherwise, all must be filled
        );
      });

      if (!isValid) {
        toast.error("Please fill all required fields in invoice details.");
        errors.push("invoiceDetails");
        return false;
      }
    }

    if (!formData.invoiceNumber) {
      toast.error("Add Invoice Number!");
      errors.push("invoiceNumber");
      return false;
    }

    if (!formData.invoiceDate) {
      toast.error("Add Invoice Date!");
      errors.push("invoiceDate");
      return false;
    }

    if (!formData.companyAddress) {
      toast.error("Add Receiver's Company Address!");
      errors.push("companyAddress");
      return false;
    }

    if (!formData.totalInvoiceInWords || !formData.totalInvoicePayable) {
      toast.error("Add total amount and its word representation!");
      errors.push("totalInvoice");
      return false;
    }

    if (!formData.cgstAmount) {
      toast.error("CGST Amount is required!");
      errors.push("Tax Error");
      return false;
    }

    if (!formData.cgstPercentage) {
      toast.error("CGST Percentage is required!");
      errors.push("Tax Error");

      return false;
    }

    if (!formData.sgstAmount) {
      toast.error("SGST Amount is required!");
      errors.push("Tax Error");

      return false;
    }

    if (!formData.sgstPercentage) {
      toast.error("SGST Percentage is required!");
      errors.push("Tax Error");

      return false;
    }

    if (!formData.igstAmount) {
      toast.error("IGST Amount is required!");
      errors.push("Tax Error");

      return false;
    }

    if (!formData.igstPercentage) {
      toast.error("IGST Percentage is required!");
      errors.push("Tax Error");

      return false;
    }

    if (!formData.totalTaxableAmount) {
      toast.error("Total Taxable Amount is required!");
      errors.push("Tax Error");

      return false;
    }

    if (!formData.taxDuty) {
      toast.error("Tax Duty is required!");
      errors.push("Tax Error");

      return false;
    }

    return errors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (setData) setData(formData);
    navigate("/pdf-preview");
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
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      invoiceType: event.target.value === "Monthly Wage",
    }));
  };

  return (
    <>
      <form
        className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Invoice Form</h2>

          <select
            value={formData.invoiceType ? "Monthly Wage" : "Daily Wage"}
            onChange={handleSelectChange}
            className="p-2 border border-gray-300 rounded-md focus:outline-none "
          >
            <option value="Daily Wage">Daily Wage</option>
            <option value="Monthly Wage">Monthly Wage</option>
          </select>
        </div>

        <GeneralSection formData={formData} setFormData={setFormData} />
        <InvoiceDetails formData={formData} setFormData={setFormData} />
        <button
          className=" p-1 rounded me-2 px-5 text-white bg-green-600 mb-5"
          type="button"
          onClick={handleAddRow}
        >
          Add Row
        </button>
        {formData.invoiceDetails?.length &&
          formData.invoiceDetails?.length > 1 && (
            <button
              className=" p-1 rounded mb-5 px-5 bg-red-600 text-white "
              type="button"
              onClick={handleRemoveRow}
            >
              Delete Row
            </button>
          )}

        <TaxSection formData={formData} setFormData={setFormData} />
        <TotalPayable formData={formData} setFormData={setFormData} />

        <Button name="Generate Invoice" />
      </form>
    </>
  );
}
