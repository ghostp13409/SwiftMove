import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";
import { Loader2, Route } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { tripService } from "@/services/tripService";
import { populationFactory } from "@/services/populationFactory";
import type { MoveTripDetailed } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const ClientTrips = () => {
  const { userId } = useAuth();
  const [myTrips, setMyTrips] = useState<MoveTripDetailed[]>([]);
  const [selected, setSelected] = useState<MoveTripDetailed | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const fetchTrips = async () => {
      try {
        setIsLoading(true);
        const data = await tripService.getTripsByClient(userId);

        // Populate and filter for current client
        const populated = await Promise.all(
          data.map((t) => populationFactory.populateMoveTripDetailed(t)),
        );

        const filtered = populated.filter(
          (t) => t.moveRequestPopulated.clientId === userId,
        );
        setMyTrips(filtered);
      } catch (err) {
        console.error("Failed to load trips:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrips();
  }, [userId]);

  const activeTrip = myTrips.find(
    (t) => t.status === "SCHEDULED" || t.status === "IN_PROGRESS",
  );

  const handleCancelTrip = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this trip?")) return;
    try {
      await tripService.updateTripStatus(id, "CANCELLED");
      toast({
        title: "Trip Cancelled",
        description: "Your trip has been cancelled successfully.",
      });
      // Refresh list
      if (!userId) return;
      const data = await tripService.getTripsByClient(userId);
      const populated = await Promise.all(
        data.map((t) => populationFactory.populateMoveTripDetailed(t)),
      );
      setMyTrips(
        populated.filter((t) => t.moveRequestPopulated.clientId === userId),
      );
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to cancel trip.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Move Trips</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your confirmed moves
        </p>
      </div>

      {activeTrip && (
        <Card className="shadow-card border-l-4 border-l-primary overflow-hidden">
          <CardHeader className="pb-2 bg-primary/5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Route className="w-4 h-4 text-primary" /> Active Trip
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleCancelTrip(activeTrip.id)}
                  className="h-7 px-3 text-xs"
                >
                  Cancel Trip
                </Button>
                <StatusBadge status={activeTrip.status} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
                  From
                </p>
                <p className="font-medium">
                  {activeTrip.moveRequestPopulated.fromAddress.city}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
                  To
                </p>
                <p className="font-medium">
                  {activeTrip.moveRequestPopulated.toAddress.city}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
                  Driver
                </p>
                <p className="font-medium">
                  {activeTrip.moveOfferPopulated.driver.user.firstName}{" "}
                  {activeTrip.moveOfferPopulated.driver.user.lastName}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
                  Price
                </p>
                <p className="font-bold text-primary text-lg">
                  ${activeTrip.moveOfferPopulated.price}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {myTrips.length === 0 ? (
        <div className="text-center py-12 bg-secondary/10 rounded-3xl border border-dashed border-border/60">
          <p className="text-sm font-medium text-muted-foreground">
            No trips yet. Accept a move offer to schedule your first trip!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {myTrips.map((trip) => (
            <Card
              key={trip.id}
              className={`shadow-card cursor-pointer hover:shadow-card-lg transition-all border-2 ${selected?.id === trip.id ? "border-primary bg-primary/5" : "border-transparent"}`}
              onClick={() => setSelected(trip)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-sm">
                      {trip.moveRequestPopulated.fromAddress.city} →{" "}
                      {trip.moveRequestPopulated.toAddress.city}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">
                      Driver: {trip.moveOfferPopulated.driver.user.firstName}{" "}
                      {trip.moveOfferPopulated.driver.user.lastName}
                    </p>
                  </div>
                  <StatusBadge status={trip.status} />
                </div>
                <div className="flex justify-between items-center text-sm pt-2 border-t">
                  <span className="text-muted-foreground text-xs font-medium">
                    {new Date(
                      trip.moveRequestPopulated.moveDate,
                    ).toLocaleDateString()}
                  </span>
                  <span className="font-bold text-primary">
                    ${trip.moveOfferPopulated.price}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientTrips;
