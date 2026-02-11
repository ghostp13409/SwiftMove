package com.swiftmove.driverservice.repository;

import com.swiftmove.driverservice.model.DriverInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<DriverInfo, Integer> {

    Optional<DriverInfo> findDriverInfoByUserId(Long userId);
}