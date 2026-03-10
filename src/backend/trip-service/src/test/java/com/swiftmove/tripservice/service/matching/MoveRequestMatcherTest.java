package com.swiftmove.tripservice.service.matching;

import com.swiftmove.tripservice.dto.DriverInfoDto;
import com.swiftmove.tripservice.dto.MoveRequestDto;
import com.swiftmove.tripservice.dto.VehicleDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

class MoveRequestMatcherTest {

    private MatchingStrategy strategy1;
    private MatchingStrategy strategy2;
    private MoveRequestMatcher matcher;

    private MoveRequestDto moveRequest;
    private DriverInfoDto driverInfo;
    private VehicleDto vehicle;

    @BeforeEach
    void setUp() {
        strategy1 = mock(MatchingStrategy.class);
        strategy2 = mock(MatchingStrategy.class);
        
        List<MatchingStrategy> strategies = Arrays.asList(strategy1, strategy2);
        matcher = new MoveRequestMatcher(strategies);

        moveRequest = new MoveRequestDto();
        driverInfo = new DriverInfoDto();
        vehicle = new VehicleDto();
    }

    @Test
    void matches_AllStrategiesReturnTrue_ReturnsTrue() {
        when(strategy1.matches(moveRequest, driverInfo, vehicle)).thenReturn(true);
        when(strategy2.matches(moveRequest, driverInfo, vehicle)).thenReturn(true);

        assertTrue(matcher.matches(moveRequest, driverInfo, vehicle));
        
        verify(strategy1).matches(moveRequest, driverInfo, vehicle);
        verify(strategy2).matches(moveRequest, driverInfo, vehicle);
    }

    @Test
    void matches_OneStrategyReturnsFalse_ReturnsFalse_ShortCircuits() {
        when(strategy1.matches(moveRequest, driverInfo, vehicle)).thenReturn(false);

        assertFalse(matcher.matches(moveRequest, driverInfo, vehicle));
        
        verify(strategy1).matches(moveRequest, driverInfo, vehicle);
        verify(strategy2, never()).matches(any(), any(), any()); // Verify short-circuit
    }
}
