import StatusBadge from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockMoveTrips } from "@/data/mockData";

const DriverTrips = () => {
  const myTrips = mockMoveTrips.filter((t) => t.driverName === "Mike Johnson");
  const activeTrip = myTrips.find((t) => t.status === "SCHEDULED" || t.status === "IN_PROGRESS");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">My Trips</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your confirmed move trips</p>
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
              <div><p className="text-muted-foreground text-xs">From</p><p>{activeTrip.fromAddress.city}</p></div>
              <div><p className="text-muted-foreground text-xs">To</p><p>{activeTrip.toAddress.city}</p></div>
              <div><p className="text-muted-foreground text-xs">Client</p><p>{activeTrip.clientName}</p></div>
              <div><p className="text-muted-foreground text-xs">Price</p><p className="font-semibold">${activeTrip.price}</p></div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {myTrips.map((trip) => (
          <Card key={trip.id} className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{trip.fromAddress.city} → {trip.toAddress.city}</p>
                  <p className="text-sm text-muted-foreground">Client: {trip.clientName} · {trip.startTime.split("T")[0]}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">${trip.price}</span>
                  <StatusBadge status={trip.status} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DriverTrips;
