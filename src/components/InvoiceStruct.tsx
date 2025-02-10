import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  pdf,
} from "@react-pdf/renderer";
import React, { useRef } from "react";

import { IGeneralData } from "../types/invoice-types";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import { useState } from "react";
import toast from "react-hot-toast";

type InvoiceData = IGeneralData;
const COMPANY_ADDR = import.meta.env.VITE_COMPANY_ADDR;
const COMPANY_EMAIL = import.meta.env.VITE_COMPANY_EMAIL;
const COMPANY_PHONE = import.meta.env.VITE_PHONE_NUMBER;
const COMPANY_BANK = import.meta.env.VITE_BANK_DETAILS;
const COMPANY_GSTIN = import.meta.env.VITE_COMPANY_GSTIN;
const COMPANY_NAME = import.meta.env.VITE_COMPANY_NAME;

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
    marginBottom: 4,
    textTransform: "uppercase",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "extrabold",
  },
  companyAddress: {
    textAlign: "center",
    marginLeft: 270,
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
    width: "64%",
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
    width: "64%",

    paddingTop: 4,
    paddingBottom: 0,
    fontSize: 8,
  },

  // calculation Table
  calculationTable: {
    borderWidth: 1,
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
    borderColor: "#e0e0e0",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
    display: "flex",
    textAlign: "center",
    justifyContent: "center",
  },
  cell: {
    padding: 4,
    fontSize: 12,
    fontWeight: "normal",
    borderRightWidth: 1,
    borderColor: "#e0e0e0",
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
    // borderBottom: 1,
    borderTop: 1,
    height: 60,
    fontSize: 12,
    padding: 2,
  },
});

// Invoice PDF component
const InvoicePDF: React.FC<{ invoiceData: InvoiceData }> = ({
  invoiceData,
}) => {
  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>TAXABLE INVOICE</Text>
          <Text style={styles.companyName}>{COMPANY_NAME}</Text>
          <Text style={styles.companyAddress}>{COMPANY_ADDR}</Text>
        </View>
        {/* Table Header */}-{" "}
        <View style={styles.generalSection}>
          {/* Left Section */}
          <View style={styles.leftSection}>
            <Text style={styles.text}>GSTIN: {COMPANY_GSTIN}</Text>
            <Text style={styles.text}>
              Tax is payable on reverse charge (Yes/No)
            </Text>
            <Text style={styles.text}>
              Invoice Serial Number: {invoiceData.invoiceNumber}
            </Text>
            <Text style={styles.text}>
              Invoice Date: {invoiceData.invoiceDate}
            </Text>
            <Text style={styles.text}>
              Invoice Type:{" "}
              {invoiceData.invoiceType
                ? "Monthly Wages [31 days]"
                : "Daily Wages"}
            </Text>
          </View>

          {/* Right Section */}
          <View style={styles.rightSection}>
            <Text style={[styles.text, { textDecoration: "underline" }]}>
              {COMPANY_EMAIL}
            </Text>
            <Text style={styles.text}>Phone No: {COMPANY_PHONE}</Text>
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
              style={[{ paddingVertical: 10, paddingLeft: 4, lineHeight: 0.9 }]}
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
            <View style={[{ paddingVertical: 10, paddingLeft: 4 }]}>
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
            <Text style={[styles.tableHeader, { flex: 2 }]}>Duty</Text>
            <Text style={[styles.tableHeader, { flex: 2 }]}>
              Rate per Month
            </Text>
            <Text
              style={[styles.tableHeader, { flex: 4, borderRightWidth: 0 }]}
            >
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
                <Text style={[styles.cell, { flex: 4, borderRightWidth: 0 }]}>
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
            <Text style={[styles.cell, { flex: 4 }]}>
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
            <Text style={[styles.cell, { flex: 4 }]}>
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
            <Text style={[styles.cell, { flex: 4 }]}>
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
            <Text style={[styles.cell, { flex: 4 }]}>
              {" "}
              {invoiceData.igstAmount ? invoiceData.igstAmount : 0.0}
            </Text>
          </View>

          <View style={[styles.row, { borderBottom: 0 }]}>
            <Text style={[styles.cell, { flex: 1 }]}></Text>
            <Text style={[styles.cell, { flex: 5, fontWeight: "bold" }]}>
              Total Invoice Amount
            </Text>
            <Text style={[styles.cell, { flex: 2 }]}></Text>
            <Text style={[styles.cell, { flex: 2 }]}></Text>
            <Text style={[styles.cell, { flex: 4 }]}>
              {invoiceData.totalInvoicePayable}
            </Text>
          </View>

          <Text
            style={[
              styles.smallTitle,
              {
                borderTop: 1,
                textAlign: "center",
                padding: 3,
                paddingTop: 5,
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
                {COMPANY_BANK}
              </Text>
            </View>
            <Text style={[{ alignSelf: "flex-end" }]}>
              "Certified that the pallculars given above are true and correct"
            </Text>
          </View>

          <View style={styles.authRight}>
            <View style={styles.authBox}></View>

            <View style={[styles.authBox, { padding: 4 }]}>
              <Text style={[{ fontSize: 12, color: "black" }]}>
                {" "}
                {COMPANY_NAME}{" "}
              </Text>
            </View>

            <View style={styles.signatureContainer}>
              <Text>Signature</Text>
              <Text>Authorised Signatory</Text>
            </View>

            <View style={styles.signatureContainer}>
              <Text>Name: </Text>
              <Text>{COMPANY_NAME}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

// Invoice viewer component
const InvoicePreview: React.FC<{ invoiceData: InvoiceData }> = ({
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
    <div className="flex flex-col h-screen bg-gray-50 p-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-30 transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          ← Back to Form
        </button>

        <div className="flex flex-col  sm:flex-row items-center gap-4 bg-white p-5 rounded-xl shadow-md border border-gray-200">
          <div>
            <input
              ref={inputRef}
              type="text"
              value={fileName}
              onChange={(e) => {
                setFileName(e.target.value);
              }}
              placeholder="Enter file name ..."
              className=" border-2 p-2 rounded border-gray-300 focus:ring-blue-300 focus:border-gray-500 font-mono"
            />
          </div>

          <button
            onClick={handleDownload}
            className="w-full sm:w-auto flex items-center justify-center gap-2 text-white bg-red-600 px-6 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span>Save PDF</span>
          </button>
        </div>
      </div>
      {fileName.length == 0 ? (
        <div className="flex-1 w-full bg-white rounded-xl shadow-xl overflow-hidden">
          <PDFViewer
            style={{
              width: "100%",
              height: "100%",
              minHeight: "500px",
            }}
            className="rounded-lg border border-gray-200"
          >
            <InvoicePDF invoiceData={invoiceData} />
          </PDFViewer>
        </div>
      ) : (
        <div className="flex-1 w-full bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl overflow-hidden flex flex-col items-center justify-center p-8 sm:p-12 space-y-6 border border-gray-100">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 text-center leading-tight">
            Save the file to enable{" "}
            <span className="text-blue-600">Preview Mode</span>!
          </h1>

          <button
            onClick={() => setFileName("")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50 transition-all transform hover:scale-105 active:scale-95 shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span>Back to Preview Mode</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default InvoicePreview;
