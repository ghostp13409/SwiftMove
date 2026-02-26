import { useState, useEffect } from "react";
import { LoadingSpinner, ConfirmModal } from "../../components/common";
import { UsersTable } from "../../components/tables";
import { clientService } from "../../services/clientService";
import { Client } from "../../types";
import { mockClients } from "../../mockData/mockData";

export default function AdminClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        // Using hardcoded mock data for frontend testing
        setClients(mockClients);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch clients",
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleDeleteClick = (client: Client) => {
    setDeleteConfirm(client);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await clientService.deleteClient(deleteConfirm.id);
      setClients(clients.filter((c) => c.id !== deleteConfirm.id));
      if (selectedClient?.id === deleteConfirm.id) {
        setSelectedClient(null);
      }
      setDeleteConfirm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete client");
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
          Clients Management
        </h1>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Total Clients:{" "}
          <span className="font-bold text-lg">{clients.length}</span>
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

        {/* Clients Table */}
        <UsersTable
          users={clients}
          loading={loading}
          selectedId={selectedClient?.id}
          onSelect={setSelectedClient}
          onDelete={handleDeleteClick}
        />
      </div>

      {/* Client Details Panel */}
      {selectedClient && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedClient.firstName} {selectedClient.lastName}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Client ID: {selectedClient.id}
              </p>
            </div>
            <button
              onClick={() => handleDeleteClick(selectedClient)}
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
                  {selectedClient.firstName}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Last Name
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {selectedClient.lastName}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Email
                </h3>
                <p className="text-gray-900 dark:text-white break-all">
                  {selectedClient.email}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Username
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {selectedClient.userName}
                </p>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              {selectedClient.dob && (
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Date of Birth
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(selectedClient.dob).toLocaleDateString()}
                  </p>
                </div>
              )}

              {selectedClient.createdAt && (
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Client Since
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(selectedClient.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}

              {selectedClient.updatedAt && (
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Last Updated
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(selectedClient.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Address Information */}
          {selectedClient.address && (
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
                    {selectedClient.address.line1}
                    {selectedClient.address.line2 &&
                      `, ${selectedClient.address.line2}`}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">
                    City
                  </span>
                  <p className="text-gray-900 dark:text-white">
                    {selectedClient.address.city}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">
                    State/Province
                  </span>
                  <p className="text-gray-900 dark:text-white">
                    {selectedClient.address.stateOrProvince}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">
                    Country
                  </span>
                  <p className="text-gray-900 dark:text-white">
                    {selectedClient.address.country}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium text-gray-600 dark:text-gray-400">
                    Postal Code
                  </span>
                  <p className="text-gray-900 dark:text-white">
                    {selectedClient.address.postalOrZipCode}
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
          title="Delete Client"
          message={`Are you sure you want to delete ${deleteConfirm.firstName} ${deleteConfirm.lastName} (${deleteConfirm.email})? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteConfirm(null)}
          confirmText="Delete"
        />
      )}
    </div>
  );
}
