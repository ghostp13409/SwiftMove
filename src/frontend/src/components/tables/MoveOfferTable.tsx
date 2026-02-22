import { useState, useMemo } from "react";
import { StatusBadge } from "../common/StatusBadge";
import { MoveOffer } from "../../types/move-offer";

interface MoveOfferTableProps {
  offers: MoveOffer[];
  loading?: boolean;
  onSelect?: (offer: MoveOffer) => void;
  onEdit?: (offer: MoveOffer) => void;
  onDelete?: (id: string | number) => void;
  onAccept?: (id: string | number) => void;
  selectedId?: string | number;
}

export const MoveOfferTable: React.FC<MoveOfferTableProps> = ({
  offers,
  loading = false,
  onSelect,
  onEdit,
  onDelete,
  onAccept,
  selectedId,
}) => {
  const [sortBy, setSortBy] = useState<"date" | "price" | "status">("date");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const filteredOffers = useMemo(() => {
    return filterStatus
      ? offers.filter(
          (o) => o.status?.toLowerCase() === filterStatus.toLowerCase(),
        )
      : offers;
  }, [offers, filterStatus]);

  const sortedOffers = useMemo(() => {
    return [...filteredOffers].sort((a, b) => {
      switch (sortBy) {
        case "date":
          return (
            new Date(b.offeredDate).getTime() -
            new Date(a.offeredDate).getTime()
          );
        case "price":
          return b.price - a.price;
        case "status":
          return (a.status || "").localeCompare(b.status || "");
        default:
          return 0;
      }
    });
  }, [filteredOffers, sortBy]);

  const uniqueStatuses = useMemo(
    () => Array.from(new Set(offers.map((o) => o.status).filter(Boolean))),
    [offers],
  );

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
            All ({offers.length})
          </button>
          {uniqueStatuses.map((status) => {
            const count = offers.filter((o) => o.status === status).length;
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
          <option value="price">Sort by Price</option>
          <option value="status">Sort by Status</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        {loading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            Loading move offers...
          </div>
        ) : sortedOffers.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No move offers found
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
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                  Offered Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                  Status
                </th>
                {(onEdit || onDelete || onAccept) && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {sortedOffers.map((offer) => (
                <tr
                  key={offer.id}
                  onClick={() => onSelect?.(offer)}
                  className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                    selectedId === offer.id ? "bg-blue-50 dark:bg-blue-900" : ""
                  }`}
                >
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                    #{offer.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {offer.driver?.firstName} {offer.driver?.lastName}
                    <br />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {offer.driver?.email}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {offer.vehicle?.make} {offer.vehicle?.model}
                    <br />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {offer.vehicle?.year}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    ${offer.price}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {new Date(offer.offeredDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <StatusBadge status={offer.status || "PENDING"} />
                  </td>
                  {(onEdit || onDelete || onAccept) && (
                    <td className="px-6 py-4 text-sm space-x-2">
                      {onAccept && offer.status === "PENDING" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAccept(offer.id);
                          }}
                          className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                          Accept
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(offer);
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
                              onDelete(offer.id);
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
