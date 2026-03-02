package com.swiftmove.driverservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.swiftmove.driverservice.model.Vehicle;
import com.swiftmove.driverservice.services.VehicleService;

@RestController
@RequestMapping("/vehicle")
public class VehicleController {

    private final VehicleService vehicleService;

    @Autowired
    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Vehicle Service is up and running!");
    }

    // GET /vehicle/driver/{driverInfoId} - Vehicles for a specific driver
    @GetMapping("/driver/{driverInfoId}")
    public ResponseEntity<List<Vehicle>> getVehiclesByDriver(@PathVariable("driverInfoId") Long driverId) {
        List<Vehicle> vehicles = vehicleService.getVehiclesByDriver(driverId);
        return ResponseEntity.ok(vehicles);
    }

    // GET /vehicle/ - returns all vehicles (admin) or optionally filtered by driverId
    @GetMapping
    public ResponseEntity<List<Vehicle>> getVehicles(@RequestParam(required = false) Long driverId) {
        if (driverId != null) {
            return ResponseEntity.ok(vehicleService.getVehiclesByDriver(driverId));
        }
        return ResponseEntity.ok(vehicleService.getAllVehicles());
    }

    // POST /vehicle/ - Add vehicle
    @PostMapping
    public ResponseEntity<Vehicle> addVehicle(@RequestBody Vehicle vehicle) {
        Vehicle createdVehicle = vehicleService.addVehicle(vehicle);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdVehicle);
    }

    // PUT /vehicle/{id} - Update vehicle
    @PutMapping("/{id}")
    public ResponseEntity<Vehicle> updateVehicle(
            @PathVariable Long id,
            @RequestBody Vehicle vehicle) {
        Vehicle updatedVehicle = vehicleService.updateVehicle(id, vehicle);
        return ResponseEntity.ok(updatedVehicle);
    }

    // PATCH /vehicle/{id} - Partially update vehicle
    @PatchMapping("/{id}")
    public ResponseEntity<Vehicle> patchVehicle(@PathVariable Long id,@RequestBody Vehicle vehicle) {
        Vehicle patchedVehicle = vehicleService.patchVehicle(id, vehicle);
        return ResponseEntity.ok(patchedVehicle);
    }

    // PATCH /vehicle/{id}/toggle-active - Toggle active status
    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<Vehicle> toggleVehicle(@PathVariable Long id) {
        Vehicle toggledVehicle = vehicleService.toggleActive(id);
        return ResponseEntity.ok(toggledVehicle);
    }

    // DELETE /vehicle/{id} - Delete vehicle
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }
}
