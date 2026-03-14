import {
  Users,
  FileText,
  Route,
  Truck,
  DollarSign,
  TrendingUp,
  Activity,
  UserPlus,
  PlusCircle,
  BarChart3
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import StatsCard from "@/components/StatsCard";
import EmptyState from "@/components/EmptyState";
import LoadingDelight from "@/components/LoadingDelight";
import { StatusPieChart, SimpleLineChart } from "@/components/MoveCharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { userService } from "@/services/userService";
import { moveRequestService } from "@/services/moveRequestService";
import { tripService } from "@/services/tripService";
import { vehicleService } from "@/services/vehicleService";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const [usersData, requestsData, tripsData, vehiclesData] = await Promise.all([
        userService.getAllUsers(),
        moveRequestService.getAllMoveRequests(),
        tripService.getAllTrips(),
        vehicleService.getVehicles(),
      ]);

      const drivers = usersData.filter((u) => u.role === "DRIVER");
      const clients = usersData.filter((u) => u.role === "CLIENT");

      const activeTrips = tripsData.filter(
        (t) => t.status === "SCHEDULED" || t.status === "IN_PROGRESS",
      );
      const completedTrips = tripsData.filter(
        (t) => t.status === "COMPLETED",
      );

      const revenue = completedTrips.reduce(
        (sum, t) => sum + ((t as any).price ?? 0),
        0,
      );

      // Group requests by status for the pie chart
      const statusCounts = requestsData.reduce((acc: any, req) => {
        acc[req.status] = (acc[req.status] || 0) + 1;
        return acc;
      }, {});

      const statusData = Object.keys(statusCounts).map(status => ({
        name: status,
        value: statusCounts[status]
      }));

      // Dummy trend data for visualization (would ideally come from an analytics endpoint)
      const trendData = [
        { date: "Mar 08", amount: 12 },
        { date: "Mar 09", amount: 18 },
        { date: "Mar 10", amount: 15 },
        { date: "Mar 11", amount: 25 },
        { date: "Mar 12", amount: 32 },
        { date: "Mar 13", amount: 28 },
        { date: "Mar 14", amount: requestsData.length },
      ];

      return {
        totalUsers: usersData.length,
        totalDrivers: drivers.length,
        totalClients: clients.length,
        totalMoveRequests: requestsData.length,
        activeMoveTrips: activeTrips.length,
        completedTrips: completedTrips.length,
        totalVehicles: vehiclesData.length,
        totalRevenue: revenue,
        statusData,
        trendData
      };
    },
  });


  if (isLoading) {
    return <LoadingDelight label="Analyzing platform health..." />;
  }


  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div className="animate-slide-up animate-stagger-1">
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Platform health and activity overview for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up animate-stagger-2">
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
          description="Total requests"
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
          description="From completed trips"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up animate-stagger-3">
        <Card className="shadow-card overflow-hidden">
          <CardHeader className="border-b bg-muted/30 py-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary/80" /> System Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <StatusPieChart data={stats.statusData} title="Request Status Distribution" />
          </CardContent>
        </Card>

        <Card className="shadow-card overflow-hidden">
          <CardHeader className="border-b bg-muted/30 py-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary/80" /> Move Request Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <SimpleLineChart data={stats.trendData} title="Daily Move Volume (Last 7 Days)" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up animate-stagger-4">


        <Card className="shadow-card overflow-hidden">
          <CardHeader className="border-b bg-muted/30 py-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary/80" /> Platform Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {stats.totalUsers === 0 ? (
              <EmptyState
                icon={UserPlus}
                title="No users registered"
                description="The platform currently has no registered users."
                action={{
                  label: "Manage Users",
                  onClick: () => navigate("/admin/users"),
                }}
              />
            ) : (
              <div className="divide-y">
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
                      className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors"
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
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card overflow-hidden">
          <CardHeader className="border-b bg-muted/30 py-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary/80" /> Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {stats.totalMoveRequests === 0 ? (
              <EmptyState
                icon={PlusCircle}
                title="No activity data"
                description="Activity distribution will appear once users start making requests."
              />
            ) : (
              <div className="space-y-6">
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
                    <div className="flex justify-between text-xs font-medium mb-2">
                      <span className="text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                      <span className="text-foreground">{stat.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{
                          width: `${stat.max > 0 ? Math.min((stat.value / stat.max) * 100, 100) : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;

