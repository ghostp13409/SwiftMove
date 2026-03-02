import { FileText, Truck, Route, DollarSign, HandCoins } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import StatusBadge from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockMoveRequests, mockMoveOffers, mockMoveTrips, mockVehicles } from "@/data/mockData";

const DriverDashboard = () => {
  const myOffers = mockMoveOffers.filter((o) => o.driverId === 1);
  const myTrips = mockMoveTrips.filter((t) => t.driverName === "Mike Johnson");
  const myVehicles = mockVehicles.filter((v) => v.driverId === 1);
  const pendingRequests = mockMoveRequests.filter((r) => r.status === "PENDING").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, Mike 👋</h1>
        <p className="text-muted-foreground text-sm mt-1">Your driver overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard title="Available Requests" value={pendingRequests} icon={<FileText className="w-4 h-4" />} description="Open for offers" />
        <StatsCard title="My Offers" value={myOffers.length} icon={<HandCoins className="w-4 h-4" />} description={`${myOffers.filter(o => o.status === "PENDING").length} pending`} />
        <StatsCard title="Active Trips" value={myTrips.filter((t) => t.status === "SCHEDULED").length} icon={<Route className="w-4 h-4" />} />
        <StatsCard title="Vehicles" value={myVehicles.length} icon={<Truck className="w-4 h-4" />} description={`${myVehicles.filter(v => v.isActive).length} active`} />
        <StatsCard title="Earnings" value={`$${myTrips.reduce((s, t) => s + t.price, 0)}`} icon={<DollarSign className="w-4 h-4" />} description="All time" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">Upcoming Trips</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {myTrips.length === 0 ? <p className="text-sm text-muted-foreground">No trips yet</p> : myTrips.map((trip) => (
              <div key={trip.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div>
                  <p className="text-sm font-medium">{trip.fromAddress.city} → {trip.toAddress.city}</p>
                  <p className="text-xs text-muted-foreground">Client: {trip.clientName} · {trip.startTime.split("T")[0]}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">${trip.price}</span>
                  <StatusBadge status={trip.status} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">Recent Offers</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {myOffers.slice(0, 4).map((offer) => (
              <div key={offer.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div>
                  <p className="text-sm font-medium">Request #{offer.moveRequestId}</p>
                  <p className="text-xs text-muted-foreground">{offer.vehicleInfo} · ${offer.price}</p>
                </div>
                <StatusBadge status={offer.status} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverDashboard;
