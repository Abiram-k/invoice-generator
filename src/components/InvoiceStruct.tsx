import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  pdf,
  Image,
} from "@react-pdf/renderer";
import React, { useMemo, useRef } from "react";

import { IGeneralData } from "../types/invoice-types";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import { useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ArrowLeft, Download, FileText, Loader2 } from "lucide-react";
import { Button } from "./Button";
import { TextField } from "./Field";
import ThemeToggle from "./ThemeToggle";
import { fadeUp } from "../utils/motion";
import { getCurrentMonth } from "../utils/getCurrentMonth";
import { useInvoiceStore } from "../store/useInvoiceStore";
import { useReceiverStore } from "../store/useReceiverStore";
import { findReceiverByValues } from "../utils/receiver";
import { buildInvoiceFileName } from "../utils/invoiceFileName";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    //  border: 1
  },
  titleSection: {
    border: 1,
  },
  title: {
    textTransform: "uppercase",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "extrabold",
    marginVertical: 10,
    borderBottom: 1,
    paddingVertical: 7,
  },
  companyName: {
    marginBottom: 2,
    textTransform: "uppercase",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "extrabold",
  },
  companyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
    marginTop: 0,
    marginBottom: 2,
  },
  companyLogo: {
    width: 55,
    height: 55,
    borderRadius: 27.5
  },
  companyAddress: {
    textAlign: "center",
    // marginLeft: 270,
    lineHeight: 1.2,
    fontSize: 12,
  },
  generalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    border: 1,
    borderTop: "none",
    borderBottom: "none",
  },
  leftSection: {
    padding: 10,
    width: "64.5%",
    paddingBottom: 4,
  },
  rightSection: {
    padding: 10,
    paddingBottom: 4,

    width: "48%",
    borderLeft: 1,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  smallTitle: {
    fontSize: 12,
    marginBottom: 5,
    fontWeight: "extrabold",
    paddingLeft: 0,
  },

  // To details section
  ToDetailsSection: {
    border: 1,
    display: "flex",
    flexDirection: "row",
    // marginBottom: 10,
  },

  ToDetailsSectionRight: {
    fontSize: 8,
    width: "48%",
    borderLeft: 1,
    paddingTop: 4,
    paddingBottom: 2,
    fontWeight: "bold",
  },
  ToDetailsSectionLeft: {
    fontWeight: "bold",
    width: "64.5%",

    paddingTop: 4,
    paddingBottom: 0,
    fontSize: 8,
  },

  // calculation Table
  calculationTable: {
    borderWidth: 1,
    borderTop: 0,
    borderTopColor: "#e0e0e0",
    borderColor: "black",
    // marginVertical: 10,
  },
  amountTitleSection: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
  },
  tableHeader: {
    padding: 4,
    fontSize: 13,
    fontWeight: "extrabold",
    borderRightWidth: 1,
    borderBottom: 1,
    borderColor: "black",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#2B2B2B",
    display: "flex",
    textAlign: "center",
    justifyContent: "center",
  },
  cell: {
    padding: 4,
    fontSize: 12,
    fontWeight: "normal",
    borderRightWidth: 1,
    borderColor: "#2B2B2B",
    textAlign: "center",
  },

  // Auth
  authDetails: {
    border: 1,
    borderBottom: 2,
    borderTop: "none",
    display: "flex",
    flexDirection: "row",
  },
  authLeft: {
    padding: 2,
    flex: 2,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    // alignItems: "center",
    gap: "10",
    fontSize: 12,
  },
  authRight: {
    flex: 2,
    borderLeft: 1,
    borderLeftColor: "#11111",
    display: "flex",
    flexDirection: "column",
  },
  authBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderBottom: 1,
    height: 24,
  },
  signatureContainer: {
    display: "flex",
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: 1,
    borderBottomColor: "gray",
    borderTop: 1,
    height: 60,
    fontSize: 12,
    padding: 2,
  },
});

