import "./global.css";

// Suppress defaultProps warnings from Recharts library - Complete override
const originalWarn = console.warn;
const originalError = console.error;

// Override console.warn completely to suppress Recharts warnings
console.warn = function(...args) {
  // Convert all arguments to strings for checking
  const message = String(args[0] || '');
  const allArgsString = args.map(arg => String(arg)).join(' ');

  // Extensive checks for all possible Recharts warning formats
  const suppressPatterns = [
    'defaultProps will be removed',
    'Support for defaultProps',
    '%s: Support for defaultProps',
    'XAxis',
    'YAxis',
    'recharts',
    'function components in a future major release',
    'Use JavaScript default parameters instead'
  ];

  const shouldSuppress = suppressPatterns.some(pattern =>
    message.includes(pattern) || allArgsString.includes(pattern)
  );

  if (!shouldSuppress) {
    originalWarn.apply(console, args);
  }
};

// Also override console.error for completeness
console.error = function(...args) {
  const message = String(args[0] || '');
  const allArgsString = args.map(arg => String(arg)).join(' ');

  const suppressPatterns = [
    'defaultProps will be removed',
    'XAxis',
    'YAxis',
    'recharts'
  ];

  const shouldSuppress = suppressPatterns.some(pattern =>
    message.includes(pattern) || allArgsString.includes(pattern)
  );

  if (!shouldSuppress) {
    originalError.apply(console, args);
  }
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
