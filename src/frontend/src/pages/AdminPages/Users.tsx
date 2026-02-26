import { useState, useEffect } from "react";
import { LoadingSpinner, ConfirmModal } from "../../components/common";
import { UsersTable } from "../../components/tables";
import { userService } from "../../services/userService";
import { User } from "../../types";
import { mockUsers } from "../../mockData/mockData";

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // Using hardcoded mock data for frontend testing
        setUsers(mockUsers);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch users");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteClick = (user: User) => {
    setDeleteConfirm(user);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await userService.deleteUser(deleteConfirm.id);
      setUsers(users.filter((u) => u.id !== deleteConfirm.id));
      if (selectedUser?.id === deleteConfirm.id) {
        setSelectedUser(null);
      }
      setDeleteConfirm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
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
          Users Management
        </h1>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Total Users: <span className="font-bold text-lg">{users.length}</span>
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

        {/* Users Table */}
        <UsersTable
          users={users}
          loading={loading}
          selectedId={selectedUser?.id}
          onSelect={setSelectedUser}
          onDelete={handleDeleteClick}
        />
      </div>

      {/* User Details Panel */}
      {selectedUser && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedUser.firstName} {selectedUser.lastName}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                User ID: {selectedUser.id}
              </p>
            </div>
            <div className="flex gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium text-white ${
                  selectedUser.role === "ADMIN"
                    ? "bg-red-600"
                    : selectedUser.role === "DRIVER"
                      ? "bg-blue-600"
                      : "bg-green-600"
                }`}
              >
                {selectedUser.role}
              </span>
              {selectedUser.role !== "ADMIN" && (
                <button
                  onClick={() => handleDeleteClick(selectedUser)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Delete
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  First Name
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {selectedUser.firstName}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Last Name
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {selectedUser.lastName}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Email
                </h3>
                <p className="text-gray-900 dark:text-white break-all">
                  {selectedUser.email}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Username
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {selectedUser.userName}
                </p>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Role
                </h3>
                <p className="text-gray-900 dark:text-white font-medium">
                  {selectedUser.role}
                </p>
              </div>

              {selectedUser.dob && (
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Date of Birth
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(selectedUser.dob).toLocaleDateString()}
                  </p>
                </div>
              )}

              {selectedUser.createdAt && (
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Created
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}

              {selectedUser.updatedAt && (
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Last Updated
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(selectedUser.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Address Information */}
          {selectedUser.address && (
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
                    {selectedUser.address.line1}
                    {selectedUser.address.line2 &&
                      `, ${selectedUser.address.line2}`}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">
                    City
                  </span>
                  <p className="text-gray-900 dark:text-white">
                    {selectedUser.address.city}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">
                    State/Province
                  </span>
                  <p className="text-gray-900 dark:text-white">
                    {selectedUser.address.stateOrProvince}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">
                    Country
                  </span>
                  <p className="text-gray-900 dark:text-white">
                    {selectedUser.address.country}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium text-gray-600 dark:text-gray-400">
                    Postal Code
                  </span>
                  <p className="text-gray-900 dark:text-white">
                    {selectedUser.address.postalOrZipCode}
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
          title="Delete User"
          message={`Are you sure you want to delete ${deleteConfirm.firstName} ${deleteConfirm.lastName} (${deleteConfirm.email})? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteConfirm(null)}
          confirmText="Delete"
          confirmVariant="danger"
        />
      )}
    </div>
  );
}
