package com.swiftmove.driverservice.services;


import com.swiftmove.driverservice.model.DriverInfo;
import com.swiftmove.driverservice.repository.DriverRepository;
import org.springframework.stereotype.Service;

@Service
public class DriverInfoService implements IDriverService{

    private DriverRepository driverRepository;


    public DriverInfoService(DriverRepository driverRepository) {
        this.driverRepository=driverRepository;
    }

    @Override
    public DriverInfo getDriverInfoById(Long id) {
        //Validation required
        return driverRepository.findByUserId(id);
    }

    // TODO --------------------------------------------------------
    // Would prefer for auth and security to be done before this
    @Override
    public DriverInfo getCurrentDriver() {
        return null;
    }

    @Override
    public DriverInfo updateDriver(Long id, DriverInfo driver) {
        //Validation required
        DriverInfo existingDriver = driverRepository.findById(Math.toIntExact(id))
                .orElseThrow(() -> new RuntimeException("Driver not found with id: " + id));

        existingDriver.setDrivingExperience(driver.getDrivingExperience());
        existingDriver.setRange(driver.getRange());
        existingDriver.setDrivingLicense(driver.getDrivingLicense());

        return driverRepository.save(existingDriver);
    }
    // TODO --------------------------------------------------------
    // Can do it two ways get authenticated userID
    @Override
    public DriverInfo createDriverProfile(DriverInfo driver) {
        //Easy way
        //Validation required
        return driverRepository.save(driver);
    }
}
