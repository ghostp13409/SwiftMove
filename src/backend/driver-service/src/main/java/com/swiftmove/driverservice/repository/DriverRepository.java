package com.swiftmove.driverservice.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.swiftmove.driverservice.model.DriverInfo;

@Repository
public interface DriverRepository extends JpaRepository<DriverInfo, Long> {

    //DriverInfo findByUserId(Long userId);

    //boolean existsByUserId(Long userId);

    // find driver by user id (used by frontend /drivers/user/{userId})
    Optional<DriverInfo> findByUserId(Long userId);

    //Optional<DriverInfo> findByEmail(String email);

    // Find driver by phone number (if needed for lookups)
    //Optional<DriverInfo> findByPhoneNumber(String phoneNumber);

    // Check if driver exists by email (useful for duplicate validation)
    //boolean existsByEmail(String email);

    // Check if driver exists by phone number (useful for duplicate validation)
    //boolean existsByPhoneNumber(String phoneNumber);
}
