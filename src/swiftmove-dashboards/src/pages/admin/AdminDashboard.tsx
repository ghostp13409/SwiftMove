import { useEffect, useState } from "react";
import {
  Users,
  FileText,
  Route,
  Truck,
  DollarSign,
  TrendingUp,
  Activity,
} from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { userService } from "@/services/userService";
import { moveRequestService } from "@/services/moveRequestService";
import { tripService } from "@/services/tripService";
import { vehicleService } from "@/services/vehicleService";
import type { DashboardStats } from "@/types";

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalDrivers: 0,
    totalClients: 0,
    totalMoveRequests: 0,
    activeMoveTrips: 0,
    completedTrips: 0,
    totalVehicles: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, requests, trips, vehicles] = await Promise.allSettled([
          userService.getAllUsers(),
          moveRequestService.getAllMoveRequests(),
          tripService.getAllTrips(),
          vehicleService.getVehicles(),
        ]);

        const usersData = users.status === "fulfilled" ? users.value : [];
        const requestsData =
          requests.status === "fulfilled" ? requests.value : [];
        const tripsData = trips.status === "fulfilled" ? trips.value : [];
        const vehiclesData =
          vehicles.status === "fulfilled" ? vehicles.value : [];

        // Use the `role` field from User type (not userType)
        const drivers = usersData.filter((u) => u.role === "DRIVER");
        const clients = usersData.filter((u) => u.role === "CLIENT");

        const activeTrips = tripsData.filter(
          (t) => t.status === "SCHEDULED" || t.status === "IN_PROGRESS",
        );
        const completedTrips = tripsData.filter(
          (t) => t.status === "COMPLETED",
        );
        // price is an enriched optional field on MoveTrip; skip revenue calculation
        // as the endpoint may not return it
        const revenue = completedTrips.reduce(
          (sum, t) => sum + ((t as any).price ?? 0),
          0,
        );

        setStats({
          totalUsers: usersData.length,
          totalDrivers: drivers.length,
          totalClients: clients.length,
          totalMoveRequests: requestsData.length,
          activeMoveTrips: activeTrips.length,
          completedTrips: completedTrips.length,
          totalVehicles: vehiclesData.length,
          totalRevenue: revenue,
        });
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Loading platform overview...
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-lg bg-secondary animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Platform overview and analytics
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="w-4 h-4" />}
          description={`${stats.totalClients} clients · ${stats.totalDrivers} drivers`}
        />
        <StatsCard
          title="Move Requests"
          value={stats.totalMoveRequests}
          icon={<FileText className="w-4 h-4" />}
        />
        <StatsCard
          title="Active Trips"
          value={stats.activeMoveTrips}
          icon={<Route className="w-4 h-4" />}
          description={`${stats.completedTrips} completed`}
        />
        <StatsCard
          title="Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="w-4 h-4" />}
          description="Completed trips"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" /> Platform Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                label: "Total Users Registered",
                value: stats.totalUsers,
                icon: Users,
              },
              {
                label: "Total Move Requests",
                value: stats.totalMoveRequests,
                icon: FileText,
              },
              {
                label: "Vehicles on Platform",
                value: stats.totalVehicles,
                icon: Truck,
              },
              {
                label: "Completed Trips",
                value: stats.completedTrips,
                icon: Route,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.label}</p>
                  </div>
                  <span className="font-semibold text-sm">{item.value}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  label: "Vehicles Registered",
                  value: stats.totalVehicles,
                  max: Math.max(stats.totalVehicles, 10),
                },
                {
                  label: "Active Trips",
                  value: stats.activeMoveTrips,
                  max: Math.max(stats.activeMoveTrips, 5),
                },
                {
                  label: "Completed Trips",
                  value: stats.completedTrips,
                  max: Math.max(stats.completedTrips, 5),
                },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{stat.label}</span>
                    <span className="font-medium">{stat.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full gradient-brand transition-all"
                      style={{
                        width: `${stat.max > 0 ? Math.min((stat.value / stat.max) * 100, 100) : 0}%`,
                      }}
                    />
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
