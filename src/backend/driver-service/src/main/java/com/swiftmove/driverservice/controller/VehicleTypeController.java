package com.swiftmove.driverservice.controller;

import com.swiftmove.driverservice.model.VehicleType;
import com.swiftmove.driverservice.repo.VehicleTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/vehicle-types")
@RequiredArgsConstructor
public class VehicleTypeController {

    private final VehicleTypeRepository vehicleTypeRepository;

    @GetMapping
    public List<VehicleType> getAllVehicleTypes() {
        return vehicleTypeRepository.findAll();
    }
}