// Invoice PDF component
const InvoicePDF: React.FC<{ invoiceData: IGeneralData }> = ({
  invoiceData,
}) => {
  const { selectedInvoiceMonth } = useInvoiceStore();

  const companies = {
    "BLUE SKY ENTERPRICESS": {
      name: import.meta.env.VITE_COMPANY1_NAME,
      address: import.meta.env.VITE_COMPANY1_ADDR,
      email: import.meta.env.VITE_COMPANY1_EMAIL,
      phone: import.meta.env.VITE_COMPANY1_PHONE,
      bank: import.meta.env.VITE_COMPANY1_BANK,
      gstin: import.meta.env.VITE_COMPANY1_GSTIN,
    },
    "RAJAGOPALAN P.V": {
      name: import.meta.env.VITE_COMPANY2_NAME,
      address: import.meta.env.VITE_COMPANY2_ADDR,
      email: import.meta.env.VITE_COMPANY2_EMAIL,
      phone: import.meta.env.VITE_COMPANY2_PHONE,
      bank: import.meta.env.VITE_COMPANY2_BANK,
      gstin: import.meta.env.VITE_COMPANY2_GSTIN,
    },
  } as const;

  const selectedCompany =
    companies[invoiceData.invoiceFromCompany as keyof typeof companies];

  const selectedCompanyLogo = `${invoiceData.invoiceFromCompany}.jpg`

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>TAXABLE INVOICE</Text>
          <Text style={styles.companyName}>{selectedCompany.name}</Text>
          <View style={styles.companyRow}>
            <Image
              source={{ uri: selectedCompanyLogo }}
              style={styles.companyLogo}
            />

            <Text style={styles.companyAddress}>{selectedCompany.address}</Text>
          </View>
        </View>
        {/* Table Header */}-{" "}
        <View style={styles.generalSection}>
          {/* Left Section */}
          <View style={styles.leftSection}>
            <Text style={styles.text}>GSTIN: {selectedCompany.gstin}</Text>
            <Text style={styles.text}>
              Tax is payable on reverse charge (Yes/No)
            </Text>
            <Text style={styles.text}>
              Invoice Serial Number: {invoiceData.invoiceNumber}
            </Text>
            <Text style={styles.text}>
              Invoice Date:{" "}
              {invoiceData.invoiceDate &&
                new Date(invoiceData.invoiceDate).toLocaleDateString("en-GB")}
            </Text>

            <Text style={styles.text}>
              Invoice Type:{" "}
              {invoiceData.invoiceType
                ? `Monthly Wages [${selectedInvoiceMonth || getCurrentMonth()}]`
                : `Daily Wages [${selectedInvoiceMonth || getCurrentMonth()}]`}
            </Text>
          </View>

          {/* Right Section */}
          <View style={styles.rightSection}>
            <Text style={[styles.text, { textDecoration: "underline" }]}>
              {selectedCompany.email}
            </Text>
            <Text style={styles.text}>Phone No: {selectedCompany.phone}</Text>
          </View>
        </View>
        {/* ToDetailsSection */}
        <View style={styles.ToDetailsSection}>
          <View style={styles.ToDetailsSectionLeft}>
            <Text
              style={[styles.smallTitle, { borderBottom: 1, paddingLeft: 4 }]}
            >
              Details of Receiver (Billed to)
            </Text>
            <View
              style={[{ paddingVertical: 6, paddingLeft: 4, lineHeight: 0.9 }]}
            >
              <Text style={styles.text}>
                Name: {invoiceData.companyAddress}
              </Text>
            </View>
          </View>
          <View style={styles.ToDetailsSectionRight}>
            <Text
              style={[styles.smallTitle, { borderBottom: 1, paddingLeft: 4 }]}
            >
              Details of Consignee (Shipped to)
            </Text>
            <View style={[{ paddingVertical: 6, paddingLeft: 4 }]}>
              <Text style={styles.text}>Email: {invoiceData.email}</Text>
              <Text style={styles.text}>GSTIN: {invoiceData.gstin}</Text>
            </View>
          </View>
        </View>
        {/*  Amount Table */}
        <View style={styles.calculationTable}>
          {/* Table Header */}
          <View style={styles.amountTitleSection}>
            <Text style={[styles.tableHeader, { flex: 1, paddingLeft: 5 }]}>
              Sr. No
            </Text>
            <Text style={[styles.tableHeader, { flex: 5 }]}>Description</Text>
            <Text
              style={[
                styles.tableHeader,
                { flex: 2, borderRightColor: "black", borderRightWidth: 1 },
              ]}
            >
              Duty
            </Text>
            <Text style={[styles.tableHeader, { flex: 2 }]}>
              Rate per Month
            </Text>
            <Text style={[styles.tableHeader, { flex: 4, borderRight: 0 }]}>
              Amount
            </Text>
          </View>

          {/* Invoice Details Rows */}
          {invoiceData?.invoiceDetails?.length ? (
            invoiceData.invoiceDetails.map((details, index) => (
              <View key={index} style={styles.row}>
                <Text
                  style={[
                    styles.cell,
                    {
                      flex: 1,
                      paddingLeft: 5,
                      borderRightWidth: 1,
                      paddingVertical: 22,
                    },
                  ]}
                >
                  {index + 1}
                </Text>
                <Text style={[styles.cell, { flex: 5 }]}>
                  {details.description}
                </Text>
                <Text style={[styles.cell, { flex: 2 }]}>{details.duty}</Text>
                <Text style={[styles.cell, { flex: 2 }]}>{details.rate}</Text>
                <Text style={[styles.cell, { flex: 4, border: 0 }]}>
                  {details.amount}
                </Text>
              </View>
            ))
          ) : (
            <Text style={[{ fontSize: 12 }]}>No Duties are available</Text>
          )}

          <View style={[styles.row]}>
            <Text style={[styles.cell, { flex: 1, paddingLeft: 5 }]}></Text>
            <Text style={[styles.cell, { flex: 5, fontWeight: "bold" }]}>
              Total Taxable Amount
            </Text>
            <Text style={[styles.cell, { flex: 2 }]}>
              {invoiceData.taxDuty}
            </Text>
            <Text style={[styles.cell, { flex: 2 }]}></Text>
            <Text style={[styles.cell, { flex: 4, borderRight: 0 }]}>
              {invoiceData.totalTaxableAmount}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.cell, { flex: 1, paddingLeft: 5 }]}></Text>
            <Text style={[styles.cell, { flex: 5, fontWeight: "bold" }]}>
              CGST
            </Text>
            <Text style={[styles.cell, { flex: 2 }]}>
              {invoiceData.cgstPercentage}
            </Text>
            <Text style={[styles.cell, { flex: 2 }]}></Text>
            <Text style={[styles.cell, { flex: 4, borderRight: 0 }]}>
              {" "}
              {invoiceData.cgstAmount}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.cell, { flex: 1, paddingLeft: 5 }]}></Text>
            <Text style={[styles.cell, { flex: 5, fontWeight: "bold" }]}>
              SGST
            </Text>
            <Text style={[styles.cell, { flex: 2 }]}>
              {invoiceData.sgstPercentage}
            </Text>
            <Text style={[styles.cell, { flex: 2 }]}></Text>
            <Text style={[styles.cell, { flex: 4, borderRight: 0 }]}>
              {" "}
              {invoiceData.sgstAmount}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.cell, { flex: 1, paddingLeft: 5 }]}></Text>
            <Text style={[styles.cell, { flex: 5, fontWeight: "bold" }]}>
              IGST
            </Text>
            <Text style={[styles.cell, { flex: 2 }]}>
              {invoiceData.igstPercentage}
            </Text>
            <Text style={[styles.cell, { flex: 2 }]}></Text>
            <Text style={[styles.cell, { flex: 4, borderRight: 0 }]}>
              {" "}
              {invoiceData.igstAmount ? invoiceData.igstAmount : 0.0}
            </Text>
          </View>

          <View style={[styles.row, { borderBottom: 0 }]}>
            <Text style={[styles.cell, { flex: 1, paddingLeft: 5 }]}></Text>
            <Text style={[styles.cell, { flex: 5, fontWeight: "bold" }]}>
              Total Invoice Amount
            </Text>
            <Text style={[styles.cell, { flex: 2 }]}></Text>
            <Text style={[styles.cell, { flex: 2 }]}></Text>
            <Text style={[styles.cell, { flex: 4, borderRight: 0 }]}>
              {invoiceData.totalInvoicePayable}
            </Text>
          </View>

          <Text
            style={[
              styles.smallTitle,
              {
                borderTop: 1,
                textAlign: "center",
                padding: 2,
                // paddingTop: 5,
                fontSize: 12,
              },
            ]}
          >
            Invoice value (in words) Rupees {invoiceData.totalInvoiceInWords}
          </Text>
        </View>
        <View style={styles.authDetails}>
          <View style={styles.authLeft}>
            <View>
              <Text
                style={[
                  { fontWeight: "extrabold", fontSize: 13, marginBottom: 2 },
                ]}
              >
                Bank Details:{" "}
              </Text>
              <Text style={[{ lineHeight: 0.8, letterSpacing: 0.2 }]}>
                {selectedCompany.bank}
              </Text>
            </View>
            <Text style={[{ alignSelf: "flex-end" }]}>
              "Certified that the particulars given above are true and correct"
            </Text>
          </View>

          <View style={styles.authRight}>
            <View style={styles.authBox}></View>

            <View style={[styles.authBox, { padding: 4, borderBottom: 0 }]}>
              <Text style={[{ fontSize: 12, color: "black" }]}>
                {" "}
                {selectedCompany.name}{" "}
              </Text>
            </View>

            <View style={styles.signatureContainer}>
              <Text>Signature</Text>
              <Text>Authorised Signatory</Text>
            </View>

            <View
              style={[
                styles.signatureContainer,
                { padding: 4, borderBottom: 0 },
              ]}
            >
              <Text>Name: </Text>
              <Text>{selectedCompany.name}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

