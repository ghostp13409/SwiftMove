package com.swiftmove.driverservice.services;


import com.swiftmove.driverservice.model.Vehicle;

import java.util.List;

public interface IVehicleService {
    //GET
    List<Vehicle> getVehiclesByDriver(Long driverId);
    //ADD
    Vehicle addVehicle(Vehicle vehicle);
    //UPDATE
    Vehicle updateVehicle(Long id, Vehicle vehicle);
    //PATCH
    Vehicle patchVehicle(Long id, Vehicle vehicle);
    //UPDATE ACTIVE
    Vehicle toggleActive(int id);
    //DELETE
    void deleteVehicle(Long id);
}