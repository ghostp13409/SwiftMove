import { FileText, Truck, Route, DollarSign, HandCoins, Loader2, Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import StatsCard from "@/components/StatsCard";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { driverService } from "@/services/driverService";
import { moveRequestService } from "@/services/moveRequestService";
import { moveOfferService } from "@/services/moveOfferService";
import { tripService } from "@/services/tripService";
import { vehicleService } from "@/services/vehicleService";
import { populationFactory } from "@/services/populationFactory";
import { getVehicleString } from "@/utils";

const DriverDashboard = () => {
  const { name, userId } = useAuth();
  const navigate = useNavigate();
  const displayName = name?.split(" ")[0] || "there";

  // Fetch driver info
  const { data: driver, isLoading: isLoadingDriver } = useQuery({
    queryKey: ["driverInfo", userId],
    queryFn: () => driverService.getCurrentDriver(),
    enabled: !!userId,
  });


  const driverId = driver?.id;

  // Fetch available requests
  const { data: pendingRequests = [], isLoading: isLoadingRequests } = useQuery({
    queryKey: ["allRequests"],
    queryFn: async () => {
      const data = await moveRequestService.getAllMoveRequests();
      return data.filter((r) => r.status === "CREATED");
    },
  });

  // Fetch driver offers
  const { data: myOffers = [], isLoading: isLoadingOffers } = useQuery({
    queryKey: ["driverOffers", driverId],
    queryFn: async () => {
      if (!driverId) return [];
      const data = await moveOfferService.getOffersByDriver(driverId);
      return Promise.all(
        data.map((o) => populationFactory.populateMoveOffer(o))
      );
    },
    enabled: !!driverId,
  });

  // Fetch driver trips
  const { data: myTrips = [], isLoading: isLoadingTrips } = useQuery({
    queryKey: ["driverTrips", driverId],
    queryFn: async () => {
      if (!driverId) return [];
      const data = await tripService.getTripsByDriver(driverId);
      return Promise.all(
        data.map((t) => populationFactory.populateMoveTripDetailed(t))
      );
    },
    enabled: !!driverId,
  });

  // Fetch driver vehicles
  const { data: myVehicles = [], isLoading: isLoadingVehicles } = useQuery({
    queryKey: ["driverVehicles", driverId],
    queryFn: () => driverId ? vehicleService.getVehiclesByDriver(driverId) : [],
    enabled: !!driverId,
  });


  const isLoading = isLoadingDriver || isLoadingRequests || isLoadingOffers || isLoadingTrips || isLoadingVehicles;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const activeTripsCount = myTrips.filter((t) => t.status === "SCHEDULED").length;
  const earnings = myTrips
    .filter((t) => t.status === "COMPLETED")
    .reduce((s, t) => s + t.moveOfferPopulated.price, 0);

  return (
    <div className="space-y-6">
      <div className="animate-slide-up animate-stagger-1">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {displayName} 👋</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {pendingRequests.length > 0 
            ? `There are ${pendingRequests.length} new move request${pendingRequests.length > 1 ? 's' : ''} available for offers.`
            : "You're all caught up. Check back soon for new move requests."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 animate-slide-up animate-stagger-2">
        <StatsCard
          title="Available Requests"
          value={pendingRequests.length}
          icon={<FileText className="w-4 h-4" />}
          description="Open for offers"
        />
        <StatsCard
          title="My Offers"
          value={myOffers.length}
          icon={<HandCoins className="w-4 h-4" />}
          description={`${myOffers.filter((o) => o.status === "OFFER_SENT").length} pending`}
        />
        <StatsCard
          title="Active Trips"
          value={activeTripsCount}
          icon={<Route className="w-4 h-4" />}
          description="Upcoming moves"
        />
        <StatsCard
          title="Vehicles"
          value={myVehicles.length}
          icon={<Truck className="w-4 h-4" />}
          description={`${myVehicles.filter((v) => v.isActive).length} active`}
        />
        <StatsCard
          title="Earnings"
          value={`$${earnings.toLocaleString()}`}
          icon={<DollarSign className="w-4 h-4" />}
          description="Completed trips"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up animate-stagger-3">

        <Card className="shadow-card overflow-hidden">
          <CardHeader className="border-b bg-muted/30 py-4">
            <CardTitle className="text-sm font-semibold">Upcoming Trips</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {myTrips.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No upcoming trips"
                description="Browse available move requests and make offers to start earning."
                action={{
                  label: "Browse Requests",
                  onClick: () => navigate("/driver/browse"),
                }}
              />
            ) : (
              <div className="divide-y">
                {myTrips.slice(0, 4).map((trip) => (
                  <div key={trip.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {trip.moveRequestPopulated.fromAddress.city} → {trip.moveRequestPopulated.toAddress.city}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Client: {trip.moveRequestPopulated.client.firstName} {trip.moveRequestPopulated.client.lastName}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-sm">
                        ${trip.moveOfferPopulated.price}
                      </span>
                      <StatusBadge status={trip.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card overflow-hidden">
          <CardHeader className="border-b bg-muted/30 py-4">
            <CardTitle className="text-sm font-semibold">Recent Offers</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {myOffers.length === 0 ? (
              <EmptyState
                icon={Plus}
                title="No offers yet"
                description="You haven't made any offers yet. Add a vehicle to get started."
                action={{
                  label: "Add Vehicle",
                  onClick: () => navigate("/driver/vehicles"),
                }}
              />
            ) : (
              <div className="divide-y">
                {myOffers.slice(0, 4).map((offer) => (
                  <div key={offer.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Request #{offer.moveRequestId}</p>
                      <p className="text-xs text-muted-foreground">
                        {getVehicleString(offer.vehicle)} · <span className="font-semibold text-foreground">${offer.price}</span>
                      </p>
                    </div>
                    <StatusBadge status={offer.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverDashboard;

