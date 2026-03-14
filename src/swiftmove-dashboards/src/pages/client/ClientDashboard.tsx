import { FileText, Route, Clock, Plus, MessageSquare, LineChart as ChartIcon, PieChart as PieIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import StatsCard from "@/components/StatsCard";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import LoadingDelight from "@/components/LoadingDelight";
import { SimpleLineChart, StatusPieChart } from "@/components/MoveCharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { moveOfferService } from "@/services/moveOfferService";
import { tripService } from "@/services/tripService";
import { moveRequestService } from "@/services/moveRequestService";
import { populationFactory } from "@/services/populationFactory";
import { getVehicleString } from "@/utils";
import type { MoveOffer } from "@/types";

const ClientDashboard = () => {
  const { userId, name } = useAuth();
  const navigate = useNavigate();
  const displayName = name?.split(" ")[0] || "there";

  // Fetch active requests
  const { data: myRequests = [], isLoading: isLoadingRequests } = useQuery({
    queryKey: ["clientRequests", userId],
    queryFn: async () => {
      const reqData = await moveRequestService.getActiveRequests();
      return Promise.all(
        reqData.map((req) => populationFactory.populateMoveRequest(req))
      );
    },
    enabled: !!userId,
  });

  // Fetch client trips
  const { data: myTrips = [], isLoading: isLoadingTrips } = useQuery({
    queryKey: ["clientTrips", userId],
    queryFn: () => tripService.getTripsByClient(userId!),
    enabled: !!userId,
  });

  // Fetch offers for active requests
  const { data: myOffers = [], isLoading: isLoadingOffers } = useQuery({
    queryKey: ["clientOffers", myRequests.map(r => r.id)],
    queryFn: async () => {
      if (myRequests.length === 0) return [];
      const offersResults = await Promise.allSettled(
        myRequests.map((r) => moveOfferService.getOffersByMoveRequest(r.id))
      );
      const allOffers = offersResults
        .filter((r) => r.status === "fulfilled")
        .flatMap((r) => (r as PromiseFulfilledResult<MoveOffer[]>).value);

      return Promise.all(
        allOffers.map((offer) => populationFactory.populateMoveOffer(offer))
      );
    },
    enabled: myRequests.length > 0,
  });

  const isLoading = isLoadingRequests || isLoadingTrips || (myRequests.length > 0 && isLoadingOffers);

  if (isLoading) {
    return <LoadingDelight />;
  }

  const pendingRequests = myRequests.filter((r) => r.status === "CREATED").length;
  const activeOffers = myOffers.filter((o) => o.status === "OFFER_SENT").length;
  const scheduledTrips = myTrips.filter((t) => t.status === "SCHEDULED").length;

  // Status distribution for pie chart
  const statusCounts = myRequests.reduce((acc: any, req) => {
    acc[req.status] = (acc[req.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.keys(statusCounts).map(status => ({
    name: status,
    value: statusCounts[status]
  }));

  // Dummy spending trend data
  const spendTrendData = [
    { date: "Oct", amount: 0 },
    { date: "Nov", amount: 450 },
    { date: "Dec", amount: 1200 },
    { date: "Jan", amount: 800 },
    { date: "Feb", amount: 2100 },
    { date: "Mar", amount: 1500 },
  ];



  return (
    <div className="space-y-6">
      <div className="animate-slide-up animate-stagger-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome back, {displayName} 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {pendingRequests > 0 
            ? `You have ${pendingRequests} active move request${pendingRequests > 1 ? 's' : ''} in progress.`
            : "Ready for your next move? Create a request to get started."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up animate-stagger-2">


        <StatsCard
          title="Active Requests"
          value={pendingRequests}
          icon={<FileText className="w-4 h-4" />}
          description="Awaiting offers"
        />
        <StatsCard
          title="Pending Offers"
          value={activeOffers}
          icon={<Clock className="w-4 h-4" />}
          description="Review & accept"
        />
        <StatsCard
          title="Upcoming Trips"
          value={scheduledTrips}
          icon={<Route className="w-4 h-4" />}
          description="Scheduled moves"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up animate-stagger-3">
        <Card className="shadow-card overflow-hidden">
          <CardHeader className="border-b bg-muted/30 py-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <ChartIcon className="w-4 h-4 text-primary/80" /> Spending Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <SimpleLineChart data={spendTrendData} title="Monthly Moving Expenses" />
          </CardContent>
        </Card>

        <Card className="shadow-card overflow-hidden">
          <CardHeader className="border-b bg-muted/30 py-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-primary/80" /> Request Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <StatusPieChart data={statusData} title="Move Request Distribution" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up animate-stagger-4">


        <Card className="shadow-card overflow-hidden">
          <CardHeader className="border-b bg-muted/30 py-4">
            <CardTitle className="text-sm font-semibold">Recent Move Requests</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {myRequests.length === 0 ? (
              <EmptyState
                icon={Plus}
                title="No active requests"
                description="Create your first move request to start receiving offers from drivers."
                action={{
                  label: "Create Request",
                  onClick: () => navigate("/client/requests"),
                }}
              />
            ) : (
              <div className="divide-y">
                {myRequests.slice(0, 5).map((req) => (
                  <div key={req.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {req.fromAddress?.city || "—"} → {req.toAddress?.city || "—"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {req.moveDate ? new Date(req.moveDate).toLocaleDateString() : "Date TBD"}
                      </p>
                    </div>
                    <StatusBadge status={req.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card overflow-hidden">
          <CardHeader className="border-b bg-muted/30 py-4">
            <CardTitle className="text-sm font-semibold">Latest Offers</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {myOffers.length === 0 ? (
              <EmptyState
                icon={MessageSquare}
                title="No offers yet"
                description="Once you create a request, drivers will send you their offers here."
              />
            ) : (
              <div className="divide-y">
                {myOffers.slice(0, 5).map((offer) => (
                  <div key={offer.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {offer.driver.user.firstName || `Driver #${offer.driverId}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getVehicleString(offer.vehicle)} · <span className="font-semibold text-foreground">${offer.price}</span>
                      </p>
                    </div>
                    <StatusBadge status={offer.status} />
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

export default ClientDashboard;

