import { useState } from "react";
import { useFormValidation } from "../../hooks/useFormValidation";
import { LoadingSpinner } from "../common/LoadingSpinner";

export interface AddressFormData {
  line1: string;
  line2?: string;
  city: string;
  stateOrProvince: string;
  country: string;
  postalOrZipCode: string;
}

interface AddressFormProps {
  onSubmit: (data: AddressFormData) => Promise<void>;
  initialData?: Partial<AddressFormData>;
  isLoading?: boolean;
  submitButtonText?: string;
}

export const AddressForm: React.FC<AddressFormProps> = ({
  onSubmit,
  initialData,
  isLoading = false,
  submitButtonText = "Save Address",
}) => {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const initialFormData: AddressFormData = {
    line1: initialData?.line1 || "",
    line2: initialData?.line2 || "",
    city: initialData?.city || "",
    stateOrProvince: initialData?.stateOrProvince || "",
    country: initialData?.country || "",
    postalOrZipCode: initialData?.postalOrZipCode || "",
  };

  const { values, errors, handleChange, reset } = useFormValidation(
    initialFormData,
    {
      line1: (val) => (!val ? "Address line 1 is required" : undefined),
      city: (val) => (!val ? "City is required" : undefined),
      stateOrProvince: (val) =>
        !val ? "State/Province is required" : undefined,
      country: (val) => (!val ? "Country is required" : undefined),
      postalOrZipCode: (val) => (!val ? "Postal code is required" : undefined),
    },
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (
      !values.line1 ||
      !values.city ||
      !values.stateOrProvince ||
      !values.country ||
      !values.postalOrZipCode
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      {submitError && (
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200 text-sm">
            {submitError}
          </p>
        </div>
      )}

      {/* Address Line 1 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Address Line 1 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="line1"
          value={values.line1}
          onChange={handleChange}
          placeholder="123 Main Street"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.line1 && (
          <p className="text-red-500 text-sm mt-1">{errors.line1}</p>
        )}
      </div>

      {/* Address Line 2 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Address Line 2
        </label>
        <input
          type="text"
          name="line2"
          value={values.line2}
          onChange={handleChange}
          placeholder="Apt 4B (Optional)"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* City and State */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="city"
            value={values.city}
            onChange={handleChange}
            placeholder="New York"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            State/Province <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="stateOrProvince"
            value={values.stateOrProvince}
            onChange={handleChange}
            placeholder="NY"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.stateOrProvince && (
            <p className="text-red-500 text-sm mt-1">
              {errors.stateOrProvince}
            </p>
          )}
        </div>
      </div>

      {/* Country and Postal Code */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Country <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="country"
            value={values.country}
            onChange={handleChange}
            placeholder="United States"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.country && (
            <p className="text-red-500 text-sm mt-1">{errors.country}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Postal Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="postalOrZipCode"
            value={values.postalOrZipCode}
            onChange={handleChange}
            placeholder="10001"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.postalOrZipCode && (
            <p className="text-red-500 text-sm mt-1">
              {errors.postalOrZipCode}
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-3 justify-end pt-4">
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
          {isLoading ? "Saving..." : submitButtonText}
        </button>
      </div>
    </form>
  );
};
