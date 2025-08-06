import "./global.css";

// Suppress defaultProps warnings from Recharts library
const originalWarn = console.warn;
const originalError = console.error;

console.warn = (...args) => {
  const message = String(args[0] || '');
  const allArgs = args.join(' ');

  // Comprehensive check for Recharts defaultProps warnings
  const isRechartsWarning =
    message.includes('defaultProps will be removed') ||
    message.includes('Support for defaultProps will be removed') ||
    message.includes('%s: Support for defaultProps') ||
    allArgs.includes('XAxis') ||
    allArgs.includes('YAxis') ||
    allArgs.includes('defaultProps will be removed from function components') ||
    allArgs.includes('recharts');

  if (isRechartsWarning) {
    return; // Suppress the warning
  }

  originalWarn(...args);
};

console.error = (...args) => {
  const message = String(args[0] || '');
  const allArgs = args.join(' ');

  // Also suppress if they appear as errors
  const isRechartsError =
    message.includes('defaultProps will be removed') ||
    allArgs.includes('XAxis') ||
    allArgs.includes('YAxis') ||
    allArgs.includes('recharts');

  if (isRechartsError) {
    return; // Suppress the error
  }

  originalError(...args);
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
import LoginPage from "@/components/LoginPage";
import DashboardLayout from "@/components/DashboardLayout";
import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";
import Orders from "@/pages/Orders";
import Customers from "@/pages/Customers";
import Revenue from "@/pages/Revenue";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
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
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <DataProvider>
              <DialogProvider>
                <AppContent />
              </DialogProvider>
            </DataProvider>
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
