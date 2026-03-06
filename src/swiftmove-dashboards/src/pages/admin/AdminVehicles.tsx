import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { vehicleService } from "@/services/vehicleService";
import { Vehicle } from "@/types";
const AdminVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await vehicleService.getVehicles();
        setVehicles(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load vehicles:", err);
        setError("Failed to load vehicles.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Vehicles</h1>
        <p className="text-sm text-muted-foreground mt-1">
          All registered vehicles across the platform
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
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Driver ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price/km</TableHead>
                  <TableHead>Furniture</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-muted-foreground py-10"
                    >
                      No vehicles found.
                    </TableCell>
                  </TableRow>
                ) : (
                  vehicles.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell className="font-medium">
                        {v.year} {v.make} {v.model}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        #{v.driverId}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {v.vehicleType || `Type #${v.vehicleTypeId}`}
                        </Badge>
                      </TableCell>
                      <TableCell>${v.pricePerKm}/km</TableCell>
                      <TableCell>{v.canCarryFurniture ? "✅" : "—"}</TableCell>
                      <TableCell>
                        <Badge variant={v.isActive ? "default" : "secondary"}>
                          {v.isActive ? "Active" : "Inactive"}
                        </Badge>
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

export default AdminVehicles;
