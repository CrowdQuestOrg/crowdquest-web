import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "../src/components/ui/sonner";
import { Toaster } from "../src/components/ui/toaster";
import { TooltipProvider } from "../src/components/ui/tooltip";
import { WalletProvider } from "../src/contexts/WalletContext";
import Layout from "../src/components/Layout";
import Index from "./pages/index.tsx";
import HuntPage from "./pages/HuntPage.tsx";
import ScanPage from "./pages/ScanPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import CreateGamePage from "./pages/CreateGamePage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WalletProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/hunt" element={<HuntPage />} />
              <Route path="/scan" element={<ScanPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/create" element={<CreateGamePage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </WalletProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
