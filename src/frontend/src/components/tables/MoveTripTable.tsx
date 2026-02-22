import { useState, useMemo } from "react";
import { StatusBadge } from "../common/StatusBadge";
import { MoveTrip } from "../../types/trip";

interface MoveTripTableProps {
  trips: MoveTrip[];
  loading?: boolean;
  onSelect?: (trip: MoveTrip) => void;
  onEdit?: (trip: MoveTrip) => void;
  onDelete?: (id: string | number) => void;
  selectedId?: string | number;
}

export const MoveTripTable: React.FC<MoveTripTableProps> = ({
  trips,
  loading = false,
  onSelect,
  onEdit,
  onDelete,
  selectedId,
}) => {
  const [sortBy, setSortBy] = useState<"date" | "status">("date");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const filteredTrips = useMemo(() => {
    return filterStatus
      ? trips.filter(
          (t) => t.status?.toLowerCase() === filterStatus.toLowerCase(),
        )
      : trips;
  }, [trips, filterStatus]);

  const sortedTrips = useMemo(() => {
    return [...filteredTrips].sort((a, b) => {
      switch (sortBy) {
        case "date":
          return (
            new Date(b.startTime || "").getTime() -
            new Date(a.startTime || "").getTime()
          );
        case "status":
          return (a.status || "").localeCompare(b.status || "");
        default:
          return 0;
      }
    });
  }, [filteredTrips, sortBy]);

  const uniqueStatuses = useMemo(
    () => Array.from(new Set(trips.map((t) => t.status).filter(Boolean))),
    [trips],
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleTimeString();
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterStatus(null)}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              filterStatus === null
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            }`}
          >
            All ({trips.length})
          </button>
          {uniqueStatuses.map((status) => {
            const count = trips.filter((t) => t.status === status).length;
            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  filterStatus === status
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                }`}
              >
                {status} ({count})
              </button>
            );
          })}
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white text-sm"
        >
          <option value="date">Sort by Date</option>
          <option value="status">Sort by Status</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        {loading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            Loading move trips...
          </div>
        ) : sortedTrips.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No move trips found
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                  Driver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                  Move Request
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                  Start Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                  End Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                  Status
                </th>
                {(onEdit || onDelete) && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {sortedTrips.map((trip) => (
                <tr
                  key={trip.id}
                  onClick={() => onSelect?.(trip)}
                  className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                    selectedId === trip.id ? "bg-blue-50 dark:bg-blue-900" : ""
                  }`}
                >
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                    #{trip.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {trip.driver?.firstName} {trip.driver?.lastName}
                    <br />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {trip.driver?.email}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    Request #{trip.moveRequestId}
                    <br />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {trip.moveRequest?.moveDate &&
                        formatDate(trip.moveRequest.moveDate)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {trip.startTime ? (
                      <>
                        {formatDate(trip.startTime)}
                        <br />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTime(trip.startTime)}
                        </span>
                      </>
                    ) : (
                      "Not started"
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {trip.endTime ? (
                      <>
                        {formatDate(trip.endTime)}
                        <br />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTime(trip.endTime)}
                        </span>
                      </>
                    ) : (
                      "Not completed"
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <StatusBadge status={trip.status || "PENDING"} />
                  </td>
                  {(onEdit || onDelete) && (
                    <td className="px-6 py-4 text-sm space-x-2">
                      {onEdit && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(trip);
                          }}
                          className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("Are you sure?")) {
                              onDelete(trip.id);
                            }
                          }}
                          className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
