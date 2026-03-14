import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Loader2, Armchair, Info, MapPin, ExternalLink, Map as MapIcon } from "lucide-react";
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
  const [pendingRequests, setPendingRequests] = useState<
    MoveRequestPopulated[]
  >([]);
  const [driverVehicles, setDriverVehicles] = useState<Vehicle[]>([]);
  const [driverInfo, setDriverInfo] = useState<DriverInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);

  // Offer form state
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [offeredDateTime, setOfferedDateTime] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
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
          setDriverVehicles(vehicles.filter((v) => v.isActive));
        }
      } catch (err) {
        console.error("Failed to load browse requests data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  // Update offer price when vehicle changes
  useEffect(() => {
    if (selectedVehicleId && selected) {
      const vehicle = driverVehicles.find(v => v.id === parseInt(selectedVehicleId));
      if (vehicle && selected.distance) {
        const calculatedPrice = selected.distance * vehicle.pricePerKm;
        setOfferPrice(calculatedPrice.toFixed(2));
      }
    } else {
      setOfferPrice("");
    }
  }, [selectedVehicleId, selected, driverVehicles]);

  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !driverInfo ||
      !selected ||
      !selectedVehicleId ||
      !offerPrice ||
      !offeredDateTime
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await moveOfferService.createMoveOffer({
        moveRequestId: selected.id,
        driverId: driverInfo.userId,
        vehicleId: parseInt(selectedVehicleId),
        price: parseFloat(offerPrice),
        offerDate: offeredDateTime,
        status: "OFFER_SENT",
      });
      toast({
        title: "Offer Submitted",
        description: "Your offer has been submitted successfully.",
      });
      setOfferDialogOpen(false);
      setSelectedVehicleId("");
      setOfferPrice("");
      setOfferedDateTime(undefined);
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err?.response?.data?.message ||
          "Failed to submit offer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredVehicles = selected?.hasFurniture
    ? driverVehicles.filter((v) => v.canCarryFurniture)
    : driverVehicles;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Browse Move Requests</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Find and bid on available moves
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-3">
          {pendingRequests.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No available move requests.
            </p>
          ) : (
            pendingRequests.map((req) => (
              <Card
                key={req.id}
                className={`cursor-pointer transition-all hover:shadow-card-lg ${selected?.id === req.id ? "ring-2 ring-primary" : "shadow-card"}`}
                onClick={() => setSelected(req)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium text-sm">
                      {req.fromAddress.city} → {req.toAddress.city}
                    </p>
                    <StatusBadge status={req.status} />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>
                      {req.moveDate.toLocaleDateString()}
                    </span>
                    {req.hasFurniture && (
                      <Armchair className="w-3 h-3 text-primary" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
                    <MapPin className="w-3 h-3" />
                    <span>{req.distance?.toFixed(1) || "0.0"} km</span>
                    <span className="mx-1">·</span>
                    <span>{(req.luggageEntries ?? []).reduce((s, l) => s + l.quantity, 0)} items</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      {selected.fromAddress.city} → {selected.toAddress.city}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selected.hasFurniture && (
                        <Badge
                          variant="secondary"
                          className="gap-1 bg-primary/10 text-primary border-0 rounded-lg px-2 text-[10px] h-5"
                        >
                          <Armchair className="w-3 h-3" /> Includes Furniture
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className="gap-1 border-primary/20 text-primary/80 rounded-lg px-2 text-[10px] h-5"
                      >
                        <MapPin className="w-3 h-3" /> {selected.distance?.toFixed(2) || "0.00"} km
                      </Badge>
                    </div>
                  </div>
                  <StatusBadge status={selected.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-muted-foreground text-xs">From</p>
                      <a 
                        href={getGoogleMapsAddressLink(selected.fromAddress)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] text-primary hover:underline flex items-center gap-1 font-medium"
                      >
                        Map <ExternalLink className="w-2 h-2" />
                      </a>
                    </div>
                    <p>
                      {selected.fromAddress.line1}, {selected.fromAddress.city}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-muted-foreground text-xs">To</p>
                      <a 
                        href={getGoogleMapsAddressLink(selected.toAddress)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] text-primary hover:underline flex items-center gap-1 font-medium"
                      >
                        Map <ExternalLink className="w-2 h-2" />
                      </a>
                    </div>
                    <p>
                      {selected.toAddress.line1}, {selected.toAddress.city}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Move Date</p>
                    <p>{selected.moveDate.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Distance</p>
                    <div className="flex items-center gap-2">
                      <p>{selected.distance?.toFixed(2) || "0.00"} km</p>
                      <a 
                        href={getGoogleMapsDirectionsLink(selected.fromAddress, selected.toAddress)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] text-primary hover:underline flex items-center gap-1 font-medium"
                      >
                        View Route <MapIcon className="w-2 h-2" />
                      </a>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Client</p>
                    <p>
                      {selected.client.firstName} {selected.client.lastName}
                    </p>
                  </div>
                </div>

                {(selected.luggageEntries ?? []).length > 0 && (
                  <div>
                    <p className="text-muted-foreground text-xs mb-2">
                      Luggage
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {selected.luggageEntries!.map((l, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 rounded-md bg-secondary"
                        >
                          {l.quantity}x{" "}
                          {l.luggageType?.name || `Type #${l.luggageTypeId}`}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <Dialog
                  open={offerDialogOpen}
                  onOpenChange={(open) => {
                    setOfferDialogOpen(open);
                    if (!open) {
                      setSelectedVehicleId("");
                      setOfferPrice("");
                      setOfferedDateTime(undefined);
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      disabled={driverVehicles.length === 0}
                    >
                      {driverVehicles.length === 0
                        ? "Add a vehicle to make offers"
                        : "Make an Offer"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Submit Offer for Request #{selected.id}
                      </DialogTitle>
                    </DialogHeader>
                    {selected.hasFurniture && filteredVehicles.length === 0 ? (
                      <div className="py-6 text-center space-y-3">
                        <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                          <Armchair className="w-6 h-6 text-destructive" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-destructive">
                            Furniture Handling Required
                          </p>
                          <p className="text-xs text-muted-foreground px-4">
                            This move request contains furniture. You don't have
                            any active vehicles capable of carrying furniture.
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          onClick={() => setOfferDialogOpen(false)}
                        >
                          <a href="/driver/vehicles">Manage Vehicles</a>
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmitOffer} className="space-y-4">
                        <div className="space-y-2">
                          <Label>Vehicle</Label>
                          <Select
                            onValueChange={setSelectedVehicleId}
                            value={selectedVehicleId}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select vehicle" />
                            </SelectTrigger>
                            <SelectContent>
                              {filteredVehicles.map((v) => (
                                <SelectItem key={v.id} value={String(v.id)}>
                                  {getVehicleString(v)} (${v.pricePerKm}/km)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {selected.hasFurniture && (
                            <p className="text-[10px] text-primary font-medium flex items-center gap-1">
                              <Info className="w-3 h-3" /> Showing only
                              furniture-capable vehicles
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label>Calculated Price ($)</Label>
                            {selectedVehicleId && (
                              <span className="text-[10px] text-muted-foreground">
                                {selected.distance?.toFixed(2)} km × ${driverVehicles.find(v => v.id === parseInt(selectedVehicleId))?.pricePerKm}/km
                              </span>
                            )}
                          </div>
                          <Input
                            type="number"
                            placeholder="Price will be calculated automatically"
                            value={offerPrice}
                            readOnly
                            className="bg-secondary/50 font-semibold"
                          />
                          <p className="text-[10px] text-muted-foreground italic">
                            Price is automatically calculated based on vehicle rate and distance.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label>Offer Date & Time</Label>
                          <DateTimePicker 
                            date={offeredDateTime} 
                            setDate={setOfferedDateTime} 
                            placeholder="Select offer date & time"
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isSubmitting || !offerPrice || !offeredDateTime}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                              Submitting...
                            </>
                          ) : (
                            "Submit Offer"
                          )}
                        </Button>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-card flex items-center justify-center h-64">
              <p className="text-muted-foreground text-sm">
                Select a request to view details
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseRequests;
