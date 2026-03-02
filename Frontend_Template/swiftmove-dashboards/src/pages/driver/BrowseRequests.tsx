import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/StatusBadge";
import { mockMoveRequests, mockVehicles } from "@/data/mockData";
import type { MoveRequest } from "@/types";

const BrowseRequests = () => {
  const [selected, setSelected] = useState<MoveRequest | null>(null);
  const pendingRequests = mockMoveRequests.filter((r) => r.status === "PENDING");
  const driverVehicles = mockVehicles.filter((v) => v.driverId === 1 && v.isActive);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Browse Move Requests</h1>
        <p className="text-sm text-muted-foreground mt-1">Find and bid on available moves</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-3">
          {pendingRequests.map((req) => (
            <Card key={req.id} className={`cursor-pointer transition-all hover:shadow-card-lg ${selected?.id === req.id ? "ring-2 ring-primary" : "shadow-card"}`} onClick={() => setSelected(req)}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium text-sm">{req.fromAddress.city} → {req.toAddress.city}</p>
                  <StatusBadge status={req.status} />
                </div>
                <p className="text-xs text-muted-foreground">{req.moveDate} · Budget: ${req.maxBudget}</p>
                <p className="text-xs text-muted-foreground mt-1">{req.luggageEntries.reduce((s, l) => s + l.quantity, 0)} items {req.hasFurniture ? "· 🛋 Furniture" : ""}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{selected.fromAddress.city} → {selected.toAddress.city}</CardTitle>
                  <StatusBadge status={selected.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-muted-foreground text-xs">From</p><p>{selected.fromAddress.line1}, {selected.fromAddress.city}</p></div>
                  <div><p className="text-muted-foreground text-xs">To</p><p>{selected.toAddress.line1}, {selected.toAddress.city}</p></div>
                  <div><p className="text-muted-foreground text-xs">Move Date</p><p>{selected.moveDate}</p></div>
                  <div><p className="text-muted-foreground text-xs">Max Budget</p><p className="font-semibold">${selected.maxBudget}</p></div>
                  <div><p className="text-muted-foreground text-xs">Client</p><p>{selected.clientName}</p></div>
                  <div><p className="text-muted-foreground text-xs">Existing Offers</p><p>{selected.offersCount}</p></div>
                </div>

                <div>
                  <p className="text-muted-foreground text-xs mb-2">Luggage</p>
                  <div className="flex gap-2 flex-wrap">
                    {selected.luggageEntries.map((l, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-md bg-secondary">{l.quantity}x {l.luggageType}</span>
                    ))}
                    {selected.hasFurniture && <span className="text-xs px-2 py-1 rounded-md bg-warning/10 text-warning">🛋 Furniture</span>}
                  </div>
                </div>

                {selected.notes && <div><p className="text-muted-foreground text-xs">Notes</p><p className="text-sm">{selected.notes}</p></div>}

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gradient-brand text-primary-foreground border-0">Make an Offer</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Submit Offer</DialogTitle></DialogHeader>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label>Vehicle</Label>
                        <Select>
                          <SelectTrigger><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                          <SelectContent>
                            {driverVehicles.map((v) => (
                              <SelectItem key={v.id} value={String(v.id)}>{v.make} {v.model} ({v.vehicleType})</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Price ($)</Label>
                        <Input type="number" placeholder="Enter your price" />
                      </div>
                      <div className="space-y-2">
                        <Label>Offered Date & Time</Label>
                        <Input type="datetime-local" defaultValue={selected.moveDate + "T09:00"} />
                      </div>
                      <Button type="button" className="w-full gradient-brand text-primary-foreground border-0">Submit Offer</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-card flex items-center justify-center h-64">
              <p className="text-muted-foreground text-sm">Select a request to view details</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseRequests;
