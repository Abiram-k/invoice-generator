import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster, toast } from 'react-hot-toast';
import "./App.css";
import InvoiceForm from "./pages/InvoiceForm";
import Invoice from "./pages/Invoice";
import { DataProvider } from "./hooks/Context";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/" element=<InvoiceForm /> />
            <Route path="/pdf-preview" element=<Invoice /> />
            <Route path="*" element={<NotFound />} /> 
          </Routes>
        </Router>
      </DataProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <Footer/>
    </>
  );
}

export default App;
