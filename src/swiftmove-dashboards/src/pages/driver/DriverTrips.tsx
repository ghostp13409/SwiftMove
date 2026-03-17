import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Route, 
  User, 
  Phone, 
  MessageSquare, 
  Clock, 
  Truck, 
  Package, 
  ExternalLink,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";
import SortToggle, { SortOrder } from "@/components/SortToggle";
import LoadingDelight from "@/components/LoadingDelight";

import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { tripService } from "@/services/tripService";
import { driverService } from "@/services/driverService";
import { populationFactory } from "@/services/populationFactory";
import { getVehicleString, getGoogleMapsAddressLink } from "@/utils";
import { useToast } from "@/hooks/use-toast";
import type { MoveTripDetailed } from "@/types";

const DriverTrips = () => {
  const { userId } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const { data: trips = [], isLoading } = useQuery({
    queryKey: ["driverTrips", userId],
    queryFn: async () => {
      const driver = await driverService.getCurrentDriver();
      // Use driver.userId because move_offers.driver_id is a User ID
      const data = await tripService.getTripsByDriver(driver.userId);
      const results = await Promise.allSettled(
        data.map((t) => populationFactory.populateMoveTripDetailed(t))
      );
      return results
        .filter((r): r is PromiseFulfilledResult<MoveTripDetailed> => r.status === "fulfilled")
        .map((r) => r.value);
    },

    enabled: !!userId,
  });

  const sortedTrips = React.useMemo(() => {
    return [...trips].sort((a, b) => {
      const dateA = new Date(a.moveRequestPopulated?.moveDate).getTime();
      const dateB = new Date(b.moveRequestPopulated?.moveDate).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [trips, sortOrder]);

  // Set default selection when data loads
  useEffect(() => {
    if (sortedTrips.length > 0 && selectedId === null) {
      setSelectedId(sortedTrips[0].id);
    }
  }, [sortedTrips, selectedId]);


  const deleteMutation = useMutation({
    mutationFn: (id: number) => tripService.deleteTrip(String(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driverTrips"] });
      toast({ title: "Record Deleted", description: "The trip record has been removed." });
      setSelectedId(null);
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number, status: string }) => 
      tripService.updateTripStatus(String(id), status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driverTrips"] });
      toast({ title: "Status Updated", description: "Trip status has been updated successfully." });
    },
  });

  const selectedTrip = trips.find(t => t.id === selectedId);

  if (isLoading) return <LoadingDelight label="Loading your trip assignments..." />;

  if (trips.length === 0) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <EmptyState
          icon={Truck}
          title="No trips yet"
          description="Your scheduled and completed trips will appear here once clients accept your offers."
          action={{
            label: "Browse Requests",
            onClick: () => window.location.href = "/driver/browse"
          }}
        />

      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-foreground">Move Trips</h1>
          <p className="text-muted-foreground text-sm mt-1 font-medium">Track your upcoming moves and earning history</p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/5 border border-primary/10">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
            Total Earnings: ${trips.filter(t => t.status === "COMPLETED").reduce((s, t) => s + (t.moveOfferPopulated?.price ?? 0), 0).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Trip List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between px-1">
            <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.2em]">Trip List</p>
            <SortToggle order={sortOrder} setOrder={setSortOrder} />
          </div>

          <div className="space-y-3">
            {sortedTrips.map((trip) => {
              const isActive = selectedId === trip.id;

              return (
                <button
                  key={trip.id}
                  onClick={() => setSelectedId(trip.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-200 border group ${
                    isActive 
                      ? "bg-card border-primary/30 shadow-md ring-1 ring-primary/10" 
                      : "bg-background border-border/50 hover:border-primary/20 hover:bg-card/50 shadow-sm"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <StatusBadge status={trip.status} />
                    <span className="text-[10px] font-black text-primary tracking-tighter">
                      +${trip.moveOfferPopulated?.price ?? 0}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-primary' : 'bg-muted-foreground/40'}`} />
                      <p className="text-xs font-bold text-foreground truncate">
                        {trip.moveRequestPopulated?.fromAddress?.city ?? 'Unknown'} → {trip.moveRequestPopulated?.toAddress?.city ?? 'Unknown'}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {trip.moveRequestPopulated?.moveDate ? new Date(trip.moveRequestPopulated.moveDate).toLocaleDateString() : 'TBD'}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="w-3 h-3" />
                        {trip.moveRequestPopulated?.client?.firstName ?? 'Client'}
                      </div>

                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed View */}
        <div className="lg:col-span-2">
          {selectedTrip ? (
            <Card key={selectedTrip.id} className="shadow-md border-border/50 rounded-xl overflow-hidden bg-card/50 backdrop-blur-md sticky top-24 animate-slide-up">
              <CardHeader className="p-6 border-b bg-muted/20 flex flex-row items-center justify-between space-y-0">

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center ring-1 ring-primary/20 shrink-0 shadow-sm">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold tracking-tight">Trip Details</CardTitle>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Job: SM-{selectedTrip?.id?.toString().padStart(5, '0')}</p>
                  </div>

                </div>
                <div className="flex items-center gap-3">
                  {selectedTrip?.status === "SCHEDULED" && (
                    <Button 
                      size="sm" 
                      className="h-9 px-4 text-xs font-black uppercase tracking-wider"
                      onClick={() => statusMutation.mutate({ id: selectedTrip.id, status: "IN_PROGRESS" })}
                    >
                      Start Trip
                    </Button>
                  )}
                  {selectedTrip?.status === "IN_PROGRESS" && (
                    <Button 
                      size="sm" 
                      className="h-9 px-4 text-xs font-black uppercase tracking-wider bg-primary"
                      onClick={() => statusMutation.mutate({ id: selectedTrip.id, status: "COMPLETED_BY_DRIVER" })}
                    >
                      Mark Completed
                    </Button>
                  )}
                  <StatusBadge status={selectedTrip?.status ?? "TBD"} />
                </div>
              </CardHeader>

              <CardContent className="p-0 divide-y divide-border/40">
                {/* Client Quick Info */}
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-secondary/50 flex items-center justify-center text-lg font-black text-muted-foreground border border-border/50">
                      {selectedTrip?.moveRequestPopulated?.client?.firstName?.[0] ?? '?'}{selectedTrip?.moveRequestPopulated?.client?.lastName?.[0] ?? '?'}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">Client Contact</p>
                      <p className="text-base font-bold text-foreground">
                        {selectedTrip?.moveRequestPopulated?.client?.firstName ?? 'Unknown'} {selectedTrip?.moveRequestPopulated?.client?.lastName ?? 'Client'}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm" className="h-7 px-2 text-[10px] font-bold gap-1.5 rounded-lg border-primary/20 text-primary">
                          <Phone className="w-3 h-3" /> Call
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 px-2 text-[10px] font-bold gap-1.5 rounded-lg border-primary/20 text-primary">
                          <MessageSquare className="w-3 h-3" /> Chat
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center border border-primary/10">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">Luggage Summary</p>
                      <p className="text-base font-bold text-foreground">
                        {selectedTrip?.moveRequestPopulated?.luggageEntries?.length ?? 0} Item Categories
                      </p>
                      <p className="text-xs text-muted-foreground font-medium mt-1">
                        {selectedTrip?.moveRequestPopulated?.hasFurniture ? "Contains Furniture" : "No Large Furniture"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Route Timeline */}
                <div className="p-8 bg-background/30">
                  <div className="relative flex flex-col gap-10 pl-10 before:absolute before:left-[15px] before:top-2 before:bottom-10 before:w-[2px] before:bg-border/60 before:rounded-full">
                    <div className="relative">
                      <div className="absolute -left-[29px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-primary/10 ring-offset-2 ring-offset-background z-10" />
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <p className="text-[10px] font-bold uppercase text-primary tracking-widest leading-none mb-1.5">Pick-up Location</p>
                          <p className="text-sm font-bold text-foreground leading-tight">{selectedTrip?.moveRequestPopulated?.fromAddress?.line1 ?? 'TBD'}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 font-medium">{selectedTrip?.moveRequestPopulated?.fromAddress?.city ?? 'Unknown city'}</p>
                        </div>
                        {selectedTrip?.moveRequestPopulated?.fromAddress && (
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] font-bold text-primary opacity-60 hover:opacity-100" asChild>
                            <a href={getGoogleMapsAddressLink(selectedTrip.moveRequestPopulated.fromAddress)} target="_blank" rel="noopener noreferrer">
                              Maps <ExternalLink className="ml-1 w-2.5 h-2.5" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[29px] top-1.5 w-2.5 h-2.5 rounded-full bg-foreground/80 ring-4 ring-foreground/5 ring-offset-2 ring-offset-background z-10" />
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest leading-none mb-1.5">Destination</p>
                          <p className="text-sm font-bold text-foreground leading-tight">{selectedTrip?.moveRequestPopulated?.toAddress?.line1 ?? 'TBD'}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 font-medium">{selectedTrip?.moveRequestPopulated?.toAddress?.city ?? 'Unknown city'}</p>
                        </div>
                        {selectedTrip?.moveRequestPopulated?.toAddress && (
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] font-bold text-primary opacity-60 hover:opacity-100" asChild>
                            <a href={getGoogleMapsAddressLink(selectedTrip.moveRequestPopulated.toAddress)} target="_blank" rel="noopener noreferrer">
                              Maps <ExternalLink className="ml-1 w-2.5 h-2.5" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Luggage Inventory */}
                <div className="p-8">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest mb-4">Luggage Inventory</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrip?.moveRequestPopulated?.luggageEntries?.length ? (
                      selectedTrip.moveRequestPopulated.luggageEntries.map((l, i) => (
                        <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-background border border-border/50 shadow-sm ring-1 ring-black/5">
                          <span className="w-5 h-5 flex items-center justify-center bg-primary/10 text-primary rounded-md text-[10px] font-black">{l.quantity}</span>
                          <span className="text-[11px] font-bold text-foreground/80">{l.luggageType?.name}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground italic">No items listed</p>
                    )}
                  </div>
                </div>

                {/* Earning Stats & Actions */}
                <div className="p-8 bg-muted/10 flex flex-wrap items-center justify-between gap-6">
                  <div className="flex gap-10">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Your Earnings</p>
                      <p className="text-3xl font-black text-primary tracking-tighter">${selectedTrip?.moveOfferPopulated?.price ?? 0}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Scheduled Date</p>
                      <p className="text-lg font-bold text-foreground tracking-tight">
                        {selectedTrip?.moveRequestPopulated?.moveDate ? new Date(selectedTrip.moveRequestPopulated.moveDate).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'TBD'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-10 px-4 rounded-xl text-xs font-bold gap-2 text-destructive border-destructive/20 hover:bg-destructive/5"
                      onClick={() => {
                        if(confirm("Delete this trip record?")) deleteMutation.mutate(selectedTrip.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" /> Delete Record
                    </Button>
                  </div>

                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed rounded-2xl bg-muted/10 border-border/50 text-muted-foreground">
              Select a trip to view details
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default DriverTrips;
