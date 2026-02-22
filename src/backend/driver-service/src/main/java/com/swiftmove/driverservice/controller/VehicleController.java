package com.swiftmove.driverservice.controller;

import com.swiftmove.driverservice.model.Vehicle;
import com.swiftmove.driverservice.services.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vehicle/")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;


    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Vehicle Service is up and running!");
    }

    // GET /api/vehicles - Get vehicles for driver
    @GetMapping
    public ResponseEntity<List<Vehicle>> getVehicles(@RequestParam Long driverId) {
        List<Vehicle> vehicles = vehicleService.getVehiclesByDriver(driverId);
        return ResponseEntity.ok(vehicles);
    }

    // POST /api/vehicles - Add vehicle
    @PostMapping
    public ResponseEntity<Vehicle> addVehicle(@RequestBody Vehicle vehicle) {
        Vehicle createdVehicle = vehicleService.addVehicle(vehicle);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdVehicle);
    }

    // PUT /api/vehicles/{id} - Update vehicle
    @PutMapping("/{id}")
    public ResponseEntity<Vehicle> updateVehicle(
            @PathVariable Long id,
            @RequestBody Vehicle vehicle) {
        Vehicle updatedVehicle = vehicleService.updateVehicle(id, vehicle);
        return ResponseEntity.ok(updatedVehicle);
    }

    // PATCH /api/vehicles/{id} - Partially update vehicle
    @PatchMapping("/{id}")
    public ResponseEntity<Vehicle> patchVehicle(@PathVariable Long id,@RequestBody Vehicle vehicle) {
        Vehicle patchedVehicle = vehicleService.patchVehicle(id, vehicle);
        return ResponseEntity.ok(patchedVehicle);
    }

    // PATCH /api/vehicles/{id}/toggle-active - Toggle active status
    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<Vehicle> toggleVehicle(@PathVariable Long id) {
        Vehicle toggledVehicle = vehicleService.toggleActive(id);
        return ResponseEntity.ok(toggledVehicle);
    }

    // DELETE /api/vehicles/{id} - Delete vehicle
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }
}