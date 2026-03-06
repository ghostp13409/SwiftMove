import { useState, useEffect } from "react";
import StatusBadge from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tripService } from "@/services/tripService";
import { driverService } from "@/services/driverService";
import type { MoveTrip, DriverWithInfo } from "@/types";

const DriverTrips = () => {
  const [myTrips, setMyTrips] = useState<MoveTrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const driver: DriverWithInfo = await driverService.getCurrentDriver();
        // Use driverInfo.id (driverInfoId) for trip lookups
        const trips = await tripService.getTripsByDriver(driver.driverInfo.id);
        setMyTrips(trips);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ??
            err?.message ??
            "Failed to load trips.",
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const activeTrip = myTrips.find(
    (t) => t.status === "SCHEDULED" || t.status === "IN_PROGRESS",
  );

  const getCity = (addr: MoveTrip["fromAddress"]) => addr?.city ?? "—";
  const formatDate = (dt: string | undefined) => (dt ? dt.split("T")[0] : "—");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">My Trips</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your confirmed move trips
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )}

      {error && (
        <div className="rounded-md bg-destructive/10 text-destructive px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <>
          {activeTrip && (
            <Card className="shadow-card border-l-4 border-l-primary">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Active Trip</CardTitle>
                  <StatusBadge status={activeTrip.status} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">From</p>
                    <p>{getCity(activeTrip.fromAddress)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">To</p>
                    <p>{getCity(activeTrip.toAddress)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Client</p>
                    <p>{activeTrip.clientName ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Price</p>
                    <p className="font-semibold">
                      {activeTrip.price != null ? `$${activeTrip.price}` : "—"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {myTrips.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="flex items-center justify-center h-32 text-muted-foreground">
                No trips found.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {myTrips.map((trip) => (
                <Card key={trip.id} className="shadow-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {getCity(trip.fromAddress)} →{" "}
                          {getCity(trip.toAddress)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {trip.clientName
                            ? `Client: ${trip.clientName} · `
                            : ""}
                          {formatDate(trip.startTime)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">
                          {trip.price != null ? `$${trip.price}` : "—"}
                        </span>
                        <StatusBadge status={trip.status} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DriverTrips;
