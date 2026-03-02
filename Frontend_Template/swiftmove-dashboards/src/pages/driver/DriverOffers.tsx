import StatusBadge from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockMoveOffers } from "@/data/mockData";

const DriverOffers = () => {
  const myOffers = mockMoveOffers.filter((o) => o.driverId === 1);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">My Offers</h1>
        <p className="text-sm text-muted-foreground mt-1">Track your submitted move offers</p>
      </div>

      <div className="space-y-3">
        {myOffers.map((offer) => (
          <Card key={offer.id} className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-medium">Request #{offer.moveRequestId}</p>
                    <StatusBadge status={offer.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">{offer.vehicleInfo} · Offered: {offer.offeredTime.split("T")[0]}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">${offer.price}</p>
                  <p className="text-xs text-muted-foreground">{offer.createdAt}</p>
                </div>
                {offer.status === "PENDING" && (
                  <div className="ml-4 flex gap-2">
                    <Button size="sm" variant="outline" className="text-xs">Edit</Button>
                    <Button size="sm" variant="destructive" className="text-xs">Cancel</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DriverOffers;
