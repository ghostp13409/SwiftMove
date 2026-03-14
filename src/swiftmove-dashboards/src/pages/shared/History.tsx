import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  History, 
  FileText, 
  HandCoins, 
  Route, 
  Clock, 
  Search,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatusBadge from "@/components/StatusBadge";
import SortToggle, { SortOrder } from "@/components/SortToggle";
import LoadingDelight from "@/components/LoadingDelight";
import EmptyState from "@/components/EmptyState";
import { useAuth } from "@/context/AuthContext";
import { moveRequestService } from "@/services/moveRequestService";
import { moveOfferService } from "@/services/moveOfferService";
import { tripService } from "@/services/tripService";
import { driverService } from "@/services/driverService";
import { populationFactory } from "@/services/populationFactory";
import { Input } from "@/components/ui/input";

const HistoryPage = () => {
  const { userId, role } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const { data: requests = [], isLoading: isLoadingRequests } = useQuery({
    queryKey: ["requestHistory", userId],
    queryFn: async () => {
      if (!userId) return [];
      const data = await moveRequestService.getAllMoveRequests();
      const filtered = role === "CLIENT" 
        ? data.filter(r => r.clientId === userId && (r.status === "CANCELLED" || r.status === "ACCEPTED"))
        : [];
      return Promise.all(filtered.map(r => populationFactory.populateMoveRequest(r)));
    },
    enabled: !!userId && role === "CLIENT",
  });

  const { data: offers = [], isLoading: isLoadingOffers } = useQuery({
    queryKey: ["offerHistory", userId],
    queryFn: async () => {
      if (!userId) return [];
      const data = await moveOfferService.getOffersByDriver();
      const filtered = data.filter(o => o.status === "REJECTED" || o.status === "CANCELLED" || o.status === "ACCEPTED");
      return Promise.all(filtered.map(o => populationFactory.populateMoveOffer(o)));
    },
    enabled: !!userId && role === "DRIVER",
  });

  const { data: trips = [], isLoading: isLoadingTrips } = useQuery({
    queryKey: ["tripHistory", userId],
    queryFn: async () => {
      if (!userId) return [];
      let data = [];
      if (role === "CLIENT") {
        data = await tripService.getTripsByClient(userId);
      } else {
        const driver = await driverService.getCurrentDriver();
        data = await tripService.getTripsByDriver(driver.id);
      }
      const populated = await Promise.all(data.map(t => populationFactory.populateMoveTripDetailed(t)));
      return populated.filter(t => t.status === "COMPLETED" || t.status === "CANCELLED");
    },
    enabled: !!userId,
  });

  const sortItems = (items: any[]) => {
    return [...items].sort((a, b) => {
      const dateA = new Date(a.moveRequestPopulated?.moveDate || a.moveDate || a.offerDate).getTime();
      const dateB = new Date(b.moveRequestPopulated?.moveDate || b.moveDate || b.offerDate).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  };

  const isLoading = isLoadingRequests || isLoadingOffers || isLoadingTrips;

  if (isLoading) return <LoadingDelight label="Archiving your moving history..." />;

  return (
    <div className="space-y-8 animate-fade-in text-foreground/90">
      <div>
        <h1 className="text-3xl font-black tracking-tighter text-foreground flex items-center gap-3">
          <History className="w-8 h-8 text-primary" />
          Activity History
        </h1>
        <p className="text-muted-foreground text-sm mt-1 font-medium">Review your past requests, offers, and completed journeys</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search locations, dates, or IDs..." 
          className="pl-10 h-12 bg-card/50 border-border/50 rounded-xl"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="trips" className="w-full">
        <div className="flex items-center justify-between mb-6 border-b border-border/50 pb-px">
          <TabsList className="bg-transparent gap-8 h-12">
            <TabsTrigger value="trips" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 text-sm font-bold uppercase tracking-widest text-muted-foreground data-[state=active]:text-foreground transition-all">
              Completed Trips
            </TabsTrigger>
            {role === "CLIENT" && (
              <TabsTrigger value="requests" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 text-sm font-bold uppercase tracking-widest text-muted-foreground data-[state=active]:text-foreground transition-all">
                Move Requests
              </TabsTrigger>
            )}
            {role === "DRIVER" && (
              <TabsTrigger value="offers" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 text-sm font-bold uppercase tracking-widest text-muted-foreground data-[state=active]:text-foreground transition-all">
                Offer History
              </TabsTrigger>
            )}
          </TabsList>
          <SortToggle order={sortOrder} setOrder={setSortOrder} />
        </div>

        <TabsContent value="trips" className="mt-0">
          {trips.length === 0 ? (
            <EmptyState icon={Route} title="No archived trips" description="Your completed or cancelled trips will appear here." />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {sortItems(trips).map(trip => (
                <HistoryCard 
                  key={trip.id}
                  title={`${trip.moveRequestPopulated?.fromAddress?.city ?? 'Unknown'} → ${trip.moveRequestPopulated?.toAddress?.city ?? 'Unknown'}`}
                  subtitle={role === "CLIENT" ? `Driver: ${trip.moveOfferPopulated?.driver?.user?.firstName ?? 'Driver'}` : `Client: ${trip.moveRequestPopulated?.client?.firstName ?? 'Client'}`}
                  date={trip.moveRequestPopulated?.moveDate ? new Date(trip.moveRequestPopulated.moveDate).toLocaleDateString() : 'TBD'}
                  price={trip.moveOfferPopulated?.price ? `$${trip.moveOfferPopulated.price}` : null}
                  status={trip.status}
                  icon={Route}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="requests" className="mt-0">
          <div className="grid grid-cols-1 gap-4">
            {sortItems(requests).map(req => (
              <HistoryCard 
                key={req.id}
                title={`${req.fromAddress?.city ?? 'Unknown'} → ${req.toAddress?.city ?? 'Unknown'}`}
                subtitle={`Budget: $${req.maxBudget}`}
                date={req.moveDate ? new Date(req.moveDate).toLocaleDateString() : 'TBD'}
                status={req.status}
                icon={FileText}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="offers" className="mt-0">
          <div className="grid grid-cols-1 gap-4">
            {sortItems(offers).map(offer => (
              <HistoryCard 
                key={offer.id}
                title={`Request #${offer.moveRequestId}`}
                subtitle={offer.moveRequest ? `${offer.moveRequest.fromAddress?.city} → ${offer.moveRequest.toAddress?.city}` : 'Details available'}
                date={offer.offerDate ? new Date(offer.offerDate).toLocaleDateString() : 'TBD'}
                price={`$${offer.price}`}
                status={offer.status}
                icon={HandCoins}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const HistoryCard = ({ title, subtitle, date, price, status, icon: Icon }: any) => (
  <Card className="hover:border-primary/20 transition-all duration-300 group bg-card/50 backdrop-blur-sm border-border/50 shadow-sm overflow-hidden">
    <CardContent className="p-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors ring-1 ring-border/50 shrink-0">
            <Icon className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-foreground tracking-tight">{title}</h4>
            <p className="text-xs text-muted-foreground font-medium">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-10">
          <div className="text-right">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Activity Date</p>
            <p className="text-xs font-bold text-foreground flex items-center justify-end gap-1.5 leading-none">
              <Clock className="w-3 h-3 opacity-50" />
              {date}
            </p>
          </div>
          {price && (
            <div className="text-right">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Final Price</p>
              <p className="text-sm font-black text-primary tracking-tighter leading-none">{price}</p>
            </div>
          )}
          <div className="flex items-center gap-4">
            <StatusBadge status={status} />
            <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default HistoryPage;
