import React from "react";
import { IndianRupee, Type } from "lucide-react";
import { useInvoiceStore } from "../store/useInvoiceStore";
import { TextField } from "./Field";

const TotalPayable = () => {
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
        id="totalInvoicePayable"
        name="totalInvoicePayable"
        label="Total Invoice Payable"
        placeholder="0.00"
        icon={<IndianRupee className="h-4 w-4" />}
        className="font-semibold"
        value={formData.totalInvoicePayable}
        onChange={handleChange}
      />

      <TextField
        id="totalInvoiceInWords"
        name="totalInvoiceInWords"
        label="Total Invoice in Words"
        placeholder="Rupees only"
        icon={<Type className="h-4 w-4" />}
        hint="Filled automatically by Auto Calculate."
        value={formData.totalInvoiceInWords}
        onChange={handleChange}
      />
    </div>
  );
};

export default TotalPayable;
