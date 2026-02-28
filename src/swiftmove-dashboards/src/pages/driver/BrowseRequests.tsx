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
import StatusBadge from "@/components/StatusBadge";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { moveRequestService } from "@/services/moveRequestService";
import { moveOfferService } from "@/services/moveOfferService";
import { driverService } from "@/services/driverService";
import { vehicleService } from "@/services/vehicleService";
import { useToast } from "@/hooks/use-toast";
import type { MoveRequest, Vehicle, Driver } from "@/types";

const BrowseRequests = () => {
  const { userId } = useAuth();
  const { toast } = useToast();
  const [selected, setSelected] = useState<MoveRequest | null>(null);
  const [pendingRequests, setPendingRequests] = useState<MoveRequest[]>([]);
  const [driverVehicles, setDriverVehicles] = useState<Vehicle[]>([]);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);

  // Offer form state
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [offeredDateTime, setOfferedDateTime] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqRes, driverRes] = await Promise.allSettled([
          moveRequestService.getAllMoveRequests(),
          driverService.getCurrentDriver(),
        ]);

        if (reqRes.status === "fulfilled") {
          setPendingRequests(
            (reqRes.value as MoveRequest[]).filter(
              (r) => r.status === "PENDING",
            ),
          );
        }

        if (driverRes.status === "fulfilled") {
          const driverData = driverRes.value;
          setDriver(driverData);
          const vehicles = await vehicleService.getVehiclesByDriver(
            driverData.id,
          );
          setDriverVehicles((vehicles as Vehicle[]).filter((v) => v.isActive));
        }
      } catch (err) {
        console.error("Failed to load browse requests data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !driver ||
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
        moveRequestId: selected.id as number,
        driverId: driver.id,
        vehicleId: parseInt(selectedVehicleId),
        price: parseFloat(offerPrice),
        offeredDate: offeredDateTime.replace("T", " ") + ":00",
        statusId: 1,
      });
      toast({
        title: "Offer Submitted",
        description: "Your offer has been submitted successfully.",
      });
      setOfferDialogOpen(false);
      setSelectedVehicleId("");
      setOfferPrice("");
      setOfferedDateTime("");
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to submit offer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCity = (addr: any) => addr?.city || "—";

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
              No pending move requests available.
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
                      {getCity(req.fromAddress)} → {getCity(req.toAddress)}
                    </p>
                    <StatusBadge status={req.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {req.moveDate} · Budget: ${req.maxBudget}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(req.luggageEntries ?? []).reduce(
                      (s, l) => s + l.quantity,
                      0,
                    )}{" "}
                    items
                    {req.hasFurniture ? " · 🛋 Furniture" : ""}
                  </p>
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
                  <CardTitle className="text-lg">
                    {getCity(selected.fromAddress)} →{" "}
                    {getCity(selected.toAddress)}
                  </CardTitle>
                  <StatusBadge status={selected.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">From</p>
                    <p>
                      {selected.fromAddress?.line1 || "—"},{" "}
                      {getCity(selected.fromAddress)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">To</p>
                    <p>
                      {selected.toAddress?.line1 || "—"},{" "}
                      {getCity(selected.toAddress)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Move Date</p>
                    <p>{selected.moveDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Max Budget</p>
                    <p className="font-semibold">${selected.maxBudget}</p>
                  </div>
                  {selected.clientName && (
                    <div>
                      <p className="text-muted-foreground text-xs">Client</p>
                      <p>{selected.clientName}</p>
                    </div>
                  )}
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
                          {l.luggageType || `Type #${l.luggageTypeId}`}
                        </span>
                      ))}
                      {selected.hasFurniture && (
                        <span className="text-xs px-2 py-1 rounded-md bg-warning/10 text-warning">
                          🛋 Furniture
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {selected.notes && (
                  <div>
                    <p className="text-muted-foreground text-xs">Notes</p>
                    <p className="text-sm">{selected.notes}</p>
                  </div>
                )}

                <Dialog
                  open={offerDialogOpen}
                  onOpenChange={setOfferDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      className="gradient-brand text-primary-foreground border-0"
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
                            {driverVehicles.map((v) => (
                              <SelectItem key={v.id} value={String(v.id)}>
                                {v.year} {v.make} {v.model} (
                                {v.vehicleType || "—"})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Price ($)</Label>
                        <Input
                          type="number"
                          placeholder="Enter your price"
                          value={offerPrice}
                          onChange={(e) => setOfferPrice(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Offered Date & Time</Label>
                        <Input
                          type="datetime-local"
                          value={offeredDateTime}
                          onChange={(e) => setOfferedDateTime(e.target.value)}
                          defaultValue={selected.moveDate + "T09:00"}
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full gradient-brand text-primary-foreground border-0"
                        disabled={isSubmitting}
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
