import { BrowserRouter as Router, Routes, Route } from "react-router";
import { useEffect } from "react";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { TestUserLogin } from "./components/common/TestUserLogin";
import Home from "./pages/Dashboard/Home";
import { useAuth } from "./context/AuthContext";

// Client Pages
import ClientMoveRequests from "./pages/ClientPages/MoveRequests";
import ClientMoveTrips from "./pages/ClientPages/MoveTrips";

// Driver Pages
import BrowseMoveRequests from "./pages/DriverPages/BrowseMoveRequests";
import DriverVehicles from "./pages/DriverPages/Vehicles";
import DriverMoveOffers from "./pages/DriverPages/MoveOffers";
import DriverMoveTrips from "./pages/DriverPages/MoveTrips";

// Admin Pages
import AdminUsers from "./pages/AdminPages/Users";
import AdminClients from "./pages/AdminPages/Clients";
import AdminDrivers from "./pages/AdminPages/Drivers";
import AdminMoveRequests from "./pages/AdminPages/MoveRequests";
import AdminMoveOffers from "./pages/AdminPages/MoveOffers";
import AdminMoveTrips from "./pages/AdminPages/MoveTrips";
import AdminVehicles from "./pages/AdminPages/Vehicles";

function AppContent() {
  const { isAuthenticated, loginAsTestUser, isLoading } = useAuth();

  // Auto-login as admin on first load (for testing)
  useEffect(() => {
    if (
      !isAuthenticated &&
      !isLoading &&
      !localStorage.getItem("hasTriedLogin")
    ) {
      localStorage.setItem("hasTriedLogin", "true");
      loginAsTestUser("admin");
    }
  }, [isAuthenticated, isLoading, loginAsTestUser]);

  return (
    <>
      <Router>
        <ScrollToTop />
        <TestUserLogin />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

            {/* Client Routes */}
            <Route path="/move-requests" element={<ClientMoveRequests />} />
            <Route path="/move-history" element={<ClientMoveTrips />} />

            {/* Driver Routes */}
            <Route path="/browse-moves" element={<BrowseMoveRequests />} />
            <Route path="/vehicles" element={<DriverVehicles />} />
            <Route path="/move-offers" element={<DriverMoveOffers />} />
            <Route path="/driver-trips" element={<DriverMoveTrips />} />

            {/* Admin Routes */}
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/clients" element={<AdminClients />} />
            <Route path="/drivers" element={<AdminDrivers />} />
            <Route
              path="/admin/move-requests"
              element={<AdminMoveRequests />}
            />
            <Route path="/admin/move-offers" element={<AdminMoveOffers />} />
            <Route path="/move-trips" element={<AdminMoveTrips />} />
            <Route path="/admin/vehicles" element={<AdminVehicles />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default function App() {
  return <AppContent />;
}
