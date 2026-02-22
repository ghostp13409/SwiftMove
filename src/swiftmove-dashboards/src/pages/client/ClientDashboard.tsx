import { FileText, Route, DollarSign, Clock } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import StatusBadge from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockMoveRequests, mockMoveOffers, mockMoveTrips } from "@/data/mockData";

const ClientDashboard = () => {
  const myRequests = mockMoveRequests.filter((r) => r.clientId === 1);
  const pendingRequests = myRequests.filter((r) => r.status === "PENDING").length;
  const myTrips = mockMoveTrips.filter((t) => t.clientName === "John Doe");
  const activeOffers = mockMoveOffers.filter((o) => myRequests.some((r) => r.id === o.moveRequestId && o.status === "PENDING")).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, John 👋</h1>
        <p className="text-muted-foreground text-sm mt-1">Here's what's happening with your moves</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Active Requests" value={pendingRequests} icon={<FileText className="w-4 h-4" />} description="Awaiting offers" />
        <StatsCard title="Pending Offers" value={activeOffers} icon={<Clock className="w-4 h-4" />} description="Review & accept" />
        <StatsCard title="Upcoming Trips" value={myTrips.filter((t) => t.status === "SCHEDULED").length} icon={<Route className="w-4 h-4" />} description="Scheduled moves" />
        <StatsCard title="Total Spent" value={`$${myTrips.reduce((s, t) => s + t.price, 0)}`} icon={<DollarSign className="w-4 h-4" />} description="All time" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Recent Move Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {myRequests.slice(0, 3).map((req) => (
              <div key={req.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div>
                  <p className="text-sm font-medium">{req.fromAddress.city} → {req.toAddress.city}</p>
                  <p className="text-xs text-muted-foreground">{req.moveDate} · Budget: ${req.maxBudget}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{req.offersCount} offers</span>
                  <StatusBadge status={req.status} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Latest Offers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockMoveOffers.filter((o) => myRequests.some((r) => r.id === o.moveRequestId)).slice(0, 3).map((offer) => (
              <div key={offer.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div>
                  <p className="text-sm font-medium">{offer.driverName}</p>
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

export default ClientDashboard;
