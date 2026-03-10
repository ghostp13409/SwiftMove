package com.swiftmove.tripservice.service.matching;

import com.swiftmove.tripservice.dto.DriverInfoDto;
import com.swiftmove.tripservice.dto.MoveRequestDto;
import com.swiftmove.tripservice.dto.VehicleDto;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(4)
public class PriceMatchingStrategy implements MatchingStrategy {

    @Override
    public boolean matches(MoveRequestDto moveRequest, DriverInfoDto driverInfo, VehicleDto vehicle) {
        if (moveRequest.getDistance() == null || vehicle.getPricePerKm() == null || moveRequest.getMaxBudget() == null) {
            return false;
        }

        double calculatedPrice = moveRequest.getDistance() * vehicle.getPricePerKm();
        return calculatedPrice <= moveRequest.getMaxBudget();
    }
}
