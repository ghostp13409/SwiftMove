import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/StatusBadge";
import SortToggle, { SortOrder } from "@/components/SortToggle";
import LoadingDelight from "@/components/LoadingDelight";

import EmptyState from "@/components/EmptyState";
import { 
  Loader2, 
  Armchair, 
  Info, 
  MapPin, 
  ExternalLink, 
  Map as MapIcon, 
  Package, 
  Clock, 
  Send,
  CalendarClock,
  ArrowRight
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { tripService } from "@/services/tripService";
import { moveOfferService } from "@/services/moveOfferService";
import { driverService } from "@/services/driverService";
import { vehicleService } from "@/services/vehicleService";
import { populationFactory } from "@/services/populationFactory";
import { useToast } from "@/hooks/use-toast";
import type { MoveRequestPopulated, Vehicle, DriverInfo } from "@/types";
import { getVehicleString, getGoogleMapsAddressLink, getGoogleMapsDirectionsLink } from "@/utils";
import { DateTimePicker } from "@/components/DateTimePicker";

const BrowseRequests = () => {
  const { userId } = useAuth();
  const { toast } = useToast();
  const [selected, setSelected] = useState<MoveRequestPopulated | null>(null);
  const [pendingRequests, setPendingRequests] = useState<MoveRequestPopulated[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const sortedRequests = useMemo(() => {
    return [...pendingRequests].sort((a, b) => {
      const dateA = new Date(a.moveDate).getTime();
      const dateB = new Date(b.moveDate).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [pendingRequests, sortOrder]);

  const [driverVehicles, setDriverVehicles] = useState<Vehicle[]>([]);
  const [driverInfo, setDriverInfo] = useState<DriverInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateDialogOpen, setDateDialogOpen] = useState(false);

  // Offer form state
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [offeredDateTime, setOfferedDateTime] = useState<Date | undefined>(undefined);

  const fetchRequests = async () => {
    if (!userId) return;
    try {
      const driver = await driverService.getDriverByUserId(userId);
      if (driver) {
        setDriverInfo(driver);
        const [requests, vehicles] = await Promise.all([
          tripService.browseRequests(driver.userId),
          vehicleService.getVehiclesByDriver(driver.id),
        ]);
        
        const populatedPending = await Promise.all(
          requests.map((req) => populationFactory.populateMoveRequest(req)),
        );
        setPendingRequests(populatedPending);
        const activeVehicles = vehicles.filter((v) => v.isActive);
        setDriverVehicles(activeVehicles);
      }
    } catch (err) {
      console.error("Failed to load browse requests data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [userId]);

  // Filter vehicles based on furniture needs
  const filteredVehicles = useMemo(() => {
    if (!selected) return driverVehicles;
    return selected.hasFurniture
      ? driverVehicles.filter((v) => v.canCarryFurniture)
      : driverVehicles;
  }, [selected, driverVehicles]);

  // Set default most profitable vehicle when selected request changes
  useEffect(() => {
    if (selected && filteredVehicles.length > 0) {
      const mostProfitable = [...filteredVehicles].sort((a, b) => b.pricePerKm - a.pricePerKm)[0];
      setSelectedVehicleId(String(mostProfitable.id));
      setOfferedDateTime(new Date(selected.moveDate));
    }
  }, [selected, filteredVehicles]);

  const currentPrice = useMemo(() => {
    if (!selected || !selectedVehicleId) return 0;
    const vehicle = driverVehicles.find(v => v.id === parseInt(selectedVehicleId));
    if (vehicle && selected.distance) {
      return (selected.distance * vehicle.pricePerKm).toFixed(2);
    }
    return 0;
  }, [selected, selectedVehicleId, driverVehicles]);

  const handleSubmitOffer = async () => {
    if (!driverInfo || !selected || !selectedVehicleId || !offeredDateTime) return;
    
    setIsSubmitting(true);
    try {
      await moveOfferService.createMoveOffer({
        moveRequestId: selected.id,
        driverId: driverInfo.userId,
        vehicleId: parseInt(selectedVehicleId),
        price: parseFloat(String(currentPrice)),
        offerDate: offeredDateTime,
        status: "OFFER_SENT",
      });
      toast({ title: "Offer Submitted", description: "Your offer has been sent to the client." });
      fetchRequests(); // Refresh list
      setSelected(null);
    } catch (err: any) {
      toast({ 
        title: "Offer Failed", 
        description: err?.response?.data?.message || "Already submitted an offer for this request.", 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <LoadingDelight label="Scanning for move requests..." />;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black tracking-tighter text-foreground">Browse Requests</h1>
        <p className="text-muted-foreground text-sm mt-1 font-medium">Find and bid on active moves in your area</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Request Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between px-1">
            <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.2em]">Available Moves</p>
            <SortToggle order={sortOrder} setOrder={setSortOrder} />
          </div>
          <div className="space-y-3">
            {sortedRequests.length === 0 ? (
              <EmptyState icon={Package} title="No requests" description="No move requests are currently available for your area." />
            ) : (
              sortedRequests.map((req) => (
                <button
                  key={req.id}

                  onClick={() => setSelected(req)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-200 border group ${
                    selected?.id === req.id 
                      ? "bg-card border-primary/30 shadow-md ring-1 ring-primary/10" 
                      : "bg-background border-border/50 hover:border-primary/20 hover:bg-card/50 shadow-sm"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <StatusBadge status={req.status} />
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-primary tracking-tight">
                      <MapPin className="w-3 h-3" />
                      {req.distance?.toFixed(1)} KM
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-foreground">
                      {req.fromAddress.city} → {req.toAddress.city}
                    </p>
                    <div className="flex items-center justify-between text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {new Date(req.moveDate).toLocaleDateString()}
                      </div>
                      {req.hasFurniture && <Armchair className="w-3 h-3 text-primary" />}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Detailed View & Offer Bar */}
        <div className="lg:col-span-2">
          {selected ? (
            <Card className="shadow-md border-border/50 rounded-xl overflow-hidden bg-card/50 backdrop-blur-md sticky top-24">
              <CardHeader className="py-4 px-6 border-b bg-muted/20 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center ring-1 ring-primary/20 shrink-0">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold tracking-tight">Request Details</CardTitle>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Move ID: #{selected.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={selected.status} />
                </div>
              </CardHeader>

              <CardContent className="p-0 divide-y divide-border/40">
                {/* Route Section */}
                <div className="p-8 bg-background/30">
                  <div className="relative flex flex-col gap-10 pl-10 before:absolute before:left-[15px] before:top-2 before:bottom-10 before:w-[2px] before:bg-border/60 before:rounded-full">
                    <div className="relative">
                      <div className="absolute -left-[29px] top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-primary/10 ring-offset-2 ring-offset-background z-10" />
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <p className="text-[10px] font-bold uppercase text-primary tracking-widest leading-none mb-1.5">Origin</p>
                          <p className="text-sm font-bold text-foreground">{selected.fromAddress.line1}</p>
                          <p className="text-xs text-muted-foreground font-medium">{selected.fromAddress.city}, {selected.fromAddress.stateOrProvince}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] font-bold text-primary opacity-60 hover:opacity-100" asChild>
                          <a href={getGoogleMapsAddressLink(selected.fromAddress)} target="_blank" rel="noopener noreferrer">
                            Maps <ExternalLink className="ml-1 w-2.5 h-2.5" />
                          </a>
                        </Button>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[29px] top-1 w-2.5 h-2.5 rounded-full bg-foreground/80 ring-4 ring-foreground/5 ring-offset-2 ring-offset-background z-10" />
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest leading-none mb-1.5">Destination</p>
                          <p className="text-sm font-bold text-foreground">{selected.toAddress.line1}</p>
                          <p className="text-xs text-muted-foreground font-medium">{selected.toAddress.city}, {selected.toAddress.stateOrProvince}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] font-bold text-primary opacity-60 hover:opacity-100" asChild>
                          <a href={getGoogleMapsAddressLink(selected.toAddress)} target="_blank" rel="noopener noreferrer">
                            Maps <ExternalLink className="ml-1 w-2.5 h-2.5" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Bar */}
                <div className="px-8 py-4 flex flex-wrap gap-8 bg-muted/10">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider leading-none">Requested On</p>
                      <p className="text-xs font-bold mt-0.5">{selected.moveDate.toLocaleString()}</p>
                    </div>
                  </div>
                  {selected.hasFurniture && (
                    <div className="flex items-center gap-3">
                      <Armchair className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-[9px] font-bold text-primary uppercase tracking-wider leading-none">Furniture</p>
                        <p className="text-xs font-bold mt-0.5 text-primary">Required</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Offer Submission Row - THE NEW DESIGN */}
                <div className="p-8 bg-primary/5 border-t-2 border-primary/10">
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black uppercase tracking-[0.1em] text-primary flex items-center gap-2">
                        <Send className="w-4 h-4" /> Quick Offer
                      </h3>
                    </div>


                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                      {/* Vehicle Select */}
                      <div className="flex-1 space-y-1.5">
                        <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Select Vehicle</Label>
                        <Select onValueChange={setSelectedVehicleId} value={selectedVehicleId}>
                          <SelectTrigger className="h-11 rounded-xl bg-card border-border/50 font-bold text-[13px] shadow-sm px-4">
                            <SelectValue placeholder="Vehicle" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-border/50 min-w-[280px]">
                            {filteredVehicles.map((v) => (
                              <SelectItem key={v.id} value={String(v.id)} className="py-3 px-3 cursor-pointer focus:bg-primary/5">
                                <div className="flex items-center justify-between w-[220px]">
                                  <span className="font-bold text-[13px] text-foreground/90 truncate mr-2">{getVehicleString(v)}</span>
                                  <div className="flex flex-col items-end shrink-0">
                                    <span className="text-xs font-black text-primary tracking-tighter leading-none">${v.pricePerKm}</span>
                                    <span className="text-[7px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5 whitespace-nowrap">per km</span>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>




                        </Select>
                      </div>


                      {/* Date Display/Suggest */}
                      <div className="flex-1 space-y-1.5">
                        <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Proposed Date</Label>
                        <div className="flex gap-2">
                          <DateTimePicker 
                            date={offeredDateTime} 
                            setDate={setOfferedDateTime} 
                            placeholder="Select offer date & time"
                            trigger={
                              <Button 
                                variant="outline" 
                                className="h-11 flex-1 px-3 bg-card border-border/50 rounded-xl justify-start text-xs font-bold text-foreground shadow-sm"
                              >
                                <CalendarClock className="mr-2 h-4 w-4 text-primary" />
                                {offeredDateTime ? (
                                  `${offeredDateTime.toLocaleDateString()} · ${offeredDateTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
                                ) : (
                                  "Select Time"
                                )}
                              </Button>
                            }
                          />
                        </div>
                      </div>


                      {/* Calculated Price & Submit */}
                      <div className="flex items-center gap-4 md:pl-4 border-t md:border-t-0 md:border-l border-primary/10 pt-4 md:pt-0">
                        <div className="text-right min-w-[80px]">
                          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Your Price</p>
                          <p className="text-2xl font-black text-primary tracking-tighter leading-none">${currentPrice}</p>
                        </div>
                        <Button 
                          onClick={handleSubmitOffer}
                          disabled={isSubmitting || !selectedVehicleId || driverVehicles.length === 0}
                          className="h-11 px-8 rounded-xl font-black uppercase tracking-widest shadow-md active:scale-95 group"
                        >
                          {isSubmitting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>Send Offer <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    {driverVehicles.length === 0 && (
                      <div className="flex items-center gap-2 text-[10px] font-bold text-destructive uppercase bg-destructive/5 p-3 rounded-lg border border-destructive/10">
                        <Info className="w-3.5 h-3.5" /> You need an active vehicle to make offers.
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center border border-dashed rounded-xl opacity-60 bg-muted/20 border-border/60">
              <div className="p-6 rounded-2xl bg-primary/5 mb-4 text-primary/40 ring-1 ring-primary/10 animate-float">
                <Package className="w-16 h-16" />
              </div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Select a request to bid</p>
            </div>
          )}
        </div>
      </div>

      {/* Date Suggestion Dialog */}
      <Dialog open={dateDialogOpen} onOpenChange={setDateDialogOpen}>
        <DialogContent className="rounded-2xl border-border/50 sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-black tracking-tight flex items-center gap-2">
              <CalendarClock className="text-primary w-5 h-5" /> Suggest Change
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">New Proposed Date & Time</Label>
              <DateTimePicker 
                date={offeredDateTime} 
                setDate={setOfferedDateTime} 
                placeholder="Select new time"
              />
              <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1.5 px-1 pt-1">
                <Info className="w-3.5 h-3.5 text-primary" /> Clients are more likely to accept if you stick to their requested time.
              </p>
            </div>
            <Button 
              className="w-full h-12 rounded-xl font-black uppercase tracking-widest shadow-md"
              onClick={() => setDateDialogOpen(false)}
            >
              Confirm Selection
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrowseRequests;

