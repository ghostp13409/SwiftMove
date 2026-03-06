import { useEffect, useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { clientService } from "@/services/clientService";
import { moveOfferService } from "@/services/moveOfferService";
import { moveRequestService } from "@/services/moveRequestService";
import { addressService } from "@/services/addressService";
import type { MoveRequest, MoveOffer } from "@/types";

const ClientMoveRequests = () => {
  const { userId } = useAuth();
  const { toast } = useToast();
  const [selected, setSelected] = useState<MoveRequest | null>(null);
  const [myRequests, setMyRequests] = useState<MoveRequest[]>([]);
  const [offersForRequest, setOffersForRequest] = useState<MoveOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form state
  const [fromLine1, setFromLine1] = useState("");
  const [fromCity, setFromCity] = useState("");
  const [fromState, setFromState] = useState("");
  const [fromPostal, setFromPostal] = useState("");
  const [toLine1, setToLine1] = useState("");
  const [toCity, setToCity] = useState("");
  const [toState, setToState] = useState("");
  const [toPostal, setToPostal] = useState("");
  const [moveDate, setMoveDate] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!userId) return;
    fetchRequests();
  }, [userId]);

  const fetchRequests = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const data = await clientService.getActiveRequests(userId);
      setMyRequests(Array.isArray(data) ? (data as MoveRequest[]) : []);
    } catch (err) {
      console.error("Failed to load move requests:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRequest = async (req: MoveRequest) => {
    setSelected(req);
    try {
      const offers = await moveOfferService.getOffersByMoveRequest(req.id);
      setOffersForRequest(Array.isArray(offers) ? offers : []);
    } catch {
      setOffersForRequest([]);
    }
  };

  const handleAcceptOffer = async (offerId: number) => {
    try {
      await moveOfferService.acceptOffer(offerId);
      toast({
        title: "Offer Accepted",
        description: "The move offer has been accepted.",
      });
      if (selected) handleSelectRequest(selected);
      fetchRequests();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to accept offer.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !userId ||
      !fromLine1 ||
      !fromCity ||
      !toLine1 ||
      !toCity ||
      !moveDate ||
      !maxBudget
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      // Create from/to addresses first
      const [fromAddr, toAddr] = await Promise.all([
        addressService.createAddress({
          line1: fromLine1,
          city: fromCity,
          stateOrProvince: fromState,
          country: "Canada",
          postalOrZipCode: fromPostal,
        }),
        addressService.createAddress({
          line1: toLine1,
          city: toCity,
          stateOrProvince: toState,
          country: "Canada",
          postalOrZipCode: toPostal,
        }),
      ]);

      await clientService.addMoveRequest(userId, {
        clientId: userId,
        fromAddressId: fromAddr.id,
        toAddressId: toAddr.id,
        moveDate,
        maxBudget: parseFloat(maxBudget),
        status: "PENDING",
      });

      toast({
        title: "Request Created",
        description: "Your move request has been submitted.",
      });
      setDialogOpen(false);
      // Reset form
      setFromLine1("");
      setFromCity("");
      setFromState("");
      setFromPostal("");
      setToLine1("");
      setToCity("");
      setToState("");
      setToPostal("");
      setMoveDate("");
      setMaxBudget("");
      setNotes("");
      fetchRequests();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create move request.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Move Requests</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your moving requests
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-brand text-primary-foreground border-0 gap-2">
              <Plus className="w-4 h-4" /> New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Move Request</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  From Address
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Street address"
                    value={fromLine1}
                    onChange={(e) => setFromLine1(e.target.value)}
                    className="col-span-2"
                  />
                  <Input
                    placeholder="City"
                    value={fromCity}
                    onChange={(e) => setFromCity(e.target.value)}
                  />
                  <Input
                    placeholder="Province (e.g. ON)"
                    value={fromState}
                    onChange={(e) => setFromState(e.target.value)}
                  />
                  <Input
                    placeholder="Postal code"
                    value={fromPostal}
                    onChange={(e) => setFromPostal(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  To Address
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Street address"
                    value={toLine1}
                    onChange={(e) => setToLine1(e.target.value)}
                    className="col-span-2"
                  />
                  <Input
                    placeholder="City"
                    value={toCity}
                    onChange={(e) => setToCity(e.target.value)}
                  />
                  <Input
                    placeholder="Province (e.g. ON)"
                    value={toState}
                    onChange={(e) => setToState(e.target.value)}
                  />
                  <Input
                    placeholder="Postal code"
                    value={toPostal}
                    onChange={(e) => setToPostal(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Move Date</Label>
                  <Input
                    type="datetime-local"
                    value={moveDate}
                    onChange={(e) => setMoveDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Budget ($)</Label>
                  <Input
                    type="number"
                    placeholder="500"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  placeholder="Any special instructions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
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
                  "Submit Request"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Request List */}
          <div className="lg:col-span-1 space-y-3">
            {myRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No move requests yet. Create one to get started!
              </p>
            ) : (
              myRequests.map((req) => (
                <Card
                  key={req.id}
                  className={`cursor-pointer transition-all hover:shadow-card-lg ${selected?.id === req.id ? "ring-2 ring-primary" : "shadow-card"}`}
                  onClick={() => handleSelectRequest(req)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-sm">
                        {req.fromAddress?.city || "—"} →{" "}
                        {req.toAddress?.city || "—"}
                      </p>
                      <StatusBadge status={req.status} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {req.moveDate} · ${req.maxBudget} budget
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {(req.luggageEntries ?? []).reduce(
                        (s, l) => s + l.quantity,
                        0,
                      )}{" "}
                      items
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Detail */}
          <div className="lg:col-span-2">
            {selected ? (
              <Card className="shadow-card">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      {selected.fromAddress?.city || "—"} →{" "}
                      {selected.toAddress?.city || "—"}
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
                        {selected.fromAddress?.city || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">To</p>
                      <p>
                        {selected.toAddress?.line1 || "—"},{" "}
                        {selected.toAddress?.city || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Move Date</p>
                      <p>{selected.moveDate}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">
                        Max Budget
                      </p>
                      <p>${selected.maxBudget}</p>
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

                  {/* Offers */}
                  <div>
                    <h3 className="font-semibold text-sm mb-3">
                      Offers ({offersForRequest.length})
                    </h3>
                    {offersForRequest.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No offers yet
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {offersForRequest.map((offer) => (
                          <div
                            key={offer.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                          >
                            <div>
                              <p className="text-sm font-medium">
                                {offer.driverName ||
                                  `Driver #${offer.driverId}`}
                                {offer.driverRating != null && (
                                  <span className="text-xs text-muted-foreground">
                                    {" "}
                                    ⭐ {offer.driverRating}
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {offer.vehicleInfo ||
                                  `Vehicle #${offer.vehicleId}`}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-sm">
                                ${offer.price}
                              </span>
                              <StatusBadge status={offer.status} />
                              {offer.status === "OFFER_SENT" &&
                                selected.status === "PENDING" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-xs"
                                    onClick={() => handleAcceptOffer(offer.id)}
                                  >
                                    Accept
                                  </Button>
                                )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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
      )}
    </div>
  );
};

export default ClientMoveRequests;
