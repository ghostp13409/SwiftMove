import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { tripService } from "@/services/tripService";
import type { MoveTrip } from "@/types";

const ClientTrips = () => {
  const { userId } = useAuth();
  const [myTrips, setMyTrips] = useState<MoveTrip[]>([]);
  const [selected, setSelected] = useState<MoveTrip | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const fetchTrips = async () => {
      try {
        const data = await tripService.getTripsByClient(userId);
        setMyTrips(Array.isArray(data) ? data : []);
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
  const getCity = (addr: any) => addr?.city || "—";
  const formatDate = (dt: string | undefined) => (dt ? dt.split("T")[0] : "—");

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
                <p className="text-muted-foreground text-xs">Driver</p>
                <p>{activeTrip.driverName || "—"}</p>
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
        <p className="text-sm text-muted-foreground">
          No trips yet. Accept a move offer to schedule your first trip!
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {myTrips.map((trip) => (
            <Card
              key={trip.id}
              className={`shadow-card cursor-pointer hover:shadow-card-lg transition-all ${selected?.id === trip.id ? "ring-2 ring-primary" : ""}`}
              onClick={() => setSelected(trip)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-medium">
                      {getCity(trip.fromAddress)} → {getCity(trip.toAddress)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Driver: {trip.driverName || "—"}
                    </p>
                  </div>
                  <StatusBadge status={trip.status} />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground text-xs">
                    {formatDate(trip.startTime)}
                  </span>
                  <span className="font-semibold">
                    {trip.price != null ? `$${trip.price}` : "—"}
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
