import React from "react";
import { GeneralSectionProps } from "../types/invoice-types";

const InvoiceDetails: React.FC<GeneralSectionProps> = ({
  formData,
  setFormData,
}) => {
  const handleInvoiceDetailChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updatedDetails = formData.invoiceDetails?.map((detail, i) => {
      return i === index ? { ...detail, [field]: value } : detail;
    });
    setFormData({
      ...formData,
      invoiceDetails: updatedDetails,
    });
  };

  return (
    <section className="mb-12">
      <h3 className="text-2xl font-semibold mb-6">Invoice Details</h3>
     
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-3 text-left w-1/12">
                Sr. No.
              </th>
              <th className="border border-gray-300 p-3 text-left w-5/12">
                Description
              </th>
              <th className="border border-gray-300 p-3 text-left w-2/12">
                Duty
              </th>
              <th className="border border-gray-300 p-3 text-left w-2/12">
                Rate
              </th>
              <th className="border border-gray-300 p-3 text-left w-2/12">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {formData.invoiceDetails?.map((detail, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2 text-center">
                  {index + 1}
                </td>
                <td className="border border-gray-300 p-2">
                  <textarea
                    className="w-full p-2 focus:outline-none min-h-[50px] resize-y"
                    placeholder="Enter here..."
                    rows={2}
                    value={detail.description || ""}
                    onChange={(e) =>
                      handleInvoiceDetailChange(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                  ></textarea>
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    className="w-full p-2 focus:outline-none min-h-[50px]"
                    placeholder="Enter here..."
                    value={detail.duty || ""}
                    onChange={(e) =>
                      handleInvoiceDetailChange(index, "duty", e.target.value)
                    }
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="number"
                    className="w-full p-2 focus:outline-none min-h-[50px]"
                    placeholder="Enter here..."
                    value={detail.rate || ""}
                    onChange={(e) =>
                      handleInvoiceDetailChange(index, "rate", e.target.value)
                    }
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="number"
                    className="w-full p-2 focus:outline-none min-h-[50px]"
                    placeholder="Enter here..."
                    value={detail.amount || ""}
                    onChange={(e) =>
                      handleInvoiceDetailChange(index, "amount", e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default InvoiceDetails;
