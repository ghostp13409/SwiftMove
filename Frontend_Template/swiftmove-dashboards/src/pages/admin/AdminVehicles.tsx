import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Truck } from "lucide-react";
import { mockVehicles, mockDrivers } from "@/data/mockData";

const AdminVehicles = () => {
  const getDriverName = (driverId: number) => {
    const driver = mockDrivers.find((d) => d.id === driverId);
    return driver?.user ? `${driver.user.firstName} ${driver.user.lastName}` : "Unknown";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Vehicles</h1>
        <p className="text-sm text-muted-foreground mt-1">All registered vehicles across the platform</p>
      </div>
      <Card className="shadow-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price/km</TableHead>
                <TableHead>Furniture</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockVehicles.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-medium">{v.year} {v.make} {v.model}</TableCell>
                  <TableCell>{getDriverName(v.driverId)}</TableCell>
                  <TableCell><Badge variant="secondary">{v.vehicleType}</Badge></TableCell>
                  <TableCell>${v.pricePerKm}</TableCell>
                  <TableCell>{v.canCarryFurniture ? "✅" : "—"}</TableCell>
                  <TableCell><Badge variant={v.isActive ? "default" : "secondary"}>{v.isActive ? "Active" : "Inactive"}</Badge></TableCell>
                  <TableCell><Button size="sm" variant="ghost" className="text-xs">View</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminVehicles;
