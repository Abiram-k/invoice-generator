import React from "react";
import { GeneralSectionProps } from "../types/invoice-types";

const TotalPayable: React.FC<GeneralSectionProps> = ({
  formData,
  setFormData,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <section>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="totalInvoicePayable"
            className="block mb-1 font-semibold"
          >
            Total Invoice Payable:
          </label>
          <input
            type="number"
            id="totalInvoicePayable"
            name="totalInvoicePayable"
            className="w-full px-3 py-2 border rounded font-bold"
            min="0"
            value={formData.totalInvoicePayable}
            onChange={handleChange}
          />
        </div>
        <div>
          <label
            htmlFor="totalInvoiceInWords"
            className="block mb-1 font-semibold"
          >
            Total Invoice in Words:
          </label>
          <input
            type="text"
            id="totalInvoiceInWords"
            name="totalInvoiceInWords"
            className="w-full px-3 py-2 border rounded"
            value={formData.totalInvoiceInWords}
            onChange={handleChange}
          />
        </div>
      </div>
    </section>
  );
};

export default TotalPayable;
