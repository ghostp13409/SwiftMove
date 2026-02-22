import StatusBadge from "@/components/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockMoveOffers } from "@/data/mockData";

const AdminMoveOffers = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="text-2xl font-bold">Move Offers</h1>
      <p className="text-sm text-muted-foreground mt-1">All move offers across the platform</p>
    </div>
    <Card className="shadow-card">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Request</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockMoveOffers.map((offer) => (
              <TableRow key={offer.id}>
                <TableCell className="font-medium">#{offer.id}</TableCell>
                <TableCell>{offer.driverName}</TableCell>
                <TableCell>Request #{offer.moveRequestId}</TableCell>
                <TableCell className="text-muted-foreground">{offer.vehicleInfo}</TableCell>
                <TableCell className="font-semibold">${offer.price}</TableCell>
                <TableCell>⭐ {offer.driverRating}</TableCell>
                <TableCell><StatusBadge status={offer.status} /></TableCell>
                <TableCell><Button size="sm" variant="ghost" className="text-xs">View</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default AdminMoveOffers;
