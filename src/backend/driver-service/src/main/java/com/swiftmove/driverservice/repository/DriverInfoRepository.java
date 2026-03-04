package com.swiftmove.driverservice.repository;

import com.swiftmove.driverservice.model.DriverInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.sql.Driver;
import java.util.List;

public interface DriverInfoRepository extends JpaRepository <DriverInfo, Long> {
    DriverInfo findByDriverId(Long driverId);
}
