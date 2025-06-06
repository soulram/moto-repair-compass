
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import RepairIntake from "./pages/RepairIntake";
import Inventory from "./pages/Inventory";
import ContractTypes from "./pages/ContractTypes";
import ContractMonitoring from "./pages/ContractMonitoring";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/" 
            element={
              <MainLayout>
                <Dashboard />
              </MainLayout>
            } 
          />
          <Route 
            path="/customers" 
            element={
              <MainLayout>
                <Customers />
              </MainLayout>
            } 
          />
          <Route 
            path="/repair-intake" 
            element={
              <MainLayout>
                <RepairIntake />
              </MainLayout>
            } 
          />
          <Route 
            path="/inventory" 
            element={
              <MainLayout>
                <Inventory />
              </MainLayout>
            } 
          />
          <Route 
            path="/contract-types" 
            element={
              <MainLayout>
                <ContractTypes />
              </MainLayout>
            } 
          />
          <Route 
            path="/contract-monitoring" 
            element={
              <MainLayout>
                <ContractMonitoring />
              </MainLayout>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
