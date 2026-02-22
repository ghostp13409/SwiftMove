import { useState, useEffect } from "react";
import {
  LoadingSpinner,
  StatusBadge,
  ConfirmModal,
} from "../../components/common";
import { MoveOfferTable } from "../../components/tables";
import { moveOfferService } from "../../services/moveOfferService";
import { MoveOffer } from "../../types";
import { mockMoveOffers } from "../../mockData/mockData";

export default function AdminMoveOffers() {
  const [offers, setOffers] = useState<MoveOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<MoveOffer | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<MoveOffer | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        // Using hardcoded mock data for frontend testing
        setOffers(mockMoveOffers);
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

    fetchOffers();
  }, []);

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

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Move Offers Management
        </h1>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Total Offers:{" "}
          <span className="font-bold text-lg">{offers.length}</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <MoveOfferTable
          offers={offers}
          loading={loading}
          selectedId={selectedOffer?.id}
          onSelect={setSelectedOffer}
          onDelete={handleDeleteClick}
        />
      </div>

      {selectedOffer && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Move Offer #{selectedOffer.id}
              </h2>
              <StatusBadge status={selectedOffer.status || "PENDING"} />
            </div>
            <button
              onClick={() => handleDeleteClick(selectedOffer)}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Delete
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Driver
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {selectedOffer.driver?.firstName}{" "}
                  {selectedOffer.driver?.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  {selectedOffer.driver?.email}
                </p>
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
                {selectedOffer.vehicle && (
                  <div>
                    <p className="text-gray-900 dark:text-white">
                      {selectedOffer.vehicle.make} {selectedOffer.vehicle.model}
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedOffer.vehicle.year} (
                      {selectedOffer.vehicle.color})
                    </p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Move Request
                </h3>
                <p className="text-gray-900 dark:text-white font-medium">
                  Request #{selectedOffer.moveRequestId}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Status
                </h3>
                <StatusBadge status={selectedOffer.status || "PENDING"} />
              </div>
            </div>
          </div>
        </div>
      )}

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
