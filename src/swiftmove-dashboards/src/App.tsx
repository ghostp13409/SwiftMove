import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/providers/NotificationProvider";
import DashboardLayout from "@/layouts/DashboardLayout";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ClientDashboard from "@/pages/client/ClientDashboard";
import ClientMoveRequests from "@/pages/client/ClientMoveRequests";
import ClientTrips from "@/pages/client/ClientTrips";
import PaymentSuccess from "@/pages/client/PaymentSuccess";
import HistoryPage from "@/pages/shared/History";
import DriverDashboard from "@/pages/driver/DriverDashboard";

import BrowseRequests from "@/pages/driver/BrowseRequests";
import Vehicles from "@/pages/driver/Vehicles";
import DriverOffers from "@/pages/driver/DriverOffers";
import DriverTrips from "@/pages/driver/DriverTrips";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminMoveRequests from "@/pages/admin/AdminMoveRequests";
import AdminMoveOffers from "@/pages/admin/AdminMoveOffers";
import AdminTrips from "@/pages/admin/AdminTrips";
import AdminVehicles from "@/pages/admin/AdminVehicles";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <NotificationProvider>
              <Routes>

                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Client Routes */}
                <Route path="/client" element={<DashboardLayout role="CLIENT" />}>
                  <Route index element={<ClientDashboard />} />
                  <Route path="requests" element={<ClientMoveRequests />} />
                  <Route path="trips" element={<ClientTrips />} />
                  <Route path="history" element={<HistoryPage />} />
                  <Route path="profile" element={<Profile />} />
                </Route>
                <Route path="/payment/success" element={<PaymentSuccess />} />

                {/* Driver Routes */}
                <Route path="/driver" element={<DashboardLayout role="DRIVER" />}>
                  <Route index element={<DriverDashboard />} />
                  <Route path="browse" element={<BrowseRequests />} />
                  <Route path="vehicles" element={<Vehicles />} />
                  <Route path="offers" element={<DriverOffers />} />
                  <Route path="trips" element={<DriverTrips />} />
                  <Route path="history" element={<HistoryPage />} />
                  <Route path="profile" element={<Profile />} />
                </Route>


                {/* Admin Routes */}
                <Route path="/admin" element={<DashboardLayout role="ADMIN" />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="requests" element={<AdminMoveRequests />} />
                  <Route path="offers" element={<AdminMoveOffers />} />
                  <Route path="trips" element={<AdminTrips />} />
                  <Route path="vehicles" element={<AdminVehicles />} />
                </Route>

                <Route path="*" element={<NotFound />} />
                </Routes>
                </NotificationProvider>
                </BrowserRouter>
                </TooltipProvider>
                </AuthProvider>

              </QueryClientProvider>

  </ThemeProvider>
);

export default App;
