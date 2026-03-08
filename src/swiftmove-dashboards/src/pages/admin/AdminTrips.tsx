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
import { tripService } from "@/services/tripService";
import { populationFactory } from "@/services/populationFactory";
import type { MoveTripDetailed } from "@/types";

const AdminTrips = () => {
  const [trips, setTrips] = useState<MoveTripDetailed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await tripService.getAllTrips();
        const populatedData = await Promise.all(
          data.map((trip) => populationFactory.populateMoveTripDetailed(trip)),
        );
        setTrips(populatedData);
      } catch (err) {
        console.error("Failed to load trips:", err);
        setError("Failed to load trips.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrips();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Move Trips</h1>
        <p className="text-sm text-muted-foreground mt-1">
          All confirmed trips across the platform
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
                  <TableHead>Client</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trips.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center text-muted-foreground py-10"
                    >
                      No trips found.
                    </TableCell>
                  </TableRow>
                ) : (
                  trips.map((trip) => (
                    <TableRow key={trip.id}>
                      <TableCell className="font-medium">#{trip.id}</TableCell>
                      <TableCell>
                        {trip.moveRequestPopulated.client.firstName}{" "}
                        {trip.moveRequestPopulated.client.lastName}
                      </TableCell>
                      <TableCell>
                        {trip.moveOfferPopulated.driver.user.firstName}{" "}
                        {trip.moveOfferPopulated.driver.user.lastName}
                      </TableCell>
                      <TableCell>
                        {trip.moveRequestPopulated.fromAddress.city} →{" "}
                        {trip.moveRequestPopulated.toAddress.city}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {trip.moveRequestPopulated.moveDate.toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ${trip.moveOfferPopulated.price}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={trip.status} />
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

export default AdminTrips;
