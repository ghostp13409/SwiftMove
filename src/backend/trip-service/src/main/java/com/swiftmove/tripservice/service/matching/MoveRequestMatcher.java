package com.swiftmove.tripservice.service.matching;

import com.swiftmove.tripservice.dto.DriverInfoDto;
import com.swiftmove.tripservice.dto.MoveRequestDto;
import com.swiftmove.tripservice.dto.VehicleDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MoveRequestMatcher {

    private final List<MatchingStrategy> strategies;

    public boolean matches(MoveRequestDto moveRequest, DriverInfoDto driverInfo, VehicleDto vehicle) {
        // Apply strategies in order. All must match.
        for (MatchingStrategy strategy : strategies) {
            if (!strategy.matches(moveRequest, driverInfo, vehicle)) {
                return false;
            }
        }
        return true;
    }
}
