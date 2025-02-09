import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import InvoiceForm from "./pages/InvoiceForm";
import Invoice from "./pages/Invoice";
import { DataProvider } from "./hooks/Context";

function App() {
  return (
    <>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/" element=<InvoiceForm /> />
            <Route path="/pdf-preview" element=<Invoice /> />
          </Routes>
        </Router>
      </DataProvider>
    </>
  );
}

export default App;
