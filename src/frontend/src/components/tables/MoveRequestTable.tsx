import { useState } from "react";
import { StatusBadge } from "../common/StatusBadge";

interface MoveRequest {
  id: string | number;
  fromAddress?: { line1: string; city: string };
  toAddress?: { line1: string; city: string };
  moveDate: string;
  maxBudget: number;
  status: string;
  createdAt?: string;
}

interface MoveRequestTableProps {
  requests: MoveRequest[];
  loading?: boolean;
  onSelect?: (request: MoveRequest) => void;
  onEdit?: (request: MoveRequest) => void;
  onDelete?: (id: string | number) => void;
  selectedId?: string | number;
}

export const MoveRequestTable: React.FC<MoveRequestTableProps> = ({
  requests,
  loading = false,
  onSelect,
  onEdit,
  onDelete,
  selectedId,
}) => {
  const [sortBy, setSortBy] = useState<"date" | "budget" | "status">("date");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const filteredRequests = filterStatus
    ? requests.filter(
        (r) => r.status.toLowerCase() === filterStatus.toLowerCase(),
      )
    : requests;

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.moveDate).getTime() - new Date(a.moveDate).getTime();
      case "budget":
        return b.maxBudget - a.maxBudget;
      case "status":
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  const uniqueStatuses = Array.from(new Set(requests.map((r) => r.status)));

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
            All ({requests.length})
          </button>
          {uniqueStatuses.map((status) => {
            const count = requests.filter((r) => r.status === status).length;
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
          <option value="budget">Sort by Budget</option>
          <option value="status">Sort by Status</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        {loading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            Loading move requests...
          </div>
        ) : sortedRequests.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No move requests found
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                  From
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                  To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                  Budget
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
              {sortedRequests.map((request) => (
                <tr
                  key={request.id}
                  onClick={() => onSelect?.(request)}
                  className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                    selectedId === request.id
                      ? "bg-blue-50 dark:bg-blue-900"
                      : ""
                  }`}
                >
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                    #{request.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {request.fromAddress?.line1 || "N/A"}
                    <br />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {request.fromAddress?.city}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {request.toAddress?.line1 || "N/A"}
                    <br />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {request.toAddress?.city}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {new Date(request.moveDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    ${request.maxBudget}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <StatusBadge status={request.status} />
                  </td>
                  {(onEdit || onDelete) && (
                    <td className="px-6 py-4 text-sm space-x-2">
                      {onEdit && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(request);
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
                              onDelete(request.id);
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
