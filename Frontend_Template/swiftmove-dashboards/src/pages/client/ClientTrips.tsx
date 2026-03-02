import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";
import { mockMoveTrips } from "@/data/mockData";
import type { MoveTrip } from "@/types";

const ClientTrips = () => {
  const [selected, setSelected] = useState<MoveTrip | null>(null);
  const myTrips = mockMoveTrips.filter((t) => t.clientName === "John Doe" || t.clientName === "Alice Smith" || t.clientName === "Bob Wilson");

  const activeTrip = myTrips.find((t) => t.status === "SCHEDULED" || t.status === "IN_PROGRESS");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Move Trips</h1>
        <p className="text-sm text-muted-foreground mt-1">Track your confirmed moves</p>
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
                <p>{activeTrip.fromAddress.city}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">To</p>
                <p>{activeTrip.toAddress.city}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Driver</p>
                <p>{activeTrip.driverName}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Price</p>
                <p className="font-semibold">${activeTrip.price}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {myTrips.map((trip) => (
          <Card key={trip.id} className={`shadow-card cursor-pointer hover:shadow-card-lg transition-all ${selected?.id === trip.id ? "ring-2 ring-primary" : ""}`} onClick={() => setSelected(trip)}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium">{trip.fromAddress.city} → {trip.toAddress.city}</p>
                  <p className="text-xs text-muted-foreground mt-1">Driver: {trip.driverName}</p>
                </div>
                <StatusBadge status={trip.status} />
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground text-xs">{trip.startTime.split("T")[0]}</span>
                <span className="font-semibold">${trip.price}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClientTrips;
