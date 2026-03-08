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
import { populationFactory } from "@/services/populationFactory";
import type {
  MoveRequest,
  MoveOfferPopulated,
  MoveTripDetailed,
  Vehicle,
  DriverWithInfo,
} from "@/types";
import { getVehicleString } from "@/utils";

const DriverDashboard = () => {
  const { userId, name } = useAuth();
  const [driver, setDriver] = useState<DriverWithInfo | null>(null);
  const [pendingRequests, setPendingRequests] = useState<MoveRequest[]>([]);
  const [myOffers, setMyOffers] = useState<MoveOfferPopulated[]>([]);
  const [myTrips, setMyTrips] = useState<MoveTripDetailed[]>([]);
  const [myVehicles, setMyVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const displayName = name?.split(" ")[0] || "there";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [driverRes, requestsRes] = await Promise.allSettled([
          driverService.getCurrentDriver(),
          moveRequestService.getAllMoveRequests(),
        ]);

        const driverData =
          driverRes.status === "fulfilled" ? driverRes.value : null;
        setDriver(driverData);

        const requestsData =
          requestsRes.status === "fulfilled" ? requestsRes.value : [];
        setPendingRequests(
          (requestsData as MoveRequest[]).filter((r) => r.status === "CREATED"),
        );

        if (driverData) {
          // Use driverInfo.id as the driverInfoId for vehicle/offer/trip lookups
          const driverInfoId = driverData.driverInfo.id;

          const [offersRes, driverTripsRes, vehiclesRes] =
            await Promise.allSettled([
              moveOfferService.getOffersByDriver(driverInfoId),
              tripService.getTripsByDriver(driverInfoId),
              vehicleService.getVehiclesByDriver(driverInfoId),
            ]);

          if (offersRes.status === "fulfilled") {
             const populatedOffers = await Promise.all(
               offersRes.value.map(o => populationFactory.populateMoveOffer(o))
             );
             setMyOffers(populatedOffers);
          }

          if (driverTripsRes.status === "fulfilled") {
             const populatedTrips = await Promise.all(
               driverTripsRes.value.map(t => populationFactory.populateMoveTripDetailed(t))
             );
             setMyTrips(populatedTrips);
          }

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
    .reduce((s, t) => s + t.moveOfferPopulated.price, 0);

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
          description={`${myOffers.filter((o) => o.status === "OFFER_SENT").length} pending`}
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
                      {trip.moveRequestPopulated.fromAddress.city} → {trip.moveRequestPopulated.toAddress.city}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Client: {trip.moveRequestPopulated.client.firstName} {trip.moveRequestPopulated.client.lastName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">
                      ${trip.moveOfferPopulated.price}
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
                      {getVehicleString(offer.vehicle)} · $
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
