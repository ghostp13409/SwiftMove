import StatusBadge from "@/components/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockMoveTrips } from "@/data/mockData";

const AdminTrips = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="text-2xl font-bold">Move Trips</h1>
      <p className="text-sm text-muted-foreground mt-1">All confirmed trips across the platform</p>
    </div>
    <Card className="shadow-card">
      <CardContent className="p-0">
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
            {mockMoveTrips.map((trip) => (
              <TableRow key={trip.id}>
                <TableCell className="font-medium">#{trip.id}</TableCell>
                <TableCell>{trip.clientName}</TableCell>
                <TableCell>{trip.driverName}</TableCell>
                <TableCell>{trip.fromAddress.city} → {trip.toAddress.city}</TableCell>
                <TableCell className="text-muted-foreground">{trip.startTime.split("T")[0]}</TableCell>
                <TableCell className="font-semibold">${trip.price}</TableCell>
                <TableCell><StatusBadge status={trip.status} /></TableCell>
                <TableCell><Button size="sm" variant="ghost" className="text-xs">View</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default AdminTrips;
