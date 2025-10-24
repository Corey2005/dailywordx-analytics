import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";       // treat Index as the dashboard UI (or rename)
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard"; // optional — only if you create it

const queryClient = new QueryClient();

const isLoggedIn = () => localStorage.getItem('loggedIn') === 'true';

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/dailywordx-analytics">
        <Routes>
          {/* route '/' used within dashboard.html context — you can map /dashboard too */}
          <Route path="/" element={ isLoggedIn() ? <Index /> : <Navigate to="/index.html" replace /> } />
          {/* if you prefer an explicit /dashboard route: */}
          <Route path="/dashboard" element={ isLoggedIn() ? <Index /> : <Navigate to="/index.html" replace /> } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App;
