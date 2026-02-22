import { useAuth } from "../../context/AuthContext";
import {
  LoadingSpinner,
  StatusBadge,
  ConfirmModal,
} from "../../components/common";
import { MoveRequestTable } from "../../components/tables";
import { MoveRequestForm } from "../../components/forms";
import { useState, useEffect } from "react";
import { moveRequestService } from "../../services/moveRequestService";
import { MoveRequest, MoveRequestCreateData } from "../../types";
import { mockMoveRequests } from "../../mockData/mockData";

export default function MoveRequests() {
  const { userId, isLoading: authLoading } = useAuth();
  const [moveRequests, setMoveRequests] = useState<MoveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMove, setSelectedMove] = useState<MoveRequest | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingRequest, setEditingRequest] = useState<MoveRequest | null>(
    null,
  );
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<MoveRequest | null>(null);

  useEffect(() => {
    const fetchMoveRequests = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        // Using hardcoded mock data for frontend testing
        setMoveRequests(mockMoveRequests);
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

    fetchMoveRequests();
  }, [userId]);

  const handleCreateClick = () => {
    setEditingRequest(null);
    setShowForm(true);
  };

  const handleEditClick = (request: MoveRequest) => {
    setEditingRequest(request);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: MoveRequestCreateData) => {
    try {
      setFormLoading(true);
      if (editingRequest) {
        await moveRequestService.updateMoveRequest(editingRequest.id, data);
        setMoveRequests(
          moveRequests.map((r) =>
            r.id === editingRequest.id ? { ...r, ...data } : r,
          ),
        );
      } else {
        if (!userId) throw new Error("User ID not found");
        const newRequest = await moveRequestService.createMoveRequest({
          ...data,
          clientId: userId,
        });
        setMoveRequests([...moveRequests, newRequest]);
      }
      setShowForm(false);
      setEditingRequest(null);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save move request",
      );
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteClick = (request: MoveRequest) => {
    setDeleteConfirm(request);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await moveRequestService.deleteMoveRequest(deleteConfirm.id);
      setMoveRequests(moveRequests.filter((r) => r.id !== deleteConfirm.id));
      if (selectedMove?.id === deleteConfirm.id) {
        setSelectedMove(null);
      }
      setDeleteConfirm(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete move request",
      );
      console.error(err);
    }
  };

  if (authLoading || loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Move Requests
        </h1>
        <button
          onClick={handleCreateClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Create Request
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {editingRequest ? "Edit Move Request" : "Create New Move Request"}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingRequest(null);
              }}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
          <MoveRequestForm
            onSubmit={handleFormSubmit}
            initialData={editingRequest}
            loading={formLoading}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Move Requests List */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-bold text-gray-900 dark:text-white">
              Requests ({moveRequests.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
            {moveRequests.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No move requests found
              </div>
            ) : (
              moveRequests.map((move) => (
                <button
                  key={move.id}
                  onClick={() => setSelectedMove(move)}
                  className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    selectedMove?.id === move.id
                      ? "bg-blue-50 dark:bg-blue-900"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Request #{move.id}
                    </h3>
                    <StatusBadge status={move.status} />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(move.moveDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
                    Budget: ${move.maxBudget}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Move Request Details */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          {selectedMove ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Move Request #{selectedMove.id}
                  </h2>
                  <StatusBadge status={selectedMove.status} />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(selectedMove)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(selectedMove)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    From Address
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {selectedMove.fromAddress?.line1 || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedMove.fromAddress?.city}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    To Address
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {selectedMove.toAddress?.line1 || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedMove.toAddress?.city}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Move Date
                  </h3>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {new Date(selectedMove.moveDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Max Budget
                  </h3>
                  <p className="text-gray-900 dark:text-white font-medium">
                    ${selectedMove.maxBudget}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Luggage Items
                </h3>
                {selectedMove.luggageEntries &&
                selectedMove.luggageEntries.length > 0 ? (
                  <ul className="space-y-1">
                    {selectedMove.luggageEntries.map((entry, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-700 dark:text-gray-300 flex justify-between"
                      >
                        <span>{entry.luggageType?.name || "Unknown"}</span>
                        <span className="font-medium">x{entry.quantity}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No luggage items
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-96 text-gray-500 dark:text-gray-400">
              Select a move request to view details
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
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
