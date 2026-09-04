import { ReactNode, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";

import "./App.css";
import InvoiceForm from "./pages/InvoiceForm";
import Invoice from "./pages/Invoice";
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer";
import AppToaster from "./components/AppToaster";
import { DataProvider } from "./hooks/Context";
import { pageTransition } from "./utils/motion";
import { useThemeStore } from "./store/useThemeStore";

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
  const theme = useThemeStore((state) => state.theme);

  // Mirrors the stored theme onto the root element so the CSS variables switch.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

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
        <AppToaster />
      </DataProvider>
    </MotionConfig>
  );
}

export default App;
