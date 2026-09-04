import { ReactNode } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { Toaster } from "react-hot-toast";

import "./App.css";
import InvoiceForm from "./pages/InvoiceForm";
import Invoice from "./pages/Invoice";
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer";
import { DataProvider } from "./hooks/Context";
import { pageTransition } from "./utils/motion";

// Animates a route in and out as the user moves between pages.
const AnimatedPage = ({ children }: { children: ReactNode }) => (
  <motion.div
    variants={pageTransition}
    initial="hidden"
    animate="visible"
    exit="exit"
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <AnimatedPage>
              <InvoiceForm />
            </AnimatedPage>
          }
        />
        <Route
          path="/pdf-preview"
          element={
            <AnimatedPage>
              <Invoice />
            </AnimatedPage>
          }
        />
        <Route
          path="*"
          element={
            <AnimatedPage>
              <NotFound />
            </AnimatedPage>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <DataProvider>
        <Router>
          <div className="flex min-h-screen flex-col bg-surface">
            <main className="flex-1">
              <AnimatedRoutes />
            </main>
            <Footer />
          </div>
        </Router>
        <Toaster position="top-right" reverseOrder={false} />
      </DataProvider>
    </MotionConfig>
  );
}

export default App;
