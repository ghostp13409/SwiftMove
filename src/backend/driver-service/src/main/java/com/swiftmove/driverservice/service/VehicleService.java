package com.swiftmove.driverservice.service;

import com.swiftmove.driverservice.dto.CreateVehicleDto;
import com.swiftmove.driverservice.dto.VehicleDto;
import com.swiftmove.driverservice.mapper.Mapper;
import com.swiftmove.driverservice.model.Vehicle;
import com.swiftmove.driverservice.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleService {
    private final VehicleRepository vehicleRepository;
    private final DriverInfoService driverInfoService;

//    All
    public List<VehicleDto> getAll(){
        return vehicleRepository.findAll().stream()
                .map(Mapper::toVehicleDto)
                .toList();
    }

//    Get by Driver Info ID
    public List<VehicleDto> getByDriverInfoId(Long driverInfoId){
        return vehicleRepository.findByDriverId(driverInfoId).stream()
                .map(Mapper::toVehicleDto)
                .toList();
    }

//    Get for Current Driver
    public List<VehicleDto> getByCurrentDriver(String authHeader){
        Long currentDriverInfoId = driverInfoService.getCurrent(authHeader).getId();
        return vehicleRepository.findByDriverId(currentDriverInfoId).stream()
                .map(Mapper::toVehicleDto)
                .toList();
    }

//    Get by Id
    public VehicleDto getById(Long id){
        return vehicleRepository.findById(id)
                .map(Mapper::toVehicleDto)
                .orElse(null);
    }

//    Add
    public VehicleDto add(CreateVehicleDto vehicleDto){
        try{
            validateNewVehicle(vehicleDto);
            Vehicle newVehicle = Mapper.createVehicleEntity(vehicleDto);
            newVehicle = vehicleRepository.save(newVehicle);
            return Mapper.toVehicleDto(newVehicle);
        }
        catch (Exception ex){
            throw new RuntimeException("Failed to create MoveOffer: " + ex.getMessage(), ex);
        }
    }
//    Edit
    public VehicleDto edit(Long id, VehicleDto vehicleDto){
        try{
            validateVehicle(vehicleDto);
            return vehicleRepository.findById(id)
                    .map(existingVehicle -> {
                        existingVehicle.setMake(vehicleDto.getMake());
                        existingVehicle.setModel(vehicleDto.getModel());
                        existingVehicle.setYear(vehicleDto.getYear());
                        existingVehicle.setColor(vehicleDto.getColor());
                        existingVehicle.setDriverId(vehicleDto.getDriverId());
                        return Mapper.toVehicleDto(vehicleRepository.save(existingVehicle));
                    })
                    .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + id));
        }
        catch (Exception ex){
            throw new RuntimeException("Failed to edit vehicle: " + ex.getMessage(), ex);
        }
    }

//    Delete
    public VehicleDto delete(Long id){
        try{
            return vehicleRepository.findById(id)
                    .map(vehicle -> {
                        vehicleRepository.delete(vehicle);
                        return Mapper.toVehicleDto(vehicle);
                    })
                    .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + id));
        }
        catch (Exception ex){
            throw new RuntimeException("Failed to delete vehicle: " + ex.getMessage(), ex);
        }
    }

    // Validate Vehicle Dto

    private void validateVehicle(VehicleDto vehicleDto) {
        // Add validation logic here
        StringBuilder errorMessages = new StringBuilder();

        if(vehicleDto == null) {
            errorMessages.append("Vehicle cannot be null.");
        }

        assert vehicleDto != null;
        if(vehicleDto.getMake() == null || vehicleDto.getMake().trim().isEmpty()) {
            errorMessages.append("Make cannot be null or empty.");
        }

        if(vehicleDto.getModel() == null || vehicleDto.getModel().trim().isEmpty()) {
            errorMessages.append("Model cannot be null or empty.");
        }

        if(vehicleDto.getYear() == null || vehicleDto.getYear() <= 0) {
            errorMessages.append("Year must be a positive value.");
        }

        if(vehicleDto.getColor() == null || vehicleDto.getColor().trim().isEmpty()) {
            errorMessages.append("Color cannot be null or empty.");
        }

        if(vehicleDto.getDriverId() == null || driverInfoService.getById(vehicleDto.getDriverId()) == null) {
            errorMessages.append("Driver Info ID must be valid and exist.");
        }

        if(!errorMessages.isEmpty()) {
            throw new IllegalArgumentException(errorMessages.toString());
        }

    }

    private void validateNewVehicle(CreateVehicleDto vehicleDto) {
        // Add validation logic here
        StringBuilder errorMessages = new StringBuilder();

        if(vehicleDto == null) {
            errorMessages.append("Vehicle cannot be null.");
        }

        if(vehicleDto.getMake() == null || vehicleDto.getMake().trim().isEmpty()) {
            errorMessages.append("Make cannot be null or empty.");
        }

        if(vehicleDto.getModel() == null || vehicleDto.getModel().trim().isEmpty()) {
            errorMessages.append("Model cannot be null or empty.");
        }

        if(vehicleDto.getYear() == null || vehicleDto.getYear() <= 0) {
            errorMessages.append("Year must be a positive value.");
        }

        if(vehicleDto.getColor() == null || vehicleDto.getColor().trim().isEmpty()) {
            errorMessages.append("Color cannot be null or empty.");
        }

        if(vehicleDto.getDriverId() == null || driverInfoService.getById(vehicleDto.getDriverId()) == null) {
            errorMessages.append("Driver Info ID must be valid and exist.");
        }

        if(!errorMessages.isEmpty()) {
            throw new IllegalArgumentException(errorMessages.toString());
        }

    }

}
