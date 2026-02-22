package com.swiftmove.driverservice;

import com.swiftmove.driverservice.controller.DriverController;
import com.swiftmove.driverservice.model.DriverInfo;
import com.swiftmove.driverservice.services.DriverInfoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DriverControllerTest {

    @Mock
    private DriverInfoService driverService;

    @InjectMocks
    private DriverController driverController;

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
    void getDriverById_success() {
        when(driverService.getDriverInfoById(1L))
                .thenReturn(Optional.of(driver));

        ResponseEntity<Optional<DriverInfo>> response =
                driverController.getDriverById(1L);

        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isPresent());
    }

    @Test
    void getCurrentDriver_success() {
        when(driverService.getCurrentDriver()).thenReturn(driver);

        ResponseEntity<DriverInfo> response =
                driverController.getCurrentDriver();

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
    }

    @Test
    void createDriverProfile_success() {
        when(driverService.createDriverProfile(driver))
                .thenReturn(driver);

        ResponseEntity<DriverInfo> response =
                driverController.createDriverProfile(driver);

        assertEquals(201, response.getStatusCode().value());
        assertNotNull(response.getBody());
    }

    @Test
    void updateDriver_success() {
        when(driverService.updateDriver(1L, driver))
                .thenReturn(driver);

        ResponseEntity<DriverInfo> response =
                driverController.updateDriver(1L, driver);

        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void deleteDriver_success() {
        ResponseEntity<DriverInfo> response =
                driverController.deleteDriver(1L);

        assertEquals(200, response.getStatusCode().value());
        verify(driverService).deleteDriverProfile(1L);
    }
}
