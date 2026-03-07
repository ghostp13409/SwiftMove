import { Vehicle } from "@/types";

export const getVehicleString = (vehicle: Vehicle): string => {
  return `${vehicle.make} ${vehicle.model} ${vehicle.year}`;
};
