import "./global.css";

// Suppress defaultProps warnings from Recharts library and other React 18+ compatibility warnings
const originalWarn = console.warn;
const originalError = console.error;

// Override console.warn completely to suppress Recharts warnings
console.warn = function (...args) {
  // Convert all arguments to strings for checking
  const message = String(args[0] || "");
  const allArgsString = args.map((arg) => String(arg)).join(" ");

  // Check if this is a defaultProps warning from Recharts
  const isDefaultPropsWarning =
    message.includes("Support for defaultProps will be removed") ||
    message.includes("%s: Support for defaultProps") ||
    allArgsString.includes("defaultProps will be removed");

  const isRechartsComponent =
    allArgsString.includes("XAxis") ||
    allArgsString.includes("YAxis") ||
    allArgsString.includes("XAxis2") ||
    allArgsString.includes("YAxis2") ||
    allArgsString.includes("recharts") ||
    allArgsString.includes("ChartLayoutContextProvider") ||
    allArgsString.includes("CategoricalChartWrapper");

  // Suppress if it's a defaultProps warning from Recharts
  if (isDefaultPropsWarning && isRechartsComponent) {
    return; // Skip this warning
  }

  // Allow all other warnings through
  originalWarn.apply(console, args);
};

// Also override console.error for completeness
console.error = function (...args) {
  const message = String(args[0] || "");
  const allArgsString = args.map((arg) => String(arg)).join(" ");

  // Check if this is a defaultProps error from Recharts
  const isDefaultPropsError =
    message.includes("Support for defaultProps will be removed") ||
    message.includes("defaultProps will be removed");

  const isRechartsComponent =
    allArgsString.includes("XAxis") ||
    allArgsString.includes("YAxis") ||
    allArgsString.includes("recharts") ||
    allArgsString.includes("ChartLayoutContextProvider");

  // Suppress if it's a defaultProps error from Recharts
  if (isDefaultPropsError && isRechartsComponent) {
    return; // Skip this error
  }

  // Allow all other errors through
  originalError.apply(console, args);
};

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import { DialogProvider } from "@/contexts/DialogContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CartProvider } from "@/contexts/CartContext";
import LoginPage from "@/components/LoginPage";
import DashboardLayout from "@/components/DashboardLayout";
import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";
import Orders from "@/pages/Orders";
import Customers from "@/pages/Customers";
import Revenue from "@/pages/Revenue";
import Store from "@/pages/Store";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Store routes - no authentication required */}
      <Route path="/store" element={<Store />} />

      {/* Admin routes - authentication required */}
      <Route path="/*" element={
        isAuthenticated ? (
          <DashboardLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/revenue" element={<Revenue />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </DashboardLayout>
        ) : (
          <LoginPage />
        )
      } />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LanguageProvider>
          <CartProvider>
            <AuthProvider>
              <DataProvider>
                <DialogProvider>
                  <AppContent />
                </DialogProvider>
              </DataProvider>
            </AuthProvider>
          </CartProvider>
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
