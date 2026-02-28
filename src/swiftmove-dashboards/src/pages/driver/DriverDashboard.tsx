import { useEffect, useState } from "react";
import {
  FileText,
  Truck,
  Route,
  DollarSign,
  HandCoins,
  Loader2,
} from "lucide-react";
import StatsCard from "@/components/StatsCard";
import StatusBadge from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { driverService } from "@/services/driverService";
import { moveRequestService } from "@/services/moveRequestService";
import { moveOfferService } from "@/services/moveOfferService";
import { tripService } from "@/services/tripService";
import { vehicleService } from "@/services/vehicleService";
import type {
  MoveRequest,
  MoveOffer,
  MoveTrip,
  Vehicle,
  Driver,
} from "@/types";

const DriverDashboard = () => {
  const { userId, name } = useAuth();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [pendingRequests, setPendingRequests] = useState<MoveRequest[]>([]);
  const [myOffers, setMyOffers] = useState<MoveOffer[]>([]);
  const [myTrips, setMyTrips] = useState<MoveTrip[]>([]);
  const [myVehicles, setMyVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const displayName = name?.split(" ")[0] || "there";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [driverRes, requestsRes, allTripsRes] = await Promise.allSettled([
          driverService.getCurrentDriver(),
          moveRequestService.getAllMoveRequests(),
          tripService.getAllTrips(),
        ]);

        const driverData =
          driverRes.status === "fulfilled" ? driverRes.value : null;
        setDriver(driverData);

        const requestsData =
          requestsRes.status === "fulfilled" ? requestsRes.value : [];
        setPendingRequests(
          (requestsData as MoveRequest[]).filter((r) => r.status === "PENDING"),
        );

        const tripsData =
          allTripsRes.status === "fulfilled" ? allTripsRes.value : [];

        if (driverData) {
          // Get driver-specific data
          const [offersRes, driverTripsRes, vehiclesRes] =
            await Promise.allSettled([
              moveOfferService.getOffersByDriver(driverData.id),
              tripService.getTripsByDriver(driverData.id),
              vehicleService.getVehiclesByDriver(driverData.id),
            ]);

          const offersData =
            offersRes.status === "fulfilled" ? offersRes.value : [];
          setMyOffers(offersData);

          const driverTrips =
            driverTripsRes.status === "fulfilled" ? driverTripsRes.value : [];
          setMyTrips(
            driverTrips.length > 0 ? driverTrips : (tripsData as MoveTrip[]),
          );

          const vehiclesData =
            vehiclesRes.status === "fulfilled" ? vehiclesRes.value : [];
          setMyVehicles(vehiclesData);
        }
      } catch (err) {
        console.error("Failed to load driver dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const getCity = (addr: any) => addr?.city || "—";
  const formatDate = (dt: string | undefined) => (dt ? dt.split("T")[0] : "—");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const activeTrips = myTrips.filter((t) => t.status === "SCHEDULED");
  const earnings = myTrips
    .filter((t) => t.status === "COMPLETED")
    .reduce((s, t) => s + (t.price || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {displayName} 👋</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Your driver overview
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
          description={`${myOffers.filter((o) => o.status === "PENDING").length} pending`}
        />
        <StatsCard
          title="Active Trips"
          value={activeTrips.length}
          icon={<Route className="w-4 h-4" />}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Upcoming Trips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {myTrips.length === 0 ? (
              <p className="text-sm text-muted-foreground">No trips yet</p>
            ) : (
              myTrips.slice(0, 4).map((trip) => (
                <div
                  key={trip.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {getCity(trip.fromAddress)} → {getCity(trip.toAddress)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {trip.clientName ? `Client: ${trip.clientName} · ` : ""}
                      {formatDate(trip.startTime)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">
                      {trip.price != null ? `$${trip.price}` : "—"}
                    </span>
                    <StatusBadge status={trip.status} />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Recent Offers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {myOffers.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No offers submitted yet
              </p>
            ) : (
              myOffers.slice(0, 4).map((offer) => (
                <div
                  key={offer.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                >
                  <div>
                    <p className="text-sm font-medium">
                      Request #{offer.moveRequestId}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {offer.vehicleInfo || `Vehicle #${offer.vehicleId}`} · $
                      {offer.price}
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

export default DriverDashboard;
