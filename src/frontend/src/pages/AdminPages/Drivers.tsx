import { useState, useEffect } from "react";
import { LoadingSpinner, ConfirmModal } from "../../components/common";
import { UsersTable } from "../../components/tables";
import { driverService } from "../../services/driverService";
import { Driver } from "../../types";
import { mockDrivers } from "../../mockData/mockData";

export default function AdminDrivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Driver | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true);
        // Using hardcoded mock data for frontend testing
        setDrivers(mockDrivers);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch drivers",
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  const handleDeleteClick = (driver: Driver) => {
    setDeleteConfirm(driver);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await driverService.deleteDriver(deleteConfirm.id);
      setDrivers(drivers.filter((d) => d.id !== deleteConfirm.id));
      if (selectedDriver?.id === deleteConfirm.id) {
        setSelectedDriver(null);
      }
      setDeleteConfirm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete driver");
      console.error(err);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Drivers Management
        </h1>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Total Drivers:{" "}
          <span className="font-bold text-lg">{drivers.length}</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>

        {/* Drivers Table */}
        <UsersTable
          users={drivers}
          loading={loading}
          selectedId={selectedDriver?.id}
          onSelect={setSelectedDriver}
          onDelete={handleDeleteClick}
        />
      </div>

      {/* Driver Details Panel */}
      {selectedDriver && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedDriver.firstName} {selectedDriver.lastName}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Driver ID: {selectedDriver.id}
              </p>
            </div>
            <button
              onClick={() => handleDeleteClick(selectedDriver)}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Delete
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  First Name
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {selectedDriver.firstName}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Last Name
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {selectedDriver.lastName}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Email
                </h3>
                <p className="text-gray-900 dark:text-white break-all">
                  {selectedDriver.email}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Username
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {selectedDriver.userName}
                </p>
              </div>
            </div>

            {/* Driving Information */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Driving Experience (Years)
                </h3>
                <p className="text-gray-900 dark:text-white font-medium">
                  {selectedDriver.drivingExperience}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Service Range (km)
                </h3>
                <p className="text-gray-900 dark:text-white font-medium">
                  {selectedDriver.range}
                </p>
              </div>

              {selectedDriver.drivingLicense && (
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Driving License
                  </h3>
                  <p className="text-gray-900 dark:text-white font-mono">
                    {selectedDriver.drivingLicense}
                  </p>
                </div>
              )}

              {selectedDriver.dob && (
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Date of Birth
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(selectedDriver.dob).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Address Information */}
          {selectedDriver.address && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">
                    Street
                  </span>
                  <p className="text-gray-900 dark:text-white">
                    {selectedDriver.address.line1}
                    {selectedDriver.address.line2 &&
                      `, ${selectedDriver.address.line2}`}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">
                    City
                  </span>
                  <p className="text-gray-900 dark:text-white">
                    {selectedDriver.address.city}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">
                    State/Province
                  </span>
                  <p className="text-gray-900 dark:text-white">
                    {selectedDriver.address.stateOrProvince}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">
                    Country
                  </span>
                  <p className="text-gray-900 dark:text-white">
                    {selectedDriver.address.country}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium text-gray-600 dark:text-gray-400">
                    Postal Code
                  </span>
                  <p className="text-gray-900 dark:text-white">
                    {selectedDriver.address.postalOrZipCode}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <ConfirmModal
          title="Delete Driver"
          message={`Are you sure you want to delete ${deleteConfirm.firstName} ${deleteConfirm.lastName} (${deleteConfirm.email})? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteConfirm(null)}
          confirmText="Delete"
        />
      )}
    </div>
  );
}
