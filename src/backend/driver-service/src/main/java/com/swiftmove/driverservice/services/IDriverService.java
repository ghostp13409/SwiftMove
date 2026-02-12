package com.swiftmove.driverservice.services;


import com.swiftmove.driverservice.model.DriverInfo;
import com.swiftmove.driverservice.model.Vehicle;

import java.util.List;

public interface IDriverService {
    // GET - Get driver info by ID
    DriverInfo getDriverInfoById(Long id);

    // GET - Get current authenticated driver
    DriverInfo getCurrentDriver();

    // PUT - Update driver info
    DriverInfo updateDriver(Long id, DriverInfo driver);

    // POST - Create driver profile
    DriverInfo createDriverProfile(DriverInfo driver);
}