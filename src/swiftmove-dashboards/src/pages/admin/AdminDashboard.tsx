import { Users, FileText, Route, Truck, DollarSign, HandCoins, TrendingUp, Activity } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockAdminStats, recentActivity } from "@/data/mockData";

const activityIcons = { request: FileText, offer: HandCoins, trip: Route, user: Users, vehicle: Truck };

const AdminDashboard = () => {
  const stats = mockAdminStats;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Platform overview and analytics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Users" value={stats.totalUsers} icon={<Users className="w-4 h-4" />} description={`${stats.totalClients} clients · ${stats.totalDrivers} drivers`} />
        <StatsCard title="Move Requests" value={stats.totalMoveRequests} icon={<FileText className="w-4 h-4" />} />
        <StatsCard title="Active Trips" value={stats.activeMoveTrips} icon={<Route className="w-4 h-4" />} description={`${stats.completedTrips} completed`} />
        <StatsCard title="Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} icon={<DollarSign className="w-4 h-4" />} description="All time" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Activity className="w-4 h-4 text-primary" /> Recent Activity</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((item) => {
              const Icon = activityIcons[item.type];
              return (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.action}</p>
                    <p className="text-xs text-muted-foreground">{item.user} · {item.time}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> Quick Stats</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: "Vehicles Registered", value: stats.totalVehicles, max: 10 },
                { label: "Active Trips", value: stats.activeMoveTrips, max: 5 },
                { label: "Completed Trips", value: stats.completedTrips, max: 5 },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{stat.label}</span>
                    <span className="font-medium">{stat.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div className="h-full rounded-full gradient-brand transition-all" style={{ width: `${Math.min((stat.value / stat.max) * 100, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
