import { useState, useMemo } from "react";
import { useFormValidation } from "../../hooks/useFormValidation";
import { vehicleService } from "../../services/vehicleService";
import { VehicleType } from "../../types";
import { LoadingSpinner } from "../common/LoadingSpinner";

interface VehicleFormProps {
  onSubmit: (data: VehicleFormData) => Promise<void>;
  initialData?: Partial<VehicleFormData>;
  isLoading?: boolean;
}

export interface VehicleFormData {
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate?: string;
  pricePerKm: number;
  canCarryFurniture: boolean;
  vehicleTypeId: string | number;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const initialFormData: VehicleFormData = {
    make: initialData?.make || "",
    model: initialData?.model || "",
    year: initialData?.year || new Date().getFullYear(),
    color: initialData?.color || "",
    licensePlate: initialData?.licensePlate || "",
    pricePerKm: initialData?.pricePerKm || 0,
    canCarryFurniture: initialData?.canCarryFurniture || false,
    vehicleTypeId: initialData?.vehicleTypeId || "",
  };

  const { values, errors, handleChange, setFieldValue, reset } =
    useFormValidation(initialFormData, {
      make: (val) => (!val ? "Make is required" : undefined),
      model: (val) => (!val ? "Model is required" : undefined),
      year: (val) => {
        const numVal = Number(val);
        if (!numVal || numVal < 1900 || numVal > new Date().getFullYear() + 1) {
          return (
            "Year must be between 1900 and " + (new Date().getFullYear() + 1)
          );
        }
        return undefined;
      },
      color: (val) => (!val ? "Color is required" : undefined),
      pricePerKm: (val) =>
        !val || Number(val) <= 0
          ? "Price per km must be greater than 0"
          : undefined,
      vehicleTypeId: (val) => (!val ? "Vehicle type is required" : undefined),
    });

  // Load vehicle types
  useMemo(() => {
    const loadTypes = async () => {
      try {
        setLoadingData(true);
        const types = await vehicleService.getVehicleTypes();
        setVehicleTypes(types);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load vehicle types",
        );
        console.error(err);
      } finally {
        setLoadingData(false);
      }
    };
    loadTypes();
  }, []);

  const selectedType = vehicleTypes.find((t) => t.id === values.vehicleTypeId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (
      !values.make ||
      !values.model ||
      !values.year ||
      !values.color ||
      !values.vehicleTypeId ||
      values.pricePerKm <= 0
    ) {
      setSubmitError("Please fill in all required fields");
      return;
    }

    try {
      await onSubmit(values);
      reset();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to submit form",
      );
    }
  };

  if (loadingData) {
    return <LoadingSpinner />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}

      {submitError && (
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200 text-sm">
            {submitError}
          </p>
        </div>
      )}

      {/* Make and Model */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Make <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="make"
            value={values.make}
            onChange={handleChange}
            placeholder="e.g., Toyota"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.make && (
            <p className="text-red-500 text-sm mt-1">{errors.make}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Model <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="model"
            value={values.model}
            onChange={handleChange}
            placeholder="e.g., Camry"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.model && (
            <p className="text-red-500 text-sm mt-1">{errors.model}</p>
          )}
        </div>
      </div>

      {/* Year and Color */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Year <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="year"
            value={values.year}
            onChange={handleChange}
            min="1900"
            max={new Date().getFullYear() + 1}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.year && (
            <p className="text-red-500 text-sm mt-1">{errors.year}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Color <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="color"
            value={values.color}
            onChange={handleChange}
            placeholder="e.g., Silver"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.color && (
            <p className="text-red-500 text-sm mt-1">{errors.color}</p>
          )}
        </div>
      </div>

      {/* License Plate and Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            License Plate
          </label>
          <input
            type="text"
            name="licensePlate"
            value={values.licensePlate}
            onChange={handleChange}
            placeholder="ABC-1234"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Price per KM <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-600 dark:text-gray-400">
              $
            </span>
            <input
              type="number"
              name="pricePerKm"
              value={values.pricePerKm}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full pl-7 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {errors.pricePerKm && (
            <p className="text-red-500 text-sm mt-1">{errors.pricePerKm}</p>
          )}
        </div>
      </div>

      {/* Vehicle Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Vehicle Type <span className="text-red-500">*</span>
        </label>
        <select
          name="vehicleTypeId"
          value={values.vehicleTypeId}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select vehicle type</option>
          {vehicleTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.type} - Volume: {type.volume} cu ft, Max Weight:{" "}
              {type.maxWeight} lbs
            </option>
          ))}
        </select>
        {errors.vehicleTypeId && (
          <p className="text-red-500 text-sm mt-1">{errors.vehicleTypeId}</p>
        )}

        {selectedType && (
          <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900 rounded text-sm text-blue-800 dark:text-blue-200">
            <p>
              <strong>Type:</strong> {selectedType.type}
            </p>
            <p>
              <strong>Volume:</strong> {selectedType.volume} cubic feet
            </p>
            <p>
              <strong>Max Weight:</strong> {selectedType.maxWeight} lbs
            </p>
          </div>
        )}
      </div>

      {/* Furniture Capability */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="canCarryFurniture"
          name="canCarryFurniture"
          checked={values.canCarryFurniture}
          onChange={handleChange}
          className="w-4 h-4 text-blue-600 rounded cursor-pointer"
        />
        <label
          htmlFor="canCarryFurniture"
          className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
        >
          Can carry furniture (+$2.00 per move)
        </label>
      </div>

      {/* Submit Button */}
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={() => reset()}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading && <LoadingSpinner size="sm" />}
          {isLoading ? "Submitting..." : "Add Vehicle"}
        </button>
      </div>
    </form>
  );
};
