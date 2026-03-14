import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Loader2, Info, HandCoins, Clock, Truck, ChevronRight } from "lucide-react";
import { moveOfferService } from "@/services/moveOfferService";
import { driverService } from "@/services/driverService";
import { populationFactory } from "@/services/populationFactory";
import { useToast } from "@/hooks/use-toast";
import LoadingDelight from "@/components/LoadingDelight";
import EmptyState from "@/components/EmptyState";
import { getVehicleString } from "@/utils";
import { DateTimePicker } from "@/components/DateTimePicker";
import type { MoveOfferPopulated } from "@/types";

const DriverOffers = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Edit state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<MoveOfferPopulated | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [editDate, setEditDate] = useState<Date | undefined>(undefined);

  const { data: offers = [], isLoading } = useQuery({
    queryKey: ["driverOffers"],
    queryFn: async () => {
      const data = await moveOfferService.getOffersByDriver();
      return Promise.all(
        data.map((offer) => populationFactory.populateMoveOffer(offer))
      );
    },
  });


  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: any }) => moveOfferService.updateMoveOffer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driverOffers"] });
      toast({ title: "Offer Updated", description: "Your offer has been updated successfully." });
      setEditDialogOpen(false);
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error?.response?.data?.message || "Failed to update offer.", 
        variant: "destructive" 
      });
    }
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number) => moveOfferService.cancelMoveOffer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driverOffers"] });
      toast({ title: "Offer Cancelled", description: "Your offer has been cancelled." });
    },
  });

  const handleEditClick = (offer: MoveOfferPopulated) => {
    setSelectedOffer(offer);
    setEditPrice(String(offer.price));
    setEditDate(new Date(offer.offerDate));
    setEditDialogOpen(true);
  };

  const handleUpdateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOffer || !editDate) return;
    
    updateMutation.mutate({
      id: selectedOffer.id,
      data: {
        price: parseFloat(editPrice),
        offerDate: editDate,
        status: selectedOffer.status as any,
        moveRequestId: selectedOffer.moveRequestId,
        driverId: selectedOffer.driverId,
        vehicleId: selectedOffer.vehicleId,
      }
    });
  };

  if (isLoading) return <LoadingDelight label="Loading your move offers..." />;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black tracking-tighter text-foreground flex items-center gap-3">
          <HandCoins className="w-8 h-8 text-primary" />
          My Move Offers
        </h1>
        <p className="text-muted-foreground text-sm mt-1 font-medium text-foreground/60">
          Manage and track offers you've sent to potential clients
        </p>
      </div>

      {offers.length === 0 ? (
        <EmptyState
          icon={HandCoins}
          title="No offers sent"
          description="You haven't submitted any offers yet. Head over to browse requests to find your next job."
          action={{
            label: "Browse Requests",
            onClick: () => window.location.href = "/driver/browse"
          }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {offers.map((offer) => (
            <Card key={offer.id} className="hover:border-primary/20 transition-all duration-300 group bg-card/50 backdrop-blur-sm border-border/50 shadow-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-6">
                  <div className="flex items-center gap-5 flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors ring-1 ring-primary/10">
                      <Truck className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h4 className="text-sm font-bold text-foreground tracking-tight">
                          {offer.moveRequest.fromAddress.city} → {offer.moveRequest.toAddress.city}
                        </h4>
                        <StatusBadge status={offer.status} />
                      </div>
                      <p className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                        <span>{getVehicleString(offer.vehicle)}</span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span>Offered on {new Date(offer.offerDate).toLocaleDateString()}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-10 border-t sm:border-0 pt-4 sm:pt-0">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Move Date</p>
                      <p className="text-xs font-bold text-foreground flex items-center justify-end gap-1.5 leading-none">
                        <Clock className="w-3 h-3 opacity-50" />
                        {new Date(offer.moveRequest.moveDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Offer Price</p>
                      <p className="text-xl font-black text-primary tracking-tighter leading-none">${offer.price}</p>
                    </div>
                    
                    {offer.status === "OFFER_SENT" && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-9 px-4 rounded-xl text-xs font-bold border-primary/20 text-primary hover:bg-primary/5"
                          onClick={() => handleEditClick(offer)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-9 w-9 rounded-xl text-destructive hover:bg-destructive/5"
                          onClick={() => cancelMutation.mutate(offer.id)}
                          title="Cancel Offer"
                        >
                          <Loader2 className={cancelMutation.isPending ? "animate-spin w-4 h-4" : "hidden"} />
                          {!cancelMutation.isPending && <span className="text-lg">×</span>}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Offer Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="rounded-2xl border-border/50">
          <DialogHeader>
            <DialogTitle className="text-xl font-black tracking-tight">Edit Move Offer</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateOffer} className="space-y-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Price ($)</Label>
              <Input
                id="price"
                type="number"
                value={editPrice}
                readOnly
                className="h-12 bg-secondary/30 border-border/50 font-bold text-lg rounded-xl"
              />
              <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1.5 px-1">
                <Info className="w-3.5 h-3.5 text-primary" /> Price is fixed based on vehicle rate and distance.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Offer Date & Time</Label>
              <DateTimePicker 
                date={editDate} 
                setDate={setEditDate} 
                placeholder="Select offer date & time"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl font-black uppercase tracking-widest shadow-md"
              disabled={updateMutation.isPending || !editDate}
            >
              {updateMutation.isPending ? (
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
