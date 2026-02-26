import { useAuth } from "../../context/AuthContext";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import {
  mockUsers,
  mockVehicles,
  mockMoveRequests,
  mockMoveOffers,
  mockMoveTrips,
} from "../../mockData/mockData";

export default function Home() {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to SwiftMove
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Please sign in to continue
          </p>
          <a
            href="/signin"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  // Render role-based dashboard
  if (role === "Client") {
    return <ClientDashboard />;
  } else if (role === "Driver") {
    return <DriverDashboard />;
  } else if (role === "Admin") {
    return <AdminDashboard />;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome! Role: {role}</p>
    </div>
  );
}

// Client Dashboard
function ClientDashboard() {
  const activeMoves = mockMoveTrips.filter(
    (trip) => trip.status === "ACTIVE",
  ).length;
  const pendingOffers = mockMoveOffers.filter(
    (offer) => offer.status === "PENDING",
  ).length;
  const completedMoves = mockMoveTrips.filter(
    (trip) => trip.status === "COMPLETED",
  ).length;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Client Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
            Active Moves
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {activeMoves}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
            Pending Offers
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {pendingOffers}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
            Completed Moves
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {completedMoves}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="flex gap-3 flex-wrap">
          <a
            href="/move-requests"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Move Requests
          </a>
          <a
            href="/move-history"
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            View Move History
          </a>
        </div>
      </div>
    </div>
  );
}

// Driver Dashboard
function DriverDashboard() {
  const activeTrips = mockMoveTrips.filter(
    (trip) => trip.status === "ACTIVE",
  ).length;
  const totalVehicles = mockVehicles.length;
  const availableRequests = mockMoveRequests.filter(
    (req) => req.status === "PENDING",
  ).length;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Driver Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
            Active Trips
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {activeTrips}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
            Vehicles
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {totalVehicles}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
            Available Requests
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {availableRequests}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="flex gap-3 flex-wrap">
          <a
            href="/browse-moves"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Move Requests
          </a>
          <a
            href="/vehicles"
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Manage Vehicles
          </a>
          <a
            href="/move-offers"
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            View Move Offers
          </a>
        </div>
      </div>
    </div>
  );
}

// Admin Dashboard
function AdminDashboard() {
  const totalUsers = mockUsers.length;
  const activeMoves = mockMoveTrips.filter(
    (trip) => trip.status === "ACTIVE",
  ).length;
  const pendingOffers = mockMoveOffers.filter(
    (offer) => offer.status === "PENDING",
  ).length;
  const totalVehicles = mockVehicles.length;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Quick Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
            Total Users
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {totalUsers}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
            Active Moves
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {activeMoves}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
            Pending Offers
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {pendingOffers}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
            Total Vehicles
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {totalVehicles}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Management
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <a
            href="/clients"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            Manage Clients
          </a>
          <a
            href="/drivers"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            Manage Drivers
          </a>
          <a
            href="/move-requests"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            Manage Requests
          </a>
          <a
            href="/move-offers"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            Manage Offers
          </a>
          <a
            href="/move-trips"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            Manage Trips
          </a>
          <a
            href="/vehicles"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            Manage Vehicles
          </a>
        </div>
      </div>
    </div>
  );
}
