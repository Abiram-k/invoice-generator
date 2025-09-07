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
import React, { useRef } from "react";

import { IGeneralData } from "../types/invoice-types";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import { useState } from "react";
import toast from "react-hot-toast";
import { getCurrentMonth } from "../utils/getCurrentMonth";
import { useInvoiceStore } from "../store/useInvoiceStore";

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

// Enhanced Invoice viewer component
const InvoicePreview: React.FC<{ invoiceData: IGeneralData }> = ({
  invoiceData,
}) => {
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleDownload = async () => {
    if (fileName.length < 3) {
      toast.error("Enter proper file name", { position: "top-center" });
      inputRef.current?.focus();
      return;
    }
    const blob = await pdf(<InvoicePDF invoiceData={invoiceData} />).toBlob();
    saveAs(blob, `${fileName}.pdf`);
    toast.success("Saved successfully", { position: "top-center" });
  };

  return (
    <div className="flex flex-col  bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 space-y-6">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-200 backdrop-blur-sm">
        {/* Left side - Back button and title */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-30 transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="relative flex items-center gap-2">
              <svg
                className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Form
            </div>
          </button>

          <div className="hidden lg:block">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Invoice Preview
            </h1>
            <p className="text-gray-500 text-sm">
              Review and download your invoice
            </p>
          </div>
        </div>

        {/* Right side - Download section */}
        <div className="w-full lg:w-auto">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-gradient-to-r from-gray-50 to-white p-5 rounded-xl shadow-inner border border-gray-100">
            <div className="relative group">
              <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                File Name
              </label>
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="Enter file name..."
                  className="w-full sm:w-64 border-2 border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-gray-700 bg-white shadow-sm transition-all duration-200 hover:border-gray-300 placeholder-gray-400"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-end">
              <div className="h-6"></div> {/* Spacer to align with input */}
              <button
                onClick={handleDownload}
                className="group relative w-full sm:w-auto flex items-center justify-center gap-3 text-white bg-gradient-to-r from-red-600 to-rose-600 px-6 py-3 rounded-xl hover:from-red-700 hover:to-rose-700 focus:outline-none focus:ring-4 focus:ring-red-400 focus:ring-opacity-30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 font-semibold overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-rose-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 group-hover:animate-bounce"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="relative">Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Content Area */}
      {fileName.length === 0 ? (
        <div className="flex-1 w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 relative group">
          {/* PDF Viewer Header */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <h3 className="text-white font-medium text-sm">
                Invoice Preview
              </h3>
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-xs">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                  clipRule="evenodd"
                />
              </svg>
              PDF Document
            </div>
          </div>

          <PDFViewer
            style={{
              width: "100%",
              height: "calc(100% - 60px)",
              minHeight: "500px",
              border: "none",
            }}
            className="bg-gray-50"
          >
            <InvoicePDF invoiceData={invoiceData} />
          </PDFViewer>
        </div>
      ) : (
        <div className="flex-1 w-full bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-2xl shadow-2xl overflow-hidden flex flex-col items-center justify-center p-8 sm:p-12 space-y-8 border-2 border-blue-100 relative">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 blur-3xl"></div>
          </div>

          {/* Content */}
          <div className="relative text-center space-y-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-lg mb-4">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 leading-tight">
              Ready to Save!
            </h1>

            <p className="text-lg text-gray-600 max-w-md leading-relaxed">
              Your invoice is ready. Save the file to enable{" "}
              <span className="font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Preview Mode
              </span>{" "}
              and view the document.
            </p>
          </div>

          <div className="relative flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setFileName("")}
              className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="relative">Back to Preview</span>
            </button>

            <div className="text-center text-gray-500 text-sm self-center px-4">
              or scroll up to save the PDF
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicePreview;
