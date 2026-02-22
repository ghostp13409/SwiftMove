import { useState, useEffect } from "react";
import {
  LoadingSpinner,
  StatusBadge,
  ConfirmModal,
} from "../../components/common";
import { MoveOfferTable } from "../../components/tables";
import { MoveOfferForm } from "../../components/forms";
import { moveOfferService } from "../../services/moveOfferService";
import { moveRequestService } from "../../services/moveRequestService";
import { MoveOffer, MoveOfferFormData, MoveRequest } from "../../types";
import { useAuth } from "../../context/AuthContext";

export default function MoveOffers() {
  const { userId, isLoading: authLoading } = useAuth();
  const [offers, setOffers] = useState<MoveOffer[]>([]);
  const [moveRequests, setMoveRequests] = useState<MoveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<MoveOffer | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState<MoveOffer | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<MoveOffer | null>(null);
  const [selectedRequestId, setSelectedRequestId] = useState<
    string | number | null
  >(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        // Using hardcoded mock data for frontend testing
        const { mockMoveOffers, mockMoveRequests } =
          await import("../../mockData/mockData");
        // Fetch driver's move offers
        setOffers(mockMoveOffers);

        // Fetch all move requests for reference
        setMoveRequests(mockMoveRequests);

        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch move offers",
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleCreateClick = (requestId?: string | number) => {
    if (requestId) {
      setSelectedRequestId(requestId);
    }
    setEditingOffer(null);
    setShowForm(true);
  };

  const handleEditClick = (offer: MoveOffer) => {
    setEditingOffer(offer);
    setSelectedRequestId(offer.moveRequestId);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: MoveOfferFormData) => {
    try {
      setFormLoading(true);
      if (editingOffer) {
        // In a real app, would call updateMoveOffer
        console.log("Update offer:", editingOffer.id, data);
        setOffers(
          offers.map((o) => (o.id === editingOffer.id ? { ...o, ...data } : o)),
        );
      } else {
        if (!userId || !selectedRequestId)
          throw new Error("Missing required data");
        const newOffer = await moveOfferService.createMoveOffer({
          ...data,
          moveRequestId: selectedRequestId,
          driverId: userId,
        });
        setOffers([...offers, newOffer]);
      }
      setShowForm(false);
      setEditingOffer(null);
      setSelectedRequestId(null);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save move offer",
      );
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteClick = (offer: MoveOffer) => {
    setDeleteConfirm(offer);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await moveOfferService.deleteMoveOffer(deleteConfirm.id);
      setOffers(offers.filter((o) => o.id !== deleteConfirm.id));
      if (selectedOffer?.id === deleteConfirm.id) {
        setSelectedOffer(null);
      }
      setDeleteConfirm(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete move offer",
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
          Move Offers
        </h1>
        <button
          onClick={() => handleCreateClick()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Create Offer
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
              {editingOffer ? "Edit Move Offer" : "Create New Move Offer"}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingOffer(null);
                setSelectedRequestId(null);
              }}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-lg"
            >
              ✕
            </button>
          </div>

          {selectedRequestId && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded text-sm">
              <p className="text-blue-800 dark:text-blue-200">
                Move Request ID:{" "}
                <span className="font-semibold">#{selectedRequestId}</span>
              </p>
            </div>
          )}

          {selectedRequestId ? (
            <MoveOfferForm
              moveRequestId={selectedRequestId}
              driverId={userId!}
              onSubmit={handleFormSubmit}
              initialData={editingOffer}
              loading={formLoading}
            />
          ) : (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded">
              <p className="text-yellow-800 dark:text-yellow-200">
                Please select a move request to create an offer
              </p>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Move Requests */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-bold text-gray-900 dark:text-white">
              Available Requests (
              {moveRequests.filter((r) => r.status === "PENDING").length})
            </h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
            {moveRequests.filter((r) => r.status === "PENDING").length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                No pending move requests
              </div>
            ) : (
              moveRequests
                .filter((r) => r.status === "PENDING")
                .map((request) => (
                  <button
                    key={request.id}
                    onClick={() => handleCreateClick(request.id)}
                    className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                        Request #{request.id}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {new Date(request.moveDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Budget: ${request.maxBudget}
                    </p>
                  </button>
                ))
            )}
          </div>
        </div>

        {/* Move Offers List */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <MoveOfferTable
              offers={offers}
              loading={loading}
              selectedId={selectedOffer?.id}
              onSelect={setSelectedOffer}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          </div>
        </div>
      </div>

      {/* Offer Details Panel */}
      {selectedOffer && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Move Offer #{selectedOffer.id}
              </h2>
              <StatusBadge status={selectedOffer.status || "PENDING"} />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEditClick(selectedOffer)}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteClick(selectedOffer)}
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
                  Move Request
                </h3>
                <p className="text-gray-900 dark:text-white font-medium">
                  Request #{selectedOffer.moveRequestId}
                </p>
                {selectedOffer.moveRequest && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(
                      selectedOffer.moveRequest.moveDate,
                    ).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Offered Price
                </h3>
                <p className="text-gray-900 dark:text-white font-semibold text-lg">
                  ${selectedOffer.price}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Offered Date
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {new Date(selectedOffer.offeredDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Vehicle
                </h3>
                {selectedOffer.vehicle ? (
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {selectedOffer.vehicle.make} {selectedOffer.vehicle.model}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedOffer.vehicle.year} (
                      {selectedOffer.vehicle.color})
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">N/A</p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Client
                </h3>
                {selectedOffer.moveRequest?.clientId && (
                  <p className="text-gray-900 dark:text-white">
                    Client #{selectedOffer.moveRequest.clientId}
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Request Budget
                </h3>
                {selectedOffer.moveRequest && (
                  <p className="text-gray-900 dark:text-white font-medium">
                    ${selectedOffer.moveRequest.maxBudget}
                  </p>
                )}
              </div>
            </div>
          </div>

          {selectedOffer.createdAt && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Created: {new Date(selectedOffer.createdAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <ConfirmModal
          title="Delete Move Offer"
          message={`Are you sure you want to delete move offer #${deleteConfirm.id}? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteConfirm(null)}
          confirmText="Delete"
          confirmVariant="danger"
        />
      )}
    </div>
  );
}
