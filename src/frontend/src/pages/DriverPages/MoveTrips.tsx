import { useState, useEffect } from "react";
import { LoadingSpinner, StatusBadge } from "../../components/common";
import { MoveTripTable } from "../../components/tables";
import { tripService } from "../../services/tripService";
import { MoveTrip } from "../../types";
import { mockMoveTrips } from "../../mockData/mockData";

export default function DriverMoveTrips() {
  const [trips, setTrips] = useState<MoveTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<MoveTrip | null>(null);

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

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Move Trips
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
          onDelete={() => {}}
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Move Offer
                </h3>
                <p className="text-gray-900 dark:text-white font-medium">
                  Offer #{selectedTrip.moveOfferId}
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

              {selectedTrip.moveOffer && (
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Offer Price
                  </h3>
                  <p className="text-gray-900 dark:text-white font-semibold text-lg">
                    ${selectedTrip.moveOffer.price}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
