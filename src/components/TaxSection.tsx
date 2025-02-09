import React from "react";
import { GeneralSectionProps } from "../types/invoice-types";

const TaxSection: React.FC<GeneralSectionProps> = ({ formData, setFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, 
    }));
  };

  return (
    <section className="mb-8">
      <h3 className="text-xl font-semibold mb-4">Tax Information</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="totalTaxableAmount" className="block mb-1">
            Total Taxable Amount:
          </label>
          <input
            type="number"
            id="totalTaxableAmount"
            name="totalTaxableAmount"
            className="w-full px-3 py-2 border rounded"
            min="0"
            value={formData.totalTaxableAmount || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="taxDuty" className="block mb-1">
            Tax Duty:
          </label>
          <input
            type="number"
            id="taxDuty"
            name="taxDuty"
            className="w-full px-3 py-2 border rounded"
            min="0"
            value={formData.taxDuty || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="cgstPercentage" className="block mb-1">
            CGST (%):
          </label>
          <input
            type="number"
            id="cgstPercentage"
            name="cgstPercentage"
            className="w-full px-3 py-2 border rounded"
            min="0"
            value={formData.cgstPercentage || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="cgstAmount" className="block mb-1">
            CGST:
          </label>
          <input
            type="number"
            id="cgstAmount"
            name="cgstAmount"
            className="w-full px-3 py-2 border rounded"
            min="0"
            value={formData.cgstAmount || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="sgstPercentage" className="block mb-1">
            SGST (%):
          </label>
          <input
            type="number"
            id="sgstPercentage"
            name="sgstPercentage"
            className="w-full px-3 py-2 border rounded"
            min="0"
            value={formData.sgstPercentage || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="sgstAmount" className="block mb-1">
            SGST:
          </label>
          <input
            type="number"
            id="sgstAmount"
            name="sgstAmount"
            className="w-full px-3 py-2 border rounded"
            min="0"
            value={formData.sgstAmount || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="igstPercentage" className="block mb-1">
            IGST (%):
          </label>
          <input
            type="number"
            id="igstPercentage"
            name="igstPercentage"
            className="w-full px-3 py-2 border rounded"
            min="0"
            value={formData.igstPercentage || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="igstAmount" className="block mb-1">
            IGST:
          </label>
          <input
            type="number"
            id="igstAmount"
            name="igstAmount"
            className="w-full px-3 py-2 border rounded"
            min="0"
            value={formData.igstAmount || ""}
            onChange={handleChange}
          />
        </div>
      </div>
    </section>
  );
};

export default TaxSection;
