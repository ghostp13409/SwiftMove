import { useState, useEffect } from "react";
import {
  LoadingSpinner,
  StatusBadge,
  ConfirmModal,
} from "../../components/common";
import { MoveTripTable } from "../../components/tables";
import { tripService } from "../../services/tripService";
import { MoveTrip } from "../../types";
import { mockMoveTrips } from "../../mockData/mockData";

export default function AdminMoveTrips() {
  const [trips, setTrips] = useState<MoveTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<MoveTrip | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<MoveTrip | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        // Using hardcoded mock data for frontend testing
        setTrips(mockMoveTrips);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch move trips",
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const handleDeleteClick = (trip: MoveTrip) => {
    setDeleteConfirm(trip);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await tripService.deleteTrip(deleteConfirm.id);
      setTrips(trips.filter((t) => t.id !== deleteConfirm.id));
      if (selectedTrip?.id === deleteConfirm.id) {
        setSelectedTrip(null);
      }
      setDeleteConfirm(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete move trip",
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
          Move Trips Management
        </h1>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Total Trips: <span className="font-bold text-lg">{trips.length}</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <MoveTripTable
          trips={trips}
          loading={loading}
          selectedId={selectedTrip?.id}
          onSelect={setSelectedTrip}
          onDelete={handleDeleteClick}
        />
      </div>

      {selectedTrip && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Move Trip #{selectedTrip.id}
              </h2>
              <StatusBadge status={selectedTrip.status || "PENDING"} />
            </div>
            <button
              onClick={() => handleDeleteClick(selectedTrip)}
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
                  {selectedTrip.driver?.firstName}{" "}
                  {selectedTrip.driver?.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  {selectedTrip.driver?.email}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Start Time
                </h3>
                {selectedTrip.startTime ? (
                  <div>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(selectedTrip.startTime).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(selectedTrip.startTime).toLocaleTimeString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500">Not started</p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Status
                </h3>
                <StatusBadge status={selectedTrip.status || "PENDING"} />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Move Request
                </h3>
                <p className="text-gray-900 dark:text-white font-medium">
                  Request #{selectedTrip.moveRequestId}
                </p>
                {selectedTrip.moveRequest && (
                  <p className="text-xs text-gray-500">
                    {new Date(
                      selectedTrip.moveRequest.moveDate,
                    ).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  End Time
                </h3>
                {selectedTrip.endTime ? (
                  <div>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(selectedTrip.endTime).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(selectedTrip.endTime).toLocaleTimeString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500">Not completed</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <ConfirmModal
          title="Delete Move Trip"
          message={`Are you sure you want to delete move trip #${deleteConfirm.id}? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteConfirm(null)}
          confirmText="Delete"
          confirmVariant="danger"
        />
      )}
    </div>
  );
}
