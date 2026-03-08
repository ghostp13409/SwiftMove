import { useState, useEffect } from "react";
import StatusBadge from "@/components/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { moveOfferService } from "@/services/moveOfferService";
import { driverService } from "@/services/driverService";
import { populationFactory } from "@/services/populationFactory";
import { useToast } from "@/hooks/use-toast";
import type { MoveOfferPopulated, DriverInfo } from "@/types";
import { getVehicleString } from "@/utils";

const DriverOffers = () => {
  const { toast } = useToast();
  const [myOffers, setMyOffers] = useState<MoveOfferPopulated[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Edit state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<MoveOfferPopulated | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [editDate, setEditDate] = useState("");

  const fetchOffers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const driver: DriverInfo = await driverService.getCurrentDriver();
      const offers = await moveOfferService.getOffersByDriver(driver.id);
      const populatedOffers = await Promise.all(
        offers.map((offer) => populationFactory.populateMoveOffer(offer))
      );
      setMyOffers(populatedOffers);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          err?.message ??
          "Failed to load offers.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleEditClick = (offer: MoveOfferPopulated) => {
    setSelectedOffer(offer);
    setEditPrice(String(offer.price));
    // Format for datetime-local
    const d = new Date(offer.offerDate);
    const formattedDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    setEditDate(formattedDate);
    setEditDialogOpen(true);
  };

  const handleUpdateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOffer) return;
    
    setIsSubmitting(true);
    try {
      await moveOfferService.updateMoveOffer(selectedOffer.id, {
        price: parseFloat(editPrice),
        offerDate: new Date(editDate),
        status: selectedOffer.status as any,
        moveRequestId: selectedOffer.moveRequestId,
        driverId: selectedOffer.driverId,
        vehicleId: selectedOffer.vehicleId,
      });
      
      toast({
        title: "Offer Updated",
        description: "Your offer has been updated successfully.",
      });
      setEditDialogOpen(false);
      fetchOffers();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update offer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelOffer = async (offerId: number) => {
    if (!confirm("Are you sure you want to cancel this offer?")) return;
    try {
      await moveOfferService.cancelMoveOffer(offerId);
      toast({
        title: "Offer Cancelled",
        description: "Your offer has been cancelled.",
      });
      fetchOffers();
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to cancel offer.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">My Offers</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your submitted move offers
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )}

      {error && (
        <div className="rounded-md bg-destructive/10 text-destructive px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {!isLoading && !error && myOffers.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="flex items-center justify-center h-32 text-muted-foreground">
            No offers submitted yet.
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && (
        <div className="space-y-3">
          {myOffers.map((offer) => (
            <Card key={offer.id} className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-medium">
                        Request #{offer.moveRequestId} ({offer.moveRequest.fromAddress.city} → {offer.moveRequest.toAddress.city})
                      </p>
                      <StatusBadge status={offer.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {getVehicleString(offer.vehicle)} · 
                      Offer date: {offer.offerDate.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">${offer.price}</p>
                    <p className="text-xs text-muted-foreground">
                      {offer.moveRequest.moveDate.toLocaleDateString()}
                    </p>
                  </div>
                  {offer.status === "OFFER_SENT" && (
                    <div className="ml-4 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs border-primary/30 text-primary hover:bg-primary/5"
                        onClick={() => handleEditClick(offer)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="text-xs"
                        onClick={() => handleCancelOffer(offer.id)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Offer Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Move Offer</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateOffer} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Offer Date & Time</Label>
              <Input
                id="date"
                type="datetime-local"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full gradient-brand text-primary-foreground border-0"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...
                </>
              ) : (
                "Update Offer"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DriverOffers;
