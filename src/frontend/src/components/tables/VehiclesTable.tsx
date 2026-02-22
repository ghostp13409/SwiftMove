import { useState } from "react";

interface Vehicle {
  id: string | number;
  make: string;
  model: string;
  year: number;
  licensePlate?: string;
  pricePerKm: number;
  canCarryFurniture: boolean;
  vehicleType?: { type: string; volume: number; maxWeight: number };
  isActive?: boolean;
}

interface VehiclesTableProps {
  vehicles: Vehicle[];
  loading?: boolean;
  onSelect?: (vehicle: Vehicle) => void;
  onEdit?: (vehicle: Vehicle) => void;
  onDelete?: (id: string | number) => void;
  onToggleActive?: (id: string | number, isActive: boolean) => void;
  selectedId?: string | number;
}

export const VehiclesTable: React.FC<VehiclesTableProps> = ({
  vehicles,
  loading = false,
  onSelect,
  onEdit,
  onDelete,
  onToggleActive,
  selectedId,
}) => {
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.licensePlate?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesActive =
      filterActive !== null ? vehicle.isActive === filterActive : true;

    return matchesSearch && matchesActive;
  });

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 max-w-xs">
          <input
            type="text"
            placeholder="Search by make, model, or plate..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilterActive(null)}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              filterActive === null
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterActive(true)}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              filterActive === true
                ? "bg-green-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilterActive(false)}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              filterActive === false
                ? "bg-gray-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            }`}
          >
            Inactive
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        {loading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            Loading vehicles...
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No vehicles found
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                  License Plate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                  Price/KM
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                  Furniture
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                  Status
                </th>
                {(onEdit || onDelete || onToggleActive) && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map((vehicle) => (
                <tr
                  key={vehicle.id}
                  onClick={() => onSelect?.(vehicle)}
                  className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                    selectedId === vehicle.id
                      ? "bg-blue-50 dark:bg-blue-900"
                      : ""
                  }`}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 font-mono">
                    {vehicle.licensePlate || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {vehicle.vehicleType?.type || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    ${vehicle.pricePerKm}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {vehicle.canCarryFurniture ? (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs">
                        Yes
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-xs">
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {vehicle.isActive ? (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-xs">
                        Inactive
                      </span>
                    )}
                  </td>
                  {(onEdit || onDelete || onToggleActive) && (
                    <td className="px-6 py-4 text-sm space-x-2">
                      {onToggleActive && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleActive(vehicle.id, !vehicle.isActive);
                          }}
                          className={`px-2 py-1 text-xs rounded transition-colors ${
                            vehicle.isActive
                              ? "bg-yellow-600 text-white hover:bg-yellow-700"
                              : "bg-green-600 text-white hover:bg-green-700"
                          }`}
                        >
                          {vehicle.isActive ? "Deactivate" : "Activate"}
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(vehicle);
                          }}
                          className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (
                              confirm(
                                "Are you sure you want to delete this vehicle?",
                              )
                            ) {
                              onDelete(vehicle.id);
                            }
                          }}
                          className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
