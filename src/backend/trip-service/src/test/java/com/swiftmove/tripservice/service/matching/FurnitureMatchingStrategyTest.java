package com.swiftmove.tripservice.service.matching;

import com.swiftmove.tripservice.dto.DriverInfoDto;
import com.swiftmove.tripservice.dto.MoveRequestDto;
import com.swiftmove.tripservice.dto.VehicleDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class FurnitureMatchingStrategyTest {

    private FurnitureMatchingStrategy strategy;
    private MoveRequestDto moveRequest;
    private DriverInfoDto driverInfo;
    private VehicleDto vehicle;

    @BeforeEach
    void setUp() {
        strategy = new FurnitureMatchingStrategy();
        moveRequest = new MoveRequestDto();
        driverInfo = new DriverInfoDto();
        vehicle = new VehicleDto();
    }

    @Test
    void matches_RequestHasFurniture_VehicleCanCarry_ReturnsTrue() {
        moveRequest.setHasFurniture(true);
        vehicle.setCanCarryFurniture(true);
        assertTrue(strategy.matches(moveRequest, driverInfo, vehicle));
    }

    @Test
    void matches_RequestHasFurniture_VehicleCannotCarry_ReturnsFalse() {
        moveRequest.setHasFurniture(true);
        vehicle.setCanCarryFurniture(false);
        assertFalse(strategy.matches(moveRequest, driverInfo, vehicle));
    }

    @Test
    void matches_RequestHasFurniture_VehicleCarryNull_ReturnsFalse() {
        moveRequest.setHasFurniture(true);
        vehicle.setCanCarryFurniture(null);
        assertFalse(strategy.matches(moveRequest, driverInfo, vehicle));
    }

    @Test
    void matches_RequestHasNoFurniture_VehicleCanCarry_ReturnsTrue() {
        moveRequest.setHasFurniture(false);
        vehicle.setCanCarryFurniture(true);
        assertTrue(strategy.matches(moveRequest, driverInfo, vehicle));
    }

    @Test
    void matches_RequestHasNoFurniture_VehicleCannotCarry_ReturnsTrue() {
        moveRequest.setHasFurniture(false);
        vehicle.setCanCarryFurniture(false);
        assertTrue(strategy.matches(moveRequest, driverInfo, vehicle));
    }

    @Test
    void matches_RequestHasFurnitureNull_ReturnsTrue() {
        moveRequest.setHasFurniture(null);
        vehicle.setCanCarryFurniture(false);
        assertTrue(strategy.matches(moveRequest, driverInfo, vehicle));
    }
}
