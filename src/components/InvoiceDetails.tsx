import { useInvoiceStore } from "../store/useInvoiceStore";

const InvoiceDetails = () => {
  const { formData, setFormData } = useInvoiceStore();

  const handleInvoiceDetailChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updatedDetails = formData.invoiceDetails?.map((detail, i) => {
      if (i === index) {
        const updatedDetail = { ...detail, [field]: value };

        // Auto-calculate amount if qty & rate are available
        const qty = Number(updatedDetail.duty) || 0;
        const rate = Number(updatedDetail.rate) || 0;

        updatedDetail.amount = String(qty * rate);

        return updatedDetail;
      }
      return detail;
    });


    setFormData({
      ...formData,
      invoiceDetails: updatedDetails,
      totalTaxableAmount: "",
      taxDuty: "",
      cgstPercentage: "",
      cgstAmount: "",
      sgstPercentage: "",
      sgstAmount: "",
      igstPercentage: "",
      igstAmount: "",
      totalInvoiceInWords: "",
      totalInvoicePayable: "",
    });
  };

  return (
    <section className="mb-12">
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">
        Invoice Details
      </h3>

      <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
        <table className="w-full border-collapse min-w-[600px]">
          <thead className="bg-gray-100">
            <tr>
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
              <tr key={index} className="hover:bg-gray-50 transition">
                <td className="border border-gray-300 p-2 text-center">
                  {index + 1}
                </td>

                <td className="border border-gray-300 p-2">
                  <textarea
                    className="w-full p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[50px] resize-y transition"
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
                    type="number"
                    className="w-full p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[50px] transition"
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
                    className="w-full p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[50px] transition"
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
                    className="w-full p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[50px] transition"
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
