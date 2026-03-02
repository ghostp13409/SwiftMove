import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";
import { mockMoveRequests, mockMoveOffers } from "@/data/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { MoveRequest } from "@/types";

const ClientMoveRequests = () => {
  const [selected, setSelected] = useState<MoveRequest | null>(null);
  const myRequests = mockMoveRequests.filter((r) => r.clientId === 1);

  const offersForRequest = selected ? mockMoveOffers.filter((o) => o.moveRequestId === selected.id) : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Move Requests</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your moving requests</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gradient-brand text-primary-foreground border-0 gap-2">
              <Plus className="w-4 h-4" /> New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Move Request</DialogTitle>
            </DialogHeader>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>From Address</Label>
                  <Input placeholder="123 Maple St, Toronto" />
                </div>
                <div className="space-y-2">
                  <Label>To Address</Label>
                  <Input placeholder="456 Oak Ave, Mississauga" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Move Date</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Max Budget ($)</Label>
                  <Input type="number" placeholder="500" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Luggage</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Input placeholder="Small qty" type="number" />
                  <Input placeholder="Medium qty" type="number" />
                  <Input placeholder="Large qty" type="number" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea placeholder="Any special instructions..." />
              </div>
              <Button type="button" className="w-full gradient-brand text-primary-foreground border-0">Submit Request</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Request List */}
        <div className="lg:col-span-1 space-y-3">
          {myRequests.map((req) => (
            <Card
              key={req.id}
              className={`cursor-pointer transition-all hover:shadow-card-lg ${selected?.id === req.id ? "ring-2 ring-primary" : "shadow-card"}`}
              onClick={() => setSelected(req)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium text-sm">{req.fromAddress.city} → {req.toAddress.city}</p>
                  <StatusBadge status={req.status} />
                </div>
                <p className="text-xs text-muted-foreground">{req.moveDate} · ${req.maxBudget} budget</p>
                <p className="text-xs text-muted-foreground mt-1">{req.offersCount} offers · {req.luggageEntries.reduce((s, l) => s + l.quantity, 0)} items</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detail */}
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
                  <div>
                    <p className="text-muted-foreground text-xs">From</p>
                    <p>{selected.fromAddress.line1}, {selected.fromAddress.city}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">To</p>
                    <p>{selected.toAddress.line1}, {selected.toAddress.city}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Move Date</p>
                    <p>{selected.moveDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Max Budget</p>
                    <p>${selected.maxBudget}</p>
                  </div>
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

                {selected.notes && (
                  <div>
                    <p className="text-muted-foreground text-xs">Notes</p>
                    <p className="text-sm">{selected.notes}</p>
                  </div>
                )}

                {/* Offers */}
                <div>
                  <h3 className="font-semibold text-sm mb-3">Offers ({offersForRequest.length})</h3>
                  {offersForRequest.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No offers yet</p>
                  ) : (
                    <div className="space-y-2">
                      {offersForRequest.map((offer) => (
                        <div key={offer.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                          <div>
                            <p className="text-sm font-medium">{offer.driverName} <span className="text-xs text-muted-foreground">⭐ {offer.driverRating}</span></p>
                            <p className="text-xs text-muted-foreground">{offer.vehicleInfo}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-sm">${offer.price}</span>
                            <StatusBadge status={offer.status} />
                            {offer.status === "PENDING" && (
                              <Button size="sm" variant="outline" className="text-xs">Accept</Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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

export default ClientMoveRequests;
