import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

import InvoiceDownload from "../components/InvoiceStruct";
import { useDataContext } from "../hooks/Context";
import { IGeneralData } from "../types/invoice-types";
import { fadeUp } from "../utils/motion";

const Invoice = () => {
  const { data } = useDataContext();
  const invoiceData = data as IGeneralData | undefined;

  // The preview needs form data, which is lost when the page is opened directly.
  if (!invoiceData?.invoiceFromCompany) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md rounded-card border border-line bg-card p-8 text-center shadow-sm"
        >
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand">
            <FileText className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-semibold text-ink">
            No invoice to preview
          </h1>
          <p className="mt-2 text-sm text-muted">
            Fill in the invoice form and generate it to see the preview here.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-brand-strong focus:outline-none focus-visible:ring-4 focus-visible:ring-brand/30"
          >
            Go to invoice form
          </Link>
        </motion.div>
      </div>
    );
  }

  return <InvoiceDownload invoiceData={invoiceData} />;
};

export default Invoice;
