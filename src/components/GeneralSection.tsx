import { GeneralSectionProps } from "../types/invoice-types";

const GeneralSection: React.FC<GeneralSectionProps> = ({
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
    <section className="mb-8">
      <h3 className="text-xl font-semibold mb-4">General Information</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="invoiceNumber" className="block mb-1">
            Invoice Serial Number:
          </label>
          <input
            type="text"
            name="invoiceNumber"
            className="w-full px-3 py-2 border rounded"
            onChange={handleChange}
            value={formData.invoiceNumber}
          />
        </div>
        <div>
          <label htmlFor="invoiceDate" className="block mb-1">
            Invoice Date:
          </label>
          <input
            type="date"
            id="invoiceDate"
            name="invoiceDate"
            className="w-full px-3 py-2 border rounded"
            onChange={handleChange}
            value={formData.invoiceDate}
          />
        </div>
        <div className="col-span-2">
          <label htmlFor="companyAddress" className="block mb-1">
            Company Address:
          </label>
          <textarea
            id="companyAddress"
            rows={3}
            name="companyAddress"
            className="w-full px-3 py-2 border rounded"
            onChange={handleChange}
            value={formData.companyAddress}
          ></textarea>
        </div>
        <div>
          <label htmlFor="email" className="block mb-1">
            Email (to):
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full px-3 py-2 border rounded"
            onChange={handleChange}
            value={formData.email}
          />
        </div>
        <div>
          <label htmlFor="gstin" className="block mb-1">
            GSTIN:
          </label>
          <input
            type="text"
            id="gstin"
            name="gstin"
            className="w-full px-3 py-2 border rounded"
            onChange={handleChange}
            value={formData.gstin}
          />
        </div>
      </div>
    </section>
  );
};

export default GeneralSection;
