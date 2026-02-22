import { useState, useMemo } from "react";
import { useFormValidation } from "../../hooks/useFormValidation";
import { luggageService } from "../../services/luggageService";
import { addressService } from "../../services/addressService";
import { LuggageTypeInfo, LuggageEntry } from "../../types";
import { LoadingSpinner } from "../common/LoadingSpinner";

interface MoveRequestFormProps {
  onSubmit: (data: MoveRequestFormData) => Promise<void>;
  initialData?: Partial<MoveRequestFormData>;
  isLoading?: boolean;
}

export interface MoveRequestFormData {
  fromAddressId: string | number;
  toAddressId: string | number;
  moveDate: string;
  maxBudget: number;
  luggageEntries: Array<{
    quantity: number;
    luggageTypeId: string | number;
  }>;
}

interface FormState extends MoveRequestFormData {
  fromAddress?: string;
  toAddress?: string;
}

export const MoveRequestForm: React.FC<MoveRequestFormProps> = ({
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const [luggageTypes, setLuggageTypes] = useState<LuggageTypeInfo[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const initialFormData: FormState = {
    fromAddressId: initialData?.fromAddressId || "",
    toAddressId: initialData?.toAddressId || "",
    moveDate: initialData?.moveDate || "",
    maxBudget: initialData?.maxBudget || 0,
    luggageEntries: initialData?.luggageEntries || [
      { quantity: 0, luggageTypeId: "" },
    ],
  };

  const { values, errors, handleChange, setFieldValue, reset } =
    useFormValidation(initialFormData, {
      fromAddressId: (val) => (!val ? "From address is required" : undefined),
      toAddressId: (val) => (!val ? "To address is required" : undefined),
      moveDate: (val) => (!val ? "Move date is required" : undefined),
      maxBudget: (val) =>
        !val || val <= 0 ? "Budget must be greater than 0" : undefined,
    });

  // Load luggage types and addresses
  useMemo(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        const [luggage, addrs] = await Promise.all([
          luggageService.getAllLuggageTypes(),
          addressService.getAllAddresses(),
        ]);
        setLuggageTypes(luggage);
        setAddresses(addrs);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
        console.error(err);
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, []);

  const handleAddLuggage = () => {
    const newEntries = [
      ...values.luggageEntries,
      { quantity: 0, luggageTypeId: "" },
    ];
    setFieldValue("luggageEntries", newEntries);
  };

  const handleRemoveLuggage = (index: number) => {
    const newEntries = values.luggageEntries.filter((_, i) => i !== index);
    setFieldValue("luggageEntries", newEntries);
  };

  const handleLuggageChange = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const newEntries = [...values.luggageEntries];
    newEntries[index] = {
      ...newEntries[index],
      [field]: field === "quantity" ? parseInt(String(value)) : value,
    };
    setFieldValue("luggageEntries", newEntries);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Validate form
    if (
      !values.fromAddressId ||
      !values.toAddressId ||
      !values.moveDate ||
      values.maxBudget <= 0
    ) {
      setSubmitError("Please fill in all required fields");
      return;
    }

    try {
      await onSubmit({
        fromAddressId: values.fromAddressId,
        toAddressId: values.toAddressId,
        moveDate: values.moveDate,
        maxBudget: values.maxBudget,
        luggageEntries: values.luggageEntries.filter((e) => e.quantity > 0),
      });
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

      {/* Address Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            From Address <span className="text-red-500">*</span>
          </label>
          <select
            name="fromAddressId"
            value={values.fromAddressId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select from address</option>
            {addresses.map((addr) => (
              <option key={addr.id} value={addr.id}>
                {addr.line1}, {addr.city}
              </option>
            ))}
          </select>
          {errors.fromAddressId && (
            <p className="text-red-500 text-sm mt-1">{errors.fromAddressId}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            To Address <span className="text-red-500">*</span>
          </label>
          <select
            name="toAddressId"
            value={values.toAddressId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select to address</option>
            {addresses.map((addr) => (
              <option key={addr.id} value={addr.id}>
                {addr.line1}, {addr.city}
              </option>
            ))}
          </select>
          {errors.toAddressId && (
            <p className="text-red-500 text-sm mt-1">{errors.toAddressId}</p>
          )}
        </div>
      </div>

      {/* Date and Budget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Move Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="moveDate"
            value={values.moveDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.moveDate && (
            <p className="text-red-500 text-sm mt-1">{errors.moveDate}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Max Budget <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-600 dark:text-gray-400">
              $
            </span>
            <input
              type="number"
              name="maxBudget"
              value={values.maxBudget}
              onChange={handleChange}
              min="0"
              step="1"
              className="w-full pl-7 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {errors.maxBudget && (
            <p className="text-red-500 text-sm mt-1">{errors.maxBudget}</p>
          )}
        </div>
      </div>

      {/* Luggage Items */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Luggage Items
          </label>
          <button
            type="button"
            onClick={handleAddLuggage}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            + Add Luggage
          </button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {values.luggageEntries.map((entry, index) => (
            <div key={index} className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Type
                </label>
                <select
                  value={entry.luggageTypeId}
                  onChange={(e) =>
                    handleLuggageChange(index, "luggageTypeId", e.target.value)
                  }
                  className="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select type</option>
                  {luggageTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-24">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Qty
                </label>
                <input
                  type="number"
                  value={entry.quantity}
                  onChange={(e) =>
                    handleLuggageChange(
                      index,
                      "quantity",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  min="0"
                  className="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {values.luggageEntries.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveLuggage(index)}
                  className="px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
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
          {isLoading ? "Submitting..." : "Submit Request"}
        </button>
      </div>
    </form>
  );
};
