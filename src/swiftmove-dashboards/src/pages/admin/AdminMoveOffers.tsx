import { useEffect, useState } from "react";
import StatusBadge from "@/components/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { moveOfferService } from "@/services/moveOfferService";
import type { MoveOffer } from "@/types";

const AdminMoveOffers = () => {
  const [offers, setOffers] = useState<MoveOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await moveOfferService.getAllMoveOffers();
        setOffers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load move offers:", err);
        setError("Failed to load move offers.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOffers();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Move Offers</h1>
        <p className="text-sm text-muted-foreground mt-1">
          All move offers across the platform
        </p>
      </div>
      <Card className="shadow-card">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12 text-destructive text-sm">
              {error}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Request</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-muted-foreground py-10"
                    >
                      No move offers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  offers.map((offer) => (
                    <TableRow key={offer.id}>
                      <TableCell className="font-medium">#{offer.id}</TableCell>
                      <TableCell>
                        {offer.driverName || `Driver #${offer.driverId}`}
                      </TableCell>
                      <TableCell>Request #{offer.moveRequestId}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {offer.vehicleInfo || `Vehicle #${offer.vehicleId}`}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ${offer.price}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={offer.status} />
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" className="text-xs">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMoveOffers;
