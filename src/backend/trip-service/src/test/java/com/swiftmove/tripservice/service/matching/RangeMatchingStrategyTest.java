package com.swiftmove.tripservice.service.matching;

import com.swiftmove.tripservice.dto.DriverInfoDto;
import com.swiftmove.tripservice.dto.MoveRequestDto;
import com.swiftmove.tripservice.dto.VehicleDto;
import com.swiftmove.tripservice.service.DistanceUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

class RangeMatchingStrategyTest {

    private RangeMatchingStrategy strategy;
    private MoveRequestDto moveRequest;
    private DriverInfoDto driverInfo;
    private VehicleDto vehicle;

    @BeforeEach
    void setUp() {
        strategy = new RangeMatchingStrategy();
        moveRequest = new MoveRequestDto();
        driverInfo = new DriverInfoDto();
        vehicle = new VehicleDto();
    }

    @Test
    void matches_WithinRange_ReturnsTrue() {
        driverInfo.setRange(50.0);
        driverInfo.setCurrentLatitude(10.0);
        driverInfo.setCurrentLongitude(10.0);

        moveRequest.setFromLatitude(10.1);
        moveRequest.setFromLongitude(10.1);
        moveRequest.setToLatitude(20.0);
        moveRequest.setToLongitude(20.0);

        try (MockedStatic<DistanceUtils> mockedDistanceUtils = mockStatic(DistanceUtils.class)) {
            mockedDistanceUtils.when(() -> DistanceUtils.calculateDistance(10.0, 10.0, 10.1, 10.1))
                    .thenReturn(30.0);

            assertTrue(strategy.matches(moveRequest, driverInfo, vehicle));
        }
    }

    @Test
    void matches_OutsideRange_ReturnsFalse() {
        driverInfo.setRange(50.0);
        driverInfo.setCurrentLatitude(10.0);
        driverInfo.setCurrentLongitude(10.0);

        moveRequest.setFromLatitude(15.0);
        moveRequest.setFromLongitude(15.0);
        moveRequest.setToLatitude(20.0);
        moveRequest.setToLongitude(20.0);

        try (MockedStatic<DistanceUtils> mockedDistanceUtils = mockStatic(DistanceUtils.class)) {
            mockedDistanceUtils.when(() -> DistanceUtils.calculateDistance(10.0, 10.0, 15.0, 15.0))
                    .thenReturn(60.0);

            assertFalse(strategy.matches(moveRequest, driverInfo, vehicle));
        }
    }

    @Test
    void matches_DriverRangeNull_ReturnsFalse() {
        driverInfo.setRange(null);
        driverInfo.setCurrentLatitude(10.0);
        driverInfo.setCurrentLongitude(10.0);

        moveRequest.setFromLatitude(10.1);
        moveRequest.setFromLongitude(10.1);

        assertFalse(strategy.matches(moveRequest, driverInfo, vehicle));
    }

    @Test
    void matches_DriverCoordinatesNull_ReturnsFalse() {
        driverInfo.setRange(50.0);
        driverInfo.setCurrentLatitude(null);
        driverInfo.setCurrentLongitude(10.0);

        moveRequest.setFromLatitude(10.1);
        moveRequest.setFromLongitude(10.1);

        assertFalse(strategy.matches(moveRequest, driverInfo, vehicle));
    }

    @Test
    void matches_RequestCoordinatesNull_ReturnsFalse() {
        driverInfo.setRange(50.0);
        driverInfo.setCurrentLatitude(10.0);
        driverInfo.setCurrentLongitude(10.0);

        moveRequest.setFromLatitude(null);
        moveRequest.setFromLongitude(10.1);
        moveRequest.setToLatitude(10.0);
        moveRequest.setToLongitude(10.0);

        assertFalse(strategy.matches(moveRequest, driverInfo, vehicle));
    }
}
