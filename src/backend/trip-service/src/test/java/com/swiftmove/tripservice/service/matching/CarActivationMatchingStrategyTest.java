package com.swiftmove.tripservice.service.matching;

import com.swiftmove.tripservice.dto.DriverInfoDto;
import com.swiftmove.tripservice.dto.MoveRequestDto;
import com.swiftmove.tripservice.dto.VehicleDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CarActivationMatchingStrategyTest {

    private CarActivationMatchingStrategy strategy;
    private MoveRequestDto moveRequest;
    private DriverInfoDto driverInfo;
    private VehicleDto vehicle;

    @BeforeEach
    void setUp() {
        strategy = new CarActivationMatchingStrategy();
        moveRequest = new MoveRequestDto();
        driverInfo = new DriverInfoDto();
        vehicle = new VehicleDto();
    }

    @Test
    void matches_VehicleIsActive_ReturnsTrue() {
        vehicle.setIsActive(true);
        assertTrue(strategy.matches(moveRequest, driverInfo, vehicle));
    }

    @Test
    void matches_VehicleIsInactive_ReturnsFalse() {
        vehicle.setIsActive(false);
        assertFalse(strategy.matches(moveRequest, driverInfo, vehicle));
    }

    @Test
    void matches_VehicleIsActiveNull_ReturnsFalse() {
        vehicle.setIsActive(null);
        assertFalse(strategy.matches(moveRequest, driverInfo, vehicle));
    }
}
