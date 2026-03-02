import StatusBadge from "@/components/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockMoveRequests } from "@/data/mockData";

const AdminMoveRequests = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="text-2xl font-bold">Move Requests</h1>
      <p className="text-sm text-muted-foreground mt-1">All move requests across the platform</p>
    </div>
    <Card className="shadow-card">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Offers</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockMoveRequests.map((req) => (
              <TableRow key={req.id}>
                <TableCell className="font-medium">#{req.id}</TableCell>
                <TableCell>{req.clientName}</TableCell>
                <TableCell>{req.fromAddress.city} → {req.toAddress.city}</TableCell>
                <TableCell className="text-muted-foreground">{req.moveDate}</TableCell>
                <TableCell>${req.maxBudget}</TableCell>
                <TableCell>{req.offersCount}</TableCell>
                <TableCell><StatusBadge status={req.status} /></TableCell>
                <TableCell><Button size="sm" variant="ghost" className="text-xs">View</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default AdminMoveRequests;
