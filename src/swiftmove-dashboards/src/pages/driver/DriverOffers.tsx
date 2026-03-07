import { useState, useEffect } from "react";
import StatusBadge from "@/components/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { moveOfferService } from "@/services/moveOfferService";
import { driverService } from "@/services/driverService";
import { populationFactory } from "@/services/populationFactory";
import type { MoveOfferPopulated, DriverInfo } from "@/types";
import { getVehicleString } from "@/utils";

const DriverOffers = () => {
  const [myOffers, setMyOffers] = useState<MoveOfferPopulated[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
    fetchOffers();
  }, []);

  const handleCancelOffer = async (offerId: number) => {
    try {
      await moveOfferService.deleteMoveOffer(offerId);
      setMyOffers((prev) => prev.filter((o) => o.id !== offerId));
    } catch (err: any) {
      alert(
        err?.response?.data?.message ??
          err?.message ??
          "Failed to cancel offer.",
      );
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
    </div>
  );
};

export default DriverOffers;
