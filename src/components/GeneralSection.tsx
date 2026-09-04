import { AtSign, BadgeIndianRupee, CalendarDays, Hash } from "lucide-react";
import { useInvoiceStore } from "../store/useInvoiceStore";
import { TextField, TextareaField } from "./Field";

const iconClasses = "h-4 w-4";

const GeneralSection = () => {
  const { formData, setFormData } = useInvoiceStore();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });
  };

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <TextField
        id="invoiceNumber"
        name="invoiceNumber"
        label="Invoice Serial Number"
        placeholder="INV-001"
        icon={<Hash className={iconClasses} />}
        value={formData.invoiceNumber}
        onChange={handleChange}
      />

      <TextField
        id="invoiceDate"
        name="invoiceDate"
        type="date"
        label="Invoice Date"
        icon={<CalendarDays className={iconClasses} />}
        value={formData.invoiceDate}
        onChange={handleChange}
      />

      <TextareaField
        id="companyAddress"
        name="companyAddress"
        label="Receiver Company Address"
        rows={3}
        placeholder="Street, city, state, postal code"
        wrapperClassName="md:col-span-2"
        value={formData.companyAddress}
        onChange={handleChange}
      />

      <TextField
        id="email"
        name="email"
        type="email"
        label="Email (To)"
        placeholder="accounts@company.com"
        icon={<AtSign className={iconClasses} />}
        value={formData.email}
        onChange={handleChange}
      />

      <TextField
        id="gstin"
        name="gstin"
        label="GSTIN"
        placeholder="29ABCDE1234F2Z5"
        icon={<BadgeIndianRupee className={iconClasses} />}
        value={formData.gstin}
        onChange={handleChange}
      />
    </div>
  );
};

export default GeneralSection;
