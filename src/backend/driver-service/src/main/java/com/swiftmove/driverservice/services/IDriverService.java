package com.swiftmove.driverservice.services;


import com.swiftmove.driverservice.model.DriverInfo;

import java.util.Optional;

public interface IDriverService {
    // GET - Get driver info by ID
    Optional<DriverInfo> getDriverInfoById(Long id);

    // GET - Get current authenticated driver
    DriverInfo getCurrentDriver();

    // PUT - Update driver info
    DriverInfo updateDriver(Long id, DriverInfo driver);

    // POST - Create driver profile
    DriverInfo createDriverProfile(DriverInfo driver);

    // DELETE - Deletes driver
    void deleteDriverProfile(Long id);
}