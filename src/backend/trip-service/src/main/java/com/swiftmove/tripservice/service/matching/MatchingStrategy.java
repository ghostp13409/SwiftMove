package com.swiftmove.tripservice.service.matching;

import com.swiftmove.tripservice.dto.MoveRequestDto;
import com.swiftmove.tripservice.dto.DriverInfoDto;
import com.swiftmove.tripservice.dto.VehicleDto;

public interface MatchingStrategy {
    boolean matches(MoveRequestDto moveRequest, DriverInfoDto driverInfo, VehicleDto vehicle);
}
