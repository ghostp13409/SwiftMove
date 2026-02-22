package com.swiftmove.driverservice.controller;

import com.swiftmove.driverservice.model.DriverInfo;
import com.swiftmove.driverservice.services.DriverInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/drivers/")
public class DriverController {
    private final DriverInfoService driverService;
    @Autowired
    public DriverController(DriverInfoService driverService) {
        this.driverService = driverService;
    }

    @GetMapping("/test")
    public String test() {
        return "Driver Service is up and running!";
    }

    // GET /api/drivers/{id} - Get driver info by ID
    @GetMapping("/{id}")
    public ResponseEntity<Optional<DriverInfo>> getDriverById(@PathVariable Long id) {
        Optional<DriverInfo> driver = driverService.getDriverInfoById(id);
        return ResponseEntity.ok(driver);
    }

    // GET /api/drivers/me - Get current authenticated driver
    @GetMapping("/me")
    public ResponseEntity<DriverInfo> getCurrentDriver() {
        DriverInfo driver = driverService.getCurrentDriver();
        return ResponseEntity.ok(driver);
    }

    // POST /api/drivers - Create driver profile
    @PostMapping("/add")
    public ResponseEntity<DriverInfo> createDriverProfile(@RequestBody DriverInfo driver) {
        DriverInfo createdDriver = driverService.createDriverProfile(driver);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdDriver);
    }

    // PUT /api/drivers/{id} - Update driver info
    @PutMapping("/{id}")
    public ResponseEntity<DriverInfo> updateDriver(
            @PathVariable Long id,
            @RequestBody DriverInfo driver) {
        DriverInfo updatedDriver = driverService.updateDriver(id, driver);
        return ResponseEntity.ok(updatedDriver);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<DriverInfo> deleteDriver(@PathVariable Long id) {
        driverService.deleteDriverProfile(id);
        return ResponseEntity.ok().build();
    }
}
