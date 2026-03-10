package com.swiftmove.tripservice.service.matching;

import com.swiftmove.tripservice.dto.DriverInfoDto;
import com.swiftmove.tripservice.dto.MoveRequestDto;
import com.swiftmove.tripservice.dto.VehicleDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class PriceMatchingStrategyTest {

    private PriceMatchingStrategy strategy;
    private MoveRequestDto moveRequest;
    private DriverInfoDto driverInfo;
    private VehicleDto vehicle;

    @BeforeEach
    void setUp() {
        strategy = new PriceMatchingStrategy();
        moveRequest = new MoveRequestDto();
        driverInfo = new DriverInfoDto();
        vehicle = new VehicleDto();
    }

    @Test
    void matches_PriceWithinBudget_ReturnsTrue() {
        moveRequest.setDistance(10.0);
        vehicle.setPricePerKm(5L);
        moveRequest.setMaxBudget(50L);

        // 10 * 5 = 50 <= 50
        assertTrue(strategy.matches(moveRequest, driverInfo, vehicle));
    }

    @Test
    void matches_PriceExceedsBudget_ReturnsFalse() {
        moveRequest.setDistance(10.0);
        vehicle.setPricePerKm(6L);
        moveRequest.setMaxBudget(50L);

        // 10 * 6 = 60 > 50
        assertFalse(strategy.matches(moveRequest, driverInfo, vehicle));
    }

    @Test
    void matches_DistanceNull_ReturnsFalse() {
        moveRequest.setDistance(null);
        vehicle.setPricePerKm(5L);
        moveRequest.setMaxBudget(50L);

        assertFalse(strategy.matches(moveRequest, driverInfo, vehicle));
    }

    @Test
    void matches_PricePerKmNull_ReturnsFalse() {
        moveRequest.setDistance(10.0);
        vehicle.setPricePerKm(null);
        moveRequest.setMaxBudget(50L);

        assertFalse(strategy.matches(moveRequest, driverInfo, vehicle));
    }

    @Test
    void matches_MaxBudgetNull_ReturnsFalse() {
        moveRequest.setDistance(10.0);
        vehicle.setPricePerKm(5L);
        moveRequest.setMaxBudget(null);

        assertFalse(strategy.matches(moveRequest, driverInfo, vehicle));
    }
}
