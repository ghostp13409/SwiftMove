import { Plus, Truck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { mockVehicles, VEHICLE_TYPES } from "@/data/mockData";

const Vehicles = () => {
  const myVehicles = mockVehicles.filter((v) => v.driverId === 1);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Vehicles</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your registered vehicles</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gradient-brand text-primary-foreground border-0 gap-2"><Plus className="w-4 h-4" /> Add Vehicle</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Vehicle</DialogTitle></DialogHeader>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Make</Label><Input placeholder="Ford" /></div>
                <div className="space-y-2"><Label>Model</Label><Input placeholder="Transit" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Year</Label><Input type="number" placeholder="2023" /></div>
                <div className="space-y-2"><Label>Color</Label><Input placeholder="White" /></div>
              </div>
              <div className="space-y-2">
                <Label>Vehicle Type</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {VEHICLE_TYPES.map((vt) => (
                      <SelectItem key={vt.type} value={vt.type}>{vt.type} (Max: {vt.maxWeight} lbs, {vt.volume} cu ft)</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>License Plate</Label><Input placeholder="ABC-1234" /></div>
                <div className="space-y-2"><Label>Price/km ($)</Label><Input type="number" step="0.1" placeholder="2.50" /></div>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="furniture" />
                <Label htmlFor="furniture" className="text-sm">Can carry furniture (+$2/km)</Label>
              </div>
              <Button type="button" className="w-full gradient-brand text-primary-foreground border-0">Add Vehicle</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myVehicles.map((vehicle) => (
          <Card key={vehicle.id} className="shadow-card hover:shadow-card-lg transition-all">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-primary" />
                </div>
                <Badge variant={vehicle.isActive ? "default" : "secondary"}>
                  {vehicle.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <h3 className="font-semibold">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
              <p className="text-sm text-muted-foreground mt-1">{vehicle.vehicleType} · {vehicle.color}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t">
                <span className="text-xs text-muted-foreground">{vehicle.licensePlate}</span>
                <span className="text-sm font-semibold">${vehicle.pricePerKm}/km</span>
              </div>
              {vehicle.canCarryFurniture && <p className="text-xs text-success mt-2">🛋 Can carry furniture</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Vehicles;
