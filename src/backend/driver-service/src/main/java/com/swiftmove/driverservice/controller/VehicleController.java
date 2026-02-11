package com.swiftmove.driverservice.controller;

import com.swiftmove.driverservice.model.Vehicle;
import com.swiftmove.driverservice.services.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private VehicleService vehicleService;
    @Autowired
    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }
    @GetMapping("/test")
    public String test() {
        return "Vehicle Service is up and running!";
    }

    @GetMapping
    public List<Vehicle> getVehicles(long id) {
        return vehicleService.getVehiclesByDriver(id);
    }

    @PostMapping
    public Vehicle addVehicle(@RequestBody Vehicle vehicle) {
        return vehicleService.addVehicle(vehicle);
    }

    @PutMapping("/{vehicleId}")
    public Vehicle updateVehicle(@PathVariable Long id, @RequestBody Vehicle vehicle) {
        return vehicleService.updateVehicle(id, vehicle);
    }

    @PatchMapping("/{id}")
    public Vehicle patchVehicle(
            @PathVariable Long id,
            @RequestBody Vehicle vehicle
    ) {
        return vehicleService.patchVehicle(id, vehicle);
    }

    @PatchMapping("/{id}/toggle-active")
    public Vehicle toggleVehicle(@PathVariable Long id) {
        return vehicleService.toggleActive(Math.toIntExact(id));
    }

    @DeleteMapping("/{id}")
    public void deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
    }
}