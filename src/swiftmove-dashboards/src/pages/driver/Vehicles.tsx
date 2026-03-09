import { useEffect, useState } from "react";
import { Plus, Truck, Loader2, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { vehicleService } from "@/services/vehicleService";
import { driverService } from "@/services/driverService";
import type { Vehicle, DriverWithInfo, VehicleType } from "@/types";

const Vehicles = () => {
  const { userId } = useAuth();
  const { toast } = useToast();
  const [myVehicles, setMyVehicles] = useState<Vehicle[]>([]);
  const [driver, setDriver] = useState<DriverWithInfo | null>(null);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVehicleId, setCurrentVehicleId] = useState<number | null>(null);

  // Form state
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [color, setColor] = useState("");
  const [pricePerKm, setPricePerKm] = useState("");
  const [vehicleTypeId, setVehicleTypeId] = useState("");
  const [canCarryFurniture, setCanCarryFurniture] = useState(false);

  const resetForm = () => {
    setMake("");
    setModel("");
    setYear("");
    setColor("");
    setPricePerKm("");
    setVehicleTypeId("");
    setCanCarryFurniture(false);
    setIsEditing(false);
    setCurrentVehicleId(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [driverRes, typesRes] = await Promise.allSettled([
          driverService.getCurrentDriver(),
          vehicleService.getVehicleTypes(),
        ]);

        if (driverRes.status === "fulfilled") {
          const driverData = driverRes.value as any;
          setDriver(driverData);
          const vehicles = await vehicleService.getVehiclesByDriver(
            driverData.id,
          );
          setMyVehicles(Array.isArray(vehicles) ? vehicles : []);
        }

        if (
          typesRes.status === "fulfilled" &&
          Array.isArray(typesRes.value) &&
          typesRes.value.length > 0
        ) {
          setVehicleTypes(typesRes.value);
        }
      } catch (err) {
        console.error("Failed to load vehicles:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const handleEditVehicle = (v: Vehicle) => {
    setIsEditing(true);
    setCurrentVehicleId(v.id);
    setMake(v.make);
    setModel(v.model);
    setYear(String(v.year));
    setColor(v.color);
    setPricePerKm(String(v.pricePerKm));
    setVehicleTypeId(String(v.vehicleTypeId));
    setCanCarryFurniture(v.canCarryFurniture);
    setDialogOpen(true);
  };

  const handleSubmitVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];
    if (!driver)
      errors.push("Driver profile not loaded. Please refresh the page.");
    if (!make.trim()) errors.push("Make is required.");
    if (!model.trim()) errors.push("Model is required.");
    if (!year.trim()) errors.push("Year is required.");
    if (!vehicleTypeId.trim()) errors.push("Vehicle Type is required.");
    if (!pricePerKm.trim()) errors.push("Price per km is required.");
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join(" "),
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const vehicleData = {
        make,
        model,
        year: parseInt(year),
        color,
        vehicleTypeId: parseInt(vehicleTypeId),
        pricePerKm: parseFloat(pricePerKm),
        isActive: true,
        canCarryFurniture,
        driverId: (driver as any).id,
      };

      if (isEditing && currentVehicleId) {
        await vehicleService.updateVehicle(currentVehicleId, vehicleData);
      } else {
        await vehicleService.createVehicle(vehicleData);
      }

      toast({
        title: isEditing ? "Vehicle Updated" : "Vehicle Added",
        description: isEditing ? "Your vehicle has been updated." : "Your vehicle has been registered.",
      });
      setDialogOpen(false);
      resetForm();
      const vehicles = await vehicleService.getVehiclesByDriver(
        (driver as any).id,
      );
      setMyVehicles(Array.isArray(vehicles) ? vehicles : []);
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "add"} vehicle.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (vehicleId: number) => {
    try {
      await vehicleService.toggleVehicleActive(vehicleId);
      setMyVehicles((prev) =>
        prev.map((v) =>
          v.id === vehicleId ? { ...v, isActive: !v.isActive } : v,
        ),
      );
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to toggle vehicle status.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteVehicle = async (vehicleId: number) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
    
    try {
      await vehicleService.deleteVehicle(vehicleId);
      setMyVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
      toast({
        title: "Vehicle Deleted",
        description: "The vehicle has been removed from your profile.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete vehicle.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Vehicles</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your registered vehicles
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(val) => {
          setDialogOpen(val);
          if (!val) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gradient-brand text-primary-foreground border-0 gap-2">
              <Plus className="w-4 h-4" /> Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Vehicle" : "Add New Vehicle"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitVehicle} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Make *</Label>
                  <Input
                    placeholder="Ford"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Model *</Label>
                  <Input
                    placeholder="Transit"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Year *</Label>
                  <Input
                    type="number"
                    placeholder="2023"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <Input
                    placeholder="White"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Vehicle Type *</Label>
                <Select onValueChange={setVehicleTypeId} value={vehicleTypeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map((vt, idx) => (
                      <SelectItem
                        key={vt.id ?? idx}
                        value={String(vt.id ?? idx + 1)}
                      >
                        {vt.type} (Max: {vt.maxWeight} kg, {vt.maxCapacity} cu
                        ft)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Price/km ($) *</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="2.50"
                  value={pricePerKm}
                  onChange={(e) => setPricePerKm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="furniture"
                  checked={canCarryFurniture}
                  onCheckedChange={(v) => setCanCarryFurniture(!!v)}
                />
                <Label htmlFor="furniture" className="text-sm">
                  Can carry furniture
                </Label>
              </div>
              <Button
                type="submit"
                className="w-full gradient-brand text-primary-foreground border-0"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> {isEditing ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  isEditing ? "Update Vehicle" : "Add Vehicle"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {myVehicles.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No vehicles registered yet. Add your first vehicle to start accepting
          moves!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myVehicles.map((vehicle) => (
            <Card
              key={vehicle.id}
              className="shadow-card hover:shadow-card-lg transition-all"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-primary" />
                  </div>
                  <Badge variant={vehicle.isActive ? "default" : "secondary"}>
                    {vehicle.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <h3 className="font-semibold">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {vehicle.vehicleType || `Type #${vehicle.vehicleTypeId}`} ·{" "}
                  {vehicle.color}
                </p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <span className="text-xs text-muted-foreground">
                    {vehicle.licensePlate || "No plate"}
                  </span>
                  <span className="text-sm font-semibold">
                    ${vehicle.pricePerKm}/km
                  </span>
                </div>
                {vehicle.canCarryFurniture && (
                  <p className="text-xs text-green-600 mt-2">
                    Can carry furniture
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs h-8"
                    onClick={() => handleEditVehicle(vehicle)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs h-8 whitespace-nowrap"
                    onClick={() => handleToggleActive(vehicle.id)}
                  >
                    {vehicle.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 p-2 h-8"
                    onClick={() => handleDeleteVehicle(vehicle.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Vehicles;
