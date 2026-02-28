package com.swiftmove.driverservice.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.swiftmove.driverservice.model.DriverInfo;
import com.swiftmove.driverservice.repository.DriverRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class DriverInfoService implements IDriverService {

    private DriverRepository driverRepository;

    public DriverInfoService(DriverRepository driverRepository) {
        this.driverRepository = driverRepository;
    }

    @Override
    public Optional<DriverInfo> getDriverInfoById(Long id) {
        return driverRepository.findById(id);
    }

    @Override
    public Optional<DriverInfo> getDriverInfoByUserId(Long userId) {
        return driverRepository.findByUserId(userId);
    }

    @Override
    public List<DriverInfo> getAllDrivers() {
        return driverRepository.findAll();
    }

    // TODO: resolve current authenticated driver via security context
    @Override
    public DriverInfo getCurrentDriver() {
        return null;
    }

    @Override
    public DriverInfo updateDriver(Long id, DriverInfo driver) {
        DriverInfo existingDriver = driverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Driver not found with id: " + id));

        // copy updatable fields explicitly
        existingDriver.setDrivingExperience(driver.getDrivingExperience());
        existingDriver.setRange(driver.getRange());
        existingDriver.setDrivingLicense(driver.getDrivingLicense());

        return driverRepository.save(existingDriver);
    }

    @Override
    public DriverInfo createDriverProfile(DriverInfo driver) {
        return driverRepository.save(driver);
    }

    @Override
    public void deleteDriverProfile(Long id) {
        DriverInfo driver = driverRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Driver Info not found"));
        driverRepository.delete(driver);
    }
}
