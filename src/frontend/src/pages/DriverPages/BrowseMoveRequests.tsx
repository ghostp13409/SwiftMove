import { useState, useEffect } from "react";
import { LoadingSpinner, StatusBadge } from "../../components/common";
import { MoveRequestTable } from "../../components/tables";
import { moveRequestService } from "../../services/moveRequestService";
import { MoveRequest } from "../../types";
import { mockMoveRequests } from "../../mockData/mockData";

export default function BrowseMoveRequests() {
  const [requests, setRequests] = useState<MoveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<MoveRequest | null>(
    null,
  );
  const [filterStatus, setFilterStatus] = useState<string>("PENDING");

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

  const filteredRequests = requests.filter((r) => r.status === filterStatus);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Browse Move Requests
        </h1>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Available Requests:{" "}
          <span className="font-bold text-lg">{filteredRequests.length}</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filter by Status:
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          >
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Requests List */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-bold text-gray-900 dark:text-white">
              Requests ({filteredRequests.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
            {filteredRequests.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No {filterStatus.toLowerCase()} requests found
              </div>
            ) : (
              filteredRequests.map((request) => (
                <button
                  key={request.id}
                  onClick={() => setSelectedRequest(request)}
                  className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    selectedRequest?.id === request.id
                      ? "bg-blue-50 dark:bg-blue-900"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Request #{request.id}
                    </h3>
                    <StatusBadge status={request.status} />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(request.moveDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
                    Budget: ${request.maxBudget}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Request Details */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          {selectedRequest ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Move Request #{selectedRequest.id}
                  </h2>
                  <StatusBadge status={selectedRequest.status} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    From Address
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {selectedRequest.fromAddress?.line1 || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedRequest.fromAddress?.city}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    To Address
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {selectedRequest.toAddress?.line1 || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedRequest.toAddress?.city}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Move Date
                  </h3>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {new Date(selectedRequest.moveDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Max Budget
                  </h3>
                  <p className="text-gray-900 dark:text-white font-medium">
                    ${selectedRequest.maxBudget}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Luggage Items
                </h3>
                {selectedRequest.luggageEntries &&
                selectedRequest.luggageEntries.length > 0 ? (
                  <ul className="space-y-1">
                    {selectedRequest.luggageEntries.map((entry, idx) => (
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

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Create Offer for This Request
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-96 text-gray-500 dark:text-gray-400">
              Select a request to view details and create an offer
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
