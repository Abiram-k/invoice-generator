import InvoiceDownload from "../components/InvoiceStruct";

import { useDataContext } from "../hooks/Context";
const data = {
  // general
  invoiceNumber: "1001",
  invoiceDate: "09-02-2024",
  companyAddress: `SELEX MALL, Thrissur-Palghat Rd
  East Fort, Pallikkulam, Thrissur, Kerala, 680005`,

  email: "abi@gmail.com",
  gstin: "3248023490DFDSF",

  // details description
  invoiceDetails: [
    {
      description: "Security ",
      duty: "50",
      rate: "1003",
      amount: "105",
    },
    {
      description: "House keeping ",
      duty: "123",
      rate: "2003",
      amount: "224",
    },
    {
      description: "Product 3",
      duty: "18%",
      rate: "150",
      amount: "177",
    },
    // {
    //   description: "Service Fee",
    //   duty: "18%",
    //   rate: "50",
    //   amount: "59",
    // },
    // {
    //   description: "Product 4",
    //   duty: "28%",
    //   rate: "300",
    //   amount: "384",
    // },
  ],

  // tax section
  totalTaxableAmount: "750",
  taxDuty: "25%",
  cgstPercentage: "12%",
  cgstAmount: "90",
  sgstPercentage: "12%",
  sgstAmount: "90",
  igstPercentage: "0%",
  igstAmount: "0",

  // total payable
  totalInvoicePayable: "1024",
  totalInvoiceInWords: "One Thousand and Twenty Four Rupees Only",
};
const Invoice = () => {
  // const { data } = useDataContext();
 
  return (
    <div>
      <InvoiceDownload invoiceData={data} />
    </div>
  );
};
export default Invoice;