// Preview screen with the PDF viewer and the save control.
const InvoicePreview: React.FC<{ invoiceData: IGeneralData }> = ({
  invoiceData,
}) => {
  const { selectedInvoiceMonth } = useInvoiceStore();
  const receivers = useReceiverStore((state) => state.receivers);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  const receiverName = findReceiverByValues(
    receivers,
    invoiceData.companyAddress,
    invoiceData.email,
    invoiceData.gstin
  )?.name;

  const [fileName, setFileName] = useState(() =>
    buildInvoiceFileName(
      invoiceData.invoiceFromCompany,
      receiverName,
      selectedInvoiceMonth
    )
  );

  // Keeps the rendered document stable so typing a file name does not rebuild the PDF.
  const invoiceDocument = useMemo(
    () => <InvoicePDF invoiceData={invoiceData} />,
    [invoiceData]
  );

  // Renders the invoice to a PDF blob and saves it, guarding against repeat clicks.
  const handleDownload = async () => {
    if (isSaving) return;

    if (fileName.trim().length < 3) {
      toast.error("Enter proper file name", { position: "top-center" });
      inputRef.current?.focus();
      return;
    }

    setIsSaving(true);
    try {
      const blob = await pdf(invoiceDocument).toBlob();
      saveAs(blob, `${fileName.trim()}.pdf`);
      toast.success("Saved successfully", { position: "top-center" });
    } catch {
      toast.error("Could not save the PDF. Please try again.", {
        position: "top-center",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:py-10">
      <motion.header
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-5 rounded-card border border-line bg-card p-5 shadow-sm sm:p-6 lg:flex-row lg:items-end lg:justify-between"
      >
        <div className="flex items-start gap-4">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => navigate("/")}
            icon={<ArrowLeft className="h-4 w-4" />}
          >
            Back
          </Button>

          <div>
            <h1 className="text-xl font-semibold tracking-tight text-ink">
              Invoice Preview
            </h1>
            <p className="mt-0.5 text-sm text-muted">
              Review the invoice and save it as a PDF.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="sm:mb-6">
            <ThemeToggle />
          </div>

          <TextField
            id="fileName"
            ref={inputRef}
            label="File name"
            placeholder="invoice"
            hint="Saved as .pdf"
            icon={<FileText className="h-4 w-4" />}
            wrapperClassName="sm:w-80"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />

          <Button
            type="button"
            onClick={handleDownload}
            disabled={isSaving}
            className="sm:mb-6"
            icon={
              isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )
            }
          >
            {isSaving ? "Saving..." : "Save PDF"}
          </Button>
        </div>
      </motion.header>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="overflow-hidden rounded-card border border-line bg-card shadow-sm"
      >
        <div className="flex items-center gap-2 border-b border-line bg-surface/70 px-4 py-3">
          <FileText className="h-4 w-4 text-muted" />
          <span className="text-sm font-medium text-ink-soft">PDF document</span>
        </div>

        <PDFViewer
          style={{
            width: "100%",
            height: "70vh",
            minHeight: "480px",
            border: "none",
          }}
        >
          {invoiceDocument}
        </PDFViewer>
      </motion.div>
    </div>
  );
};

export default InvoicePreview;
