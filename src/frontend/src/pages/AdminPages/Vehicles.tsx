import { useState, useEffect } from "react";
import { LoadingSpinner, ConfirmModal } from "../../components/common";
import { VehiclesTable } from "../../components/tables";
import { vehicleService } from "../../services/vehicleService";
import { Vehicle } from "../../types";
import { mockVehicles } from "../../mockData/mockData";

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Vehicle | null>(null);
  const [toggleConfirm, setToggleConfirm] = useState<Vehicle | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        // Using hardcoded mock data for frontend testing
        setVehicles(mockVehicles);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch vehicles",
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleDeleteClick = (vehicle: Vehicle) => {
    setDeleteConfirm(vehicle);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await vehicleService.deleteVehicle(deleteConfirm.id);
      setVehicles(vehicles.filter((v) => v.id !== deleteConfirm.id));
      if (selectedVehicle?.id === deleteConfirm.id) {
        setSelectedVehicle(null);
      }
      setDeleteConfirm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete vehicle");
      console.error(err);
    }
  };

  const handleToggleActive = (vehicle: Vehicle) => {
    setToggleConfirm(vehicle);
  };

  const handleConfirmToggle = async () => {
    if (!toggleConfirm) return;
    try {
      const updated = await vehicleService.toggleVehicleActive(
        toggleConfirm.id,
      );
      setVehicles(
        vehicles.map((v) => (v.id === toggleConfirm.id ? updated : v)),
      );
      if (selectedVehicle?.id === toggleConfirm.id) {
        setSelectedVehicle(updated);
      }
      setToggleConfirm(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to toggle vehicle status",
      );
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
          Vehicles Management
        </h1>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Total Vehicles:{" "}
          <span className="font-bold text-lg">{vehicles.length}</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <VehiclesTable
          vehicles={vehicles}
          loading={loading}
          selectedId={selectedVehicle?.id}
          onSelect={setSelectedVehicle}
          onDelete={handleDeleteClick}
          onToggleActive={handleToggleActive}
        />
      </div>

      {selectedVehicle && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedVehicle.make} {selectedVehicle.model}
              </h2>
              <p className="text-sm text-gray-500">
                Vehicle ID: {selectedVehicle.id}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleToggleActive(selectedVehicle)}
                className={`px-3 py-1 rounded hover:opacity-80 transition-colors text-sm font-medium text-white ${
                  selectedVehicle.isActive
                    ? "bg-yellow-600 hover:bg-yellow-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {selectedVehicle.isActive ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={() => handleDeleteClick(selectedVehicle)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Status
                </h3>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    selectedVehicle.isActive
                      ? "bg-green-100 text-green-800 dark:bg-green-900"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900"
                  }`}
                >
                  {selectedVehicle.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Year
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {selectedVehicle.year}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Color
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {selectedVehicle.color}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Price Per Km
                </h3>
                <p className="text-gray-900 dark:text-white font-semibold">
                  ${selectedVehicle.pricePerKm}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Make
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {selectedVehicle.make}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Model
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {selectedVehicle.model}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Furniture Capacity
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {selectedVehicle.canCarryFurniture ? "Yes" : "No"}
                </p>
              </div>

              {selectedVehicle.licensePlate && (
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    License Plate
                  </h3>
                  <p className="text-gray-900 dark:text-white font-mono">
                    {selectedVehicle.licensePlate}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <ConfirmModal
          title="Delete Vehicle"
          message={`Are you sure you want to delete ${deleteConfirm.make} ${deleteConfirm.model}? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteConfirm(null)}
          confirmText="Delete"
          confirmVariant="danger"
        />
      )}

      {toggleConfirm && (
        <ConfirmModal
          title={
            toggleConfirm.isActive ? "Deactivate Vehicle" : "Activate Vehicle"
          }
          message={`Are you sure you want to ${
            toggleConfirm.isActive ? "deactivate" : "activate"
          } ${toggleConfirm.make} ${toggleConfirm.model}?`}
          onConfirm={handleConfirmToggle}
          onCancel={() => setToggleConfirm(null)}
          confirmText={toggleConfirm.isActive ? "Deactivate" : "Activate"}
        />
      )}
    </div>
  );
}
