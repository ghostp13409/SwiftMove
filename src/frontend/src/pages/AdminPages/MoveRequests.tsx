import { useState, useEffect } from "react";
import {
  LoadingSpinner,
  StatusBadge,
  ConfirmModal,
} from "../../components/common";
import { MoveRequestTable } from "../../components/tables";
import { moveRequestService } from "../../services/moveRequestService";
import { MoveRequest } from "../../types";
import { mockMoveRequests } from "../../mockData/mockData";

export default function AdminMoveRequests() {
  const [requests, setRequests] = useState<MoveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<MoveRequest | null>(
    null,
  );
  const [deleteConfirm, setDeleteConfirm] = useState<MoveRequest | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        // Using hardcoded mock data for frontend testing
        setRequests(mockMoveRequests);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch move requests",
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleDeleteClick = (request: MoveRequest) => {
    setDeleteConfirm(request);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await moveRequestService.deleteMoveRequest(deleteConfirm.id);
      setRequests(requests.filter((r) => r.id !== deleteConfirm.id));
      if (selectedRequest?.id === deleteConfirm.id) {
        setSelectedRequest(null);
      }
      setDeleteConfirm(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete move request",
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
          Move Requests Management
        </h1>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Total Requests:{" "}
          <span className="font-bold text-lg">{requests.length}</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <MoveRequestTable
          requests={requests}
          loading={loading}
          selectedId={selectedRequest?.id}
          onSelect={setSelectedRequest}
          onDelete={handleDeleteClick}
        />
      </div>

      {selectedRequest && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Move Request #{selectedRequest.id}
              </h2>
              <StatusBadge status={selectedRequest.status} />
            </div>
            <button
              onClick={() => handleDeleteClick(selectedRequest)}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Delete
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  From Address
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {selectedRequest.fromAddress?.line1 || "N/A"}
                </p>
                <p className="text-xs text-gray-500">
                  {selectedRequest.fromAddress?.city}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Move Date
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {new Date(selectedRequest.moveDate).toLocaleDateString()}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Luggage Items
                </h3>
                {selectedRequest.luggageEntries?.length ? (
                  <ul className="space-y-1">
                    {selectedRequest.luggageEntries.map((entry, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-700 dark:text-gray-300"
                      >
                        {entry.quantity}x {entry.luggageType?.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">None</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  To Address
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {selectedRequest.toAddress?.line1 || "N/A"}
                </p>
                <p className="text-xs text-gray-500">
                  {selectedRequest.toAddress?.city}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Max Budget
                </h3>
                <p className="text-gray-900 dark:text-white font-semibold text-lg">
                  ${selectedRequest.maxBudget}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Status
                </h3>
                <StatusBadge status={selectedRequest.status} />
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <ConfirmModal
          title="Delete Move Request"
          message={`Are you sure you want to delete move request #${deleteConfirm.id}? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteConfirm(null)}
          confirmText="Delete"
          confirmVariant="danger"
        />
      )}
    </div>
  );
}
