import { useState, useEffect } from "react";
import { MoveOfferFormData } from "../../types/move-offer";
import { Vehicle } from "../../types/vehicle";
import { vehicleService } from "../../services/vehicleService";
import { LoadingSpinner } from "../common/LoadingSpinner";

interface MoveOfferFormProps {
  moveRequestId: string | number;
  driverId: string | number;
  onSubmit: (data: MoveOfferFormData) => void;
  initialData?: MoveOfferFormData;
  loading?: boolean;
}

export const MoveOfferForm: React.FC<MoveOfferFormProps> = ({
  moveRequestId,
  driverId,
  onSubmit,
  initialData,
  loading = false,
}) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);
  const [vehiclesError, setVehiclesError] = useState<string | null>(null);

  const [formData, setFormData] = useState<MoveOfferFormData>({
    price: initialData?.price || 0,
    vehicleId: initialData?.vehicleId || "",
    offeredDate:
      initialData?.offeredDate || new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setVehiclesLoading(true);
        // In a real app, this would be filtered by driverId
        const allVehicles = await vehicleService.getVehicles();
        setVehicles(allVehicles);
        setVehiclesError(null);
      } catch (error) {
        setVehiclesError("Failed to load vehicles");
        console.error(error);
      } finally {
        setVehiclesLoading(false);
      }
    };

    loadVehicles();
  }, [driverId]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.vehicleId) {
      newErrors.vehicleId = "Vehicle is required";
    }

    if (formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const selectedVehicle = vehicles.find((v) => v.id === formData.vehicleId);

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
    >
      {/* Vehicle Selection */}
      <div>
        <label
          htmlFor="vehicleId"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Vehicle <span className="text-red-500">*</span>
        </label>
        {vehiclesLoading ? (
          <LoadingSpinner />
        ) : vehiclesError ? (
          <p className="text-red-600 dark:text-red-400 text-sm">
            {vehiclesError}
          </p>
        ) : (
          <div className="space-y-2">
            <select
              id="vehicleId"
              name="vehicleId"
              value={formData.vehicleId}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white transition-colors ${
                errors.vehicleId
                  ? "border-red-500 dark:border-red-400"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            >
              <option value="">Select a vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.make} {vehicle.model} ({vehicle.year}) - $
                  {vehicle.pricePerKm}/km
                </option>
              ))}
            </select>
            {errors.vehicleId && (
              <p className="text-red-600 dark:text-red-400 text-sm">
                {errors.vehicleId}
              </p>
            )}

            {/* Vehicle Details Display */}
            {selectedVehicle && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {selectedVehicle.make} {selectedVehicle.model}
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <div>
                    <span className="font-medium">Year:</span>{" "}
                    {selectedVehicle.year}
                  </div>
                  <div>
                    <span className="font-medium">Color:</span>{" "}
                    {selectedVehicle.color}
                  </div>
                  <div>
                    <span className="font-medium">Price/km:</span> $
                    {selectedVehicle.pricePerKm}
                  </div>
                  <div>
                    <span className="font-medium">Furniture:</span>{" "}
                    {selectedVehicle.canCarryFurniture ? "Yes" : "No"}
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Status:</span>{" "}
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs ${
                        selectedVehicle.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                      }`}
                    >
                      {selectedVehicle.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Price */}
      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Offered Price ($) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          step="0.01"
          min="0"
          className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white transition-colors ${
            errors.price
              ? "border-red-500 dark:border-red-400"
              : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          }`}
          placeholder="Enter your quoted price"
        />
        {errors.price && (
          <p className="text-red-600 dark:text-red-400 text-sm mt-1">
            {errors.price}
          </p>
        )}
      </div>

      {/* Offered Date */}
      <div>
        <label
          htmlFor="offeredDate"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Offered Date
        </label>
        <input
          type="date"
          id="offeredDate"
          name="offeredDate"
          value={formData.offeredDate}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading || vehiclesLoading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading
            ? "Submitting..."
            : initialData
              ? "Update Offer"
              : "Submit Offer"}
        </button>
      </div>
    </form>
  );
};
