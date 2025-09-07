import { RotateCcw } from "lucide-react";
import { useInvoiceStore } from "../store/useInvoiceStore";

const GeneralSection = () => {
  const { formData, setFormData, resetForm } = useInvoiceStore();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });
  };

  return (
    <section className="mb-8">
      {/* Header with title and reset icon */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          General Information
        </h3>
        <button
          type="button"
          onClick={resetForm}
          className="p-2 rounded-full hover:bg-gray-100 transition flex items-center justify-center"
          title="Reset Form"
        >
          <RotateCcw className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Invoice Serial Number */}
        <div>
          <label
            htmlFor="invoiceNumber"
            className="block mb-2 font-medium text-gray-700"
          >
            Invoice Serial Number
          </label>
          <input
            type="text"
            id="invoiceNumber"
            name="invoiceNumber"
            className="w-full px-4 py-2 border border-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            onChange={handleChange}
            value={formData.invoiceNumber}
          />
        </div>

        {/* Invoice Date */}
        <div>
          <label
            htmlFor="invoiceDate"
            className="block mb-2 font-medium text-gray-700"
          >
            Invoice Date
          </label>
          <input
            type="date"
            id="invoiceDate"
            name="invoiceDate"
            className="w-full px-4 py-2 border border-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            onChange={handleChange}
            value={formData.invoiceDate}
          />
        </div>

        {/* Company Address */}
        <div className="col-span-1 md:col-span-2">
          <label
            htmlFor="companyAddress"
            className="block mb-2 font-medium text-gray-700"
          >
            Receiver Company Address
          </label>
          <textarea
            id="companyAddress"
            rows={3}
            name="companyAddress"
            className="w-full px-4 py-2 border border-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
            onChange={handleChange}
            value={formData.companyAddress}
          ></textarea>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block mb-2 font-medium text-gray-700"
          >
            Email (To)
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full px-4 py-2 border border-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            onChange={handleChange}
            value={formData.email}
          />
        </div>

        {/* GSTIN */}
        <div>
          <label
            htmlFor="gstin"
            className="block mb-2 font-medium text-gray-700"
          >
            GSTIN
          </label>
          <input
            type="text"
            id="gstin"
            name="gstin"
            className="w-full px-4 py-2 border border-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            onChange={handleChange}
            value={formData.gstin}
          />
        </div>
      </div>
    </section>
  );
};

export default GeneralSection;
