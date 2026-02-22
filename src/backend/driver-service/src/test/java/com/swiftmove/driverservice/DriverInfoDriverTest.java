package com.swiftmove.driverservice;



import com.swiftmove.driverservice.model.DriverInfo;
import com.swiftmove.driverservice.repository.DriverRepository;
import com.swiftmove.driverservice.services.DriverInfoService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DriverInfoServiceTest {

    @Mock
    private DriverRepository driverRepository;

    @InjectMocks
    private DriverInfoService driverService;

    private DriverInfo driver;

    @BeforeEach
    void setUp() {
        driver = new DriverInfo();
        driver.setId(1L);
        driver.setDrivingExperience(5);
        driver.setRange(300f);
        driver.setDrivingLicense("ABC123");
        driver.setUserId(10L);
    }

    @Test
    void getDriverInfoById_success() {
        when(driverRepository.findById(1L))
                .thenReturn(Optional.of(driver));

        Optional<DriverInfo> result =
                driverService.getDriverInfoById(1L);

        assertTrue(result.isPresent());
    }

    @Test
    void updateDriver_success() {
        when(driverRepository.findById(1L))
                .thenReturn(Optional.of(driver));
        when(driverRepository.save(any(DriverInfo.class)))
                .thenReturn(driver);

        DriverInfo updated =
                driverService.updateDriver(1L, driver);

        assertNotNull(updated);
        verify(driverRepository).save(driver);
    }

    @Test
    void updateDriver_notFound() {
        when(driverRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> driverService.updateDriver(1L, driver));
    }

    @Test
    void createDriverProfile_success() {
        when(driverRepository.save(driver)).thenReturn(driver);

        DriverInfo created =
                driverService.createDriverProfile(driver);

        assertNotNull(created);
    }

    @Test
    void deleteDriverProfile_success() {
        when(driverRepository.findById(1L))
                .thenReturn(Optional.of(driver));

        driverService.deleteDriverProfile(1L);

        verify(driverRepository).delete(driver);
    }

    @Test
    void deleteDriverProfile_notFound() {
        when(driverRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class,
                () -> driverService.deleteDriverProfile(1L));
    }
}
