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
import { moveRequestService } from "@/services/moveRequestService";
import type { MoveRequest } from "@/types";

const AdminMoveRequests = () => {
  const [requests, setRequests] = useState<MoveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await moveRequestService.getAllMoveRequests();
        setRequests(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load move requests:", err);
        setError("Failed to load move requests.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const getCity = (addr: any) => addr?.city || "—";

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Move Requests</h1>
        <p className="text-sm text-muted-foreground mt-1">
          All move requests across the platform
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
                  <TableHead>Route</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-muted-foreground py-10"
                    >
                      No move requests found.
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium">#{req.id}</TableCell>
                      <TableCell>
                        {req.clientName || `Client #${req.clientId}`}
                      </TableCell>
                      <TableCell>
                        {getCity(req.fromAddress)} → {getCity(req.toAddress)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {req.moveDate}
                      </TableCell>
                      <TableCell>${req.maxBudget}</TableCell>
                      <TableCell>
                        <StatusBadge status={req.status} />
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

export default AdminMoveRequests;
