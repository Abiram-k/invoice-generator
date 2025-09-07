import React from "react";
import { useInvoiceStore } from "../store/useInvoiceStore";

const TotalPayable = () => {
  const { formData, setFormData } = useInvoiceStore();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });
  };

  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Invoice Payable */}
        <div>
          <label
            htmlFor="totalInvoicePayable"
            className="block mb-2 font-semibold text-gray-700"
          >
            Total Invoice Payable:
          </label>
          <input
            type="text"
            id="totalInvoicePayable"
            name="totalInvoicePayable"
            className="w-full px-4 py-2 border border-gray-500 rounded-lg font-bold bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            min="0"
            value={formData.totalInvoicePayable}
            onChange={handleChange}
          />
        </div>

        {/* Total Invoice in Words */}
        <div>
          <label
            htmlFor="totalInvoiceInWords"
            className="block mb-2 font-semibold text-gray-700"
          >
            Total Invoice in Words:
          </label>
          <input
            type="text"
            id="totalInvoiceInWords"
            name="totalInvoiceInWords"
            className="w-full px-4 py-2 border border-gray-500 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={formData.totalInvoiceInWords}
            onChange={handleChange}
          />
        </div>
      </div>
    </section>
  );
};

export default TotalPayable;
