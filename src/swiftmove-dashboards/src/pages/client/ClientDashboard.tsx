import { useEffect, useState } from "react";
import { FileText, Route, DollarSign, Clock } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import StatusBadge from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { clientService } from "@/services/clientService";
import { moveOfferService } from "@/services/moveOfferService";
import { tripService } from "@/services/tripService";
import type {
  MoveRequest,
  MoveOffer,
  MoveTrip,
  MoveRequestPopulated,
  MoveOfferPopulated,
} from "@/types";
import { moveRequestService } from "@/services/moveRequestService";
import { populationFactory } from "@/services/populationFactory";
import { getVehicleString } from "@/utils";

const ClientDashboard = () => {
  const { userId, name } = useAuth();
  const [myRequests, setMyRequests] = useState<MoveRequestPopulated[]>([]);
  const [myOffers, setMyOffers] = useState<MoveOfferPopulated[]>([]);
  const [myTrips, setMyTrips] = useState<MoveTrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const displayName = name?.split(" ")[0] || "there";

  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      try {
        // Fetch client's move requests and trips in parallel
        const [reqData, tripData] = await Promise.all([
          moveRequestService.getActiveRequests(),
          tripService.getTripsByClient(userId),
        ]);

        const populatedReqData = await Promise.all(
          reqData.map((req) => populationFactory.populateMoveRequest(req)),
        );
        setMyRequests(populatedReqData);
        setMyTrips(tripData);

        // Fetch offers for each request
        if (reqData.length > 0) {
          const offersResults = await Promise.allSettled(
            reqData.map((r) => moveOfferService.getOffersByMoveRequest(r.id)),
          );
          const allOffers = offersResults
            .filter((r) => r.status === "fulfilled")
            .flatMap(
              (r) => (r as PromiseFulfilledResult<MoveOfferPopulated[]>).value,
            );
          setMyOffers(allOffers);
        }
      } catch (err) {
        console.error("Failed to load client dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const pendingRequests = myRequests.filter(
    (r) => r.status === "PENDING",
  ).length;
  // MoveOffer status is OFFER_SENT (not PENDING)
  const activeOffers = myOffers.filter((o) => o.status === "OFFER_SENT").length;
  const scheduledTrips = myTrips.filter((t) => t.status === "SCHEDULED").length;
  // const totalSpent = myTrips
  //   .filter((t) => t.status === "COMPLETED")
  //   .reduce((s, t) => s + (t.price ?? 0), 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {displayName} 👋</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Here's what's happening with your moves
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Requests"
          value={pendingRequests}
          icon={<FileText className="w-4 h-4" />}
          description="Awaiting offers"
        />
        <StatsCard
          title="Pending Offers"
          value={activeOffers}
          icon={<Clock className="w-4 h-4" />}
          description="Review & accept"
        />
        <StatsCard
          title="Upcoming Trips"
          value={scheduledTrips}
          icon={<Route className="w-4 h-4" />}
          description="Scheduled moves"
        />
        {/* <StatsCard
          title="Total Spent"
          value={`$${totalSpent.toLocaleString()}`}
          icon={<DollarSign className="w-4 h-4" />}
          description="Completed trips"
        /> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Recent Move Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {myRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No active move requests.
              </p>
            ) : (
              myRequests.slice(0, 3).map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {req.fromAddress?.city || "—"} →{" "}
                      {req.toAddress?.city || "—"}
                    </p>
                    {/* <p className="text-xs text-muted-foreground">
                      {req.moveDate?.toLocaleDateString()} · Budget: $
                      {req.maxBudget}
                    </p> */}
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={req.status} />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Latest Offers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {myOffers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No offers yet.</p>
            ) : (
              myOffers.slice(0, 3).map((offer) => (
                <div
                  key={offer.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {offer.driver.user.firstName ||
                        `Driver #${offer.driverId}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getVehicleString(offer.vehicle) ||
                        `Vehicle #${offer.vehicleId}`}{" "}
                      · ${offer.price}
                    </p>
                  </div>
                  <StatusBadge status={offer.status} />
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboard;
