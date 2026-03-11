import { useState, useEffect } from "react";
import StatusBadge from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tripService } from "@/services/tripService";
import { driverService } from "@/services/driverService";
import { populationFactory } from "@/services/populationFactory";
import type { MoveTripDetailed, DriverInfo } from "@/types";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const DriverTrips = () => {
  const [myTrips, setMyTrips] = useState<MoveTripDetailed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const driver: DriverInfo = await driverService.getCurrentDriver();
      const trips = await tripService.getTripsByDriver(driver.id);
      const populatedTrips = await Promise.all(
        trips.map((trip) => populationFactory.populateMoveTripDetailed(trip))
      );
      setMyTrips(populatedTrips);
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

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDeleteTrip = async (id: string) => {
    if (!confirm("Are you sure you want to delete this trip record? This will also delete the associated request and offer.")) return;
    try {
      await tripService.deleteTrip(id);
      toast({
        title: "Trip Deleted",
        description: "The trip record has been removed.",
      });
      fetchTrips();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete trip.",
        variant: "destructive",
      });
    }
  };

  const activeTrip = myTrips.find(
    (t) => t.status === "SCHEDULED" || t.status === "IN_PROGRESS",
  );

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
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteTrip(activeTrip.id)}
                      className="h-7 px-3 text-xs"
                    >
                      Delete Trip
                    </Button>
                    <StatusBadge status={activeTrip.status} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">From</p>
                    <p>{activeTrip.moveRequestPopulated.fromAddress.city}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">To</p>
                    <p>{activeTrip.moveRequestPopulated.toAddress.city}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Client</p>
                    <p>{activeTrip.moveRequestPopulated.client.firstName} {activeTrip.moveRequestPopulated.client.lastName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Price</p>
                    <p className="font-semibold">
                      ${activeTrip.moveOfferPopulated.price}
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
                          {trip.moveRequestPopulated.fromAddress.city} →{" "}
                          {trip.moveRequestPopulated.toAddress.city}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Client: {trip.moveRequestPopulated.client.firstName} {trip.moveRequestPopulated.client.lastName} · 
                          Date: {trip.moveRequestPopulated.moveDate.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">
                          ${trip.moveOfferPopulated.price}
                        </span>
                        <div className="flex flex-col items-end gap-1">
                          <StatusBadge status={trip.status} />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 text-[10px] text-destructive hover:text-destructive hover:bg-destructive/10 px-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTrip(trip.id);
                            }}
                          >
                            Delete Record
                          </Button>
                        </div>
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
