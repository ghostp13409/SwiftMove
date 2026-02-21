package com.swiftmove.driverservice.services;

import com.swiftmove.driverservice.model.Vehicle;
import com.swiftmove.driverservice.repository.VehicleRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleService implements IVehicleService {

    private  final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    @Override
    public List<Vehicle> getVehiclesByDriver(Long driverId) {
        return vehicleRepository.getVehiclesBydriverInfoId(driverId);
    }

    @Override
    public Vehicle addVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    @Override
    public Vehicle updateVehicle(Long id, Vehicle vehicle) {
        try{
            return  vehicleRepository.save(vehicle);
        }
        catch(Exception e){
            throw new RuntimeException(e);
        }

    }
    // ChatGPT was used for this one
    @Override
    public Vehicle patchVehicle(Long id, Vehicle patch) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        if (patch.getModel() != null) vehicle.setModel(patch.getModel());
        if (patch.getMake() != null) vehicle.setMake(patch.getMake());
        if (patch.getColor() != null) vehicle.setColor(patch.getColor());
        if (patch.getPricePerKm() != 0) vehicle.setPricePerKm(patch.getPricePerKm());
        if (patch.getIsActive() != null) vehicle.setIsActive(patch.getIsActive());
        if (patch.getCanCarryFurniture() != null)
            vehicle.setCanCarryFurniture(patch.getCanCarryFurniture());

        return vehicleRepository.save(vehicle);
    }

    @Override
    public Vehicle toggleActive(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle not found"));

        vehicle.setIsActive(!vehicle.getIsActive());
        return vehicleRepository.save(vehicle);
    }

    @Override
    public void deleteVehicle(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Vehicle not found"));
        vehicleRepository.delete(vehicle);
    }
}
