package com.swiftmove.tripservice.service.matching;

import com.swiftmove.tripservice.dto.DriverInfoDto;
import com.swiftmove.tripservice.dto.MoveRequestDto;
import com.swiftmove.tripservice.dto.VehicleDto;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(2)
public class FurnitureMatchingStrategy implements MatchingStrategy {

    @Override
    public boolean matches(MoveRequestDto moveRequest, DriverInfoDto driverInfo, VehicleDto vehicle) {
        if (Boolean.TRUE.equals(moveRequest.getHasFurniture())) {
            return Boolean.TRUE.equals(vehicle.getCanCarryFurniture());
        }
        return true;
    }
}
