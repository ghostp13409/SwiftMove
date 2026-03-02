package com.swiftmove.driverservice.services;


import java.util.List;
import java.util.Optional;

import com.swiftmove.driverservice.model.DriverInfo;

public interface IDriverService {
    // GET - Get driver info by ID
    Optional<DriverInfo> getDriverInfoById(Long id);
    // GET driver by associated user id
    Optional<DriverInfo> getDriverInfoByUserId(Long userId);

    // GET all drivers (admin)
    List<DriverInfo> getAllDrivers();

    // GET - Get current authenticated driver
    DriverInfo getCurrentDriver();


    // PUT - Update driver info
    DriverInfo updateDriver(Long id, DriverInfo driver);

    // POST - Create driver profile
    DriverInfo createDriverProfile(DriverInfo driver);

    // DELETE - Deletes driver
    void deleteDriverProfile(Long id);
}
