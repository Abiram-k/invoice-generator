import { useState } from "react";
import GeneralSection from "../components/GeneralSection";
import InvoiceDetails from "../components/InvoiceDetails";
import TaxSection from "../components/TaxSection";
import TotalPayable from "../components/TotalPayable";

import { useDataContext } from "../hooks/Context";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Month } from "../types/month";
import { monthNames } from "../utils/getCurrentMonth";
import { useInvoiceStore } from "../store/useInvoiceStore";
import { FileText } from "lucide-react";

export default function InvoiceForm() {
  const { setData } = useDataContext();

  //   const [formData, setFormData] = useState<IGeneralData>({
  //   // general
  //   invoiceFromCompany: "BLUE SKY ENTERPRICESS",
  //   invoiceNumber: "INV-2025-001",
  //   invoiceDate: "2025-09-07",
  //   invoiceType: true, // Monthly
  //   companyAddress: "123 Business Street, Bangalore, India",
  //   email: "accounts@company.com",
  //   gstin: "29ABCDE1234F2Z5",

  //   // details description
  //   invoiceDetails: [
  //     {
  //       description: "Software Development Services",
  //       duty: "160 hours",
  //       rate: "1000",
  //       amount: "160000",
  //     },
  //     {
  //       description: "UI/UX Design",
  //       duty: "40 hours",
  //       rate: "800",
  //       amount: "32000",
  //     },
  //   ],

  //   // tax section
  //   totalTaxableAmount: "192000",
  //   taxDuty: "18%",
  //   cgstPercentage: "9%",
  //   cgstAmount: "17280",
  //   sgstPercentage: "9%",
  //   sgstAmount: "17280",
  //   igstPercentage: "",
  //   igstAmount: "",

  //   // total payable
  //   totalInvoicePayable: "226560",
  //   totalInvoiceInWords: "Two Lakh Twenty Six Thousand Five Hundred Sixty Only",
  // });

  // const [formData, setFormData] = useState<IGeneralData>({
  //   // general
  //   invoiceFromCompany: "BLUE SKY ENTERPRICESS",
  //   invoiceNumber: "",
  //   invoiceDate: "",
  //   invoiceType: true, // By default monthly wages (true is monthly, false is daily)
  //   companyAddress: "",
  //   email: "",
  //   gstin: "",

  //   // details description
  //   invoiceDetails: Array.from({ length: row }, () => ({
  //     description: "",
  //     duty: "",
  //     rate: "",
  //     amount: "",
  //   })),

  //   // tax section
  //   totalTaxableAmount: "",
  //   taxDuty: "",
  //   cgstPercentage: "",
  //   cgstAmount: "",
  //   sgstPercentage: "",
  //   sgstAmount: "",
  //   igstPercentage: "",
  //   igstAmount: "",

  //   // total payable
  //   totalInvoicePayable: "",
  //   totalInvoiceInWords: "",
  // });
  const [selectedMonth, setSelectedMonth] = useState<Month | null>(null);

  const { setSelectedInvoiceMonth, formData, setFormData } = useInvoiceStore();

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
    setFormData({
      invoiceDetails: [
        ...(formData.invoiceDetails || []),
        {
          description: "",
          duty: "",
          rate: "",
          amount: "",
        },
      ],
    });
  };

  const handleRemoveRow = () => {
    if (
      formData?.invoiceDetails?.length &&
      formData?.invoiceDetails.length > 1
    ) {
      const updatedDetails = formData.invoiceDetails.slice(0, -1);

      setFormData({
        invoiceDetails: updatedDetails,
      });
    }
  };
  const handleSelectChangeInvoiceType = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData({ [name]: value === "Monthly Wage" });
  };

  const handleSelectChangeInvoiceFrom = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData({ [name]: value });
  };

  const handleSelectChangeMonth = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedMonth: Month = event.target.value as Month;
    setSelectedMonth(selectedMonth);
    setSelectedInvoiceMonth(selectedMonth); // to zustand store
  };

  return (
    <>
      <form
        className="mx-4 md:mx-8 lg:mx-12 mt-8 p-6 md:p-8 bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-3xl space-y-8 border border-gray-200 backdrop-blur-sm"
        onSubmit={handleSubmit}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-gradient-to-r from-blue-200 to-purple-200 pb-6 mb-2">
          <div className="mb-4 md:mb-0">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Invoice Generator
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Create professional invoices with ease
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-start sm:items-center gap-3 w-full md:w-auto">
            {/* Company Select */}
            <div className="relative group w-full sm:w-auto">
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                Company
              </label>
              <select
                value={formData.invoiceFromCompany}
                onChange={handleSelectChangeInvoiceFrom}
                className="w-full sm:w-auto p-3 px-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white shadow-sm hover:shadow-md group-hover:border-gray-300"
                name="invoiceFromCompany"
              >
                <option value="BLUE SKY ENTERPRICESS">
                  Blue Sky Enterpricess
                </option>
                <option value="RAJAGOPALAN P.V">Rajagopalan P.V</option>
              </select>
            </div>

            {/* Invoice Type Select */}
            <div className="relative group w-full sm:w-auto">
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                Invoice Type
              </label>
              <select
                value={formData.invoiceType ? "Monthly Wage" : "Daily Wage"}
                onChange={handleSelectChangeInvoiceType}
                className="w-full sm:w-auto p-3 px-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white shadow-sm hover:shadow-md group-hover:border-gray-300"
                name="invoiceType"
              >
                <option value="Daily Wage">Daily Wage</option>
                <option value="Monthly Wage">Monthly Wage</option>
              </select>
            </div>

            {/* Month Select */}
              <div className="relative group w-full sm:w-auto animate-fadeIn">
                <label className="text-xs font-medium text-gray-600 mb-1 block">
                  Month
                </label>
                <select
                  value={selectedMonth || ""}
                  onChange={handleSelectChangeMonth}
                  className="w-full sm:w-auto p-3 px-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white shadow-sm hover:shadow-md group-hover:border-gray-300"
                >
                  <option value="">Select Month</option>
                  {monthNames.map((month: Month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
          </div>
        </div>

        {/* General Section */}
        <div className="group">
          <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                General Information
              </h3>
            </div>
            <GeneralSection />
          </div>
        </div>

        {/* Invoice Details */}
        <div className="group">
          <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-green-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Invoice Details
              </h3>
            </div>

            <InvoiceDetails />

            <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-green-200">
              <button
                type="button"
                onClick={handleAddRow}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Row
              </button>

              {formData.invoiceDetails?.length &&
                formData.invoiceDetails?.length > 1 && (
                  <button
                    type="button"
                    onClick={handleRemoveRow}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4"
                      />
                    </svg>
                    Delete Row
                  </button>
                )}
            </div>
          </div>
        </div>

        {/* Tax Section */}
        <div className="group">
          <div className="p-8 bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl border-2 border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-purple-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Tax Information
              </h3>
            </div>
            <TaxSection />
          </div>
        </div>

        {/* Total Payable */}
        <div className="group">
          <div className="p-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-amber-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                <span className="text-white text-sm font-bold">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Total Amount
              </h3>
            </div>
            <TotalPayable />
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-lg"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            <FileText className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            Generate Invoice
            <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </div>
          </button>
        </div>
      </form>

      <style>{`
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }
`}</style>
    </>
  );
}
