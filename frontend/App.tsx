import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Home from "./pages/Home";
import CreateToken from "./pages/CreateToken";
import Dashboard from "./pages/Dashboard";
import LiquidityControl from "./pages/LiquidityControl";
import Navbar from "./components/Navbar";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div dir="rtl" className="dark min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateToken />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/liquidity/:tokenId" element={<LiquidityControl />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
