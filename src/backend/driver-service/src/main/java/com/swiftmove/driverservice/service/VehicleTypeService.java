package com.swiftmove.driverservice.service;

import com.swiftmove.driverservice.dto.VehicleDto;
import com.swiftmove.driverservice.dto.VehicleTypeDto;
import com.swiftmove.driverservice.mapper.Mapper;
import com.swiftmove.driverservice.model.VehicleType;
import com.swiftmove.driverservice.repository.VehicleTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class VehicleTypeService {
    private final VehicleService vehicleService;
    private final VehicleTypeRepository vehicleTypeRepository;

    public List<VehicleTypeDto> getAll() {
        return vehicleTypeRepository.findAll().stream()
                .map(Mapper::toVehicleTypeDto)
                .toList();
    }

    public VehicleTypeDto getVehicleId(Long id) {
        VehicleDto vehicle = vehicleService.getById(id);
        if (vehicle != null) {
            VehicleType vehicleType = vehicleTypeRepository.findById(vehicle.getVehicleTypeId()).orElse(null);
            return Mapper.toVehicleTypeDto(vehicleType);
        } else {
            return null; // Vehicle not found
        }
    }
}
