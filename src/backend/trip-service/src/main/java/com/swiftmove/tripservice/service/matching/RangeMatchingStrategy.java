package com.swiftmove.tripservice.service.matching;

import com.swiftmove.tripservice.dto.DriverInfoDto;
import com.swiftmove.tripservice.dto.MoveRequestDto;
import com.swiftmove.tripservice.dto.VehicleDto;
import com.swiftmove.tripservice.service.DistanceUtils;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(3)
public class RangeMatchingStrategy implements MatchingStrategy {

    @Override
    public boolean matches(MoveRequestDto moveRequest, DriverInfoDto driverInfo, VehicleDto vehicle) {
        if (driverInfo.getRange() == null || driverInfo.getCurrentLatitude() == null || driverInfo.getCurrentLongitude() == null) {
            return false;
        }

        if (moveRequest.getFromLatitude() == null || moveRequest.getFromLongitude() == null ||
            moveRequest.getToLatitude() == null || moveRequest.getToLongitude() == null) {
            return false;
        }

        double distanceToFrom = DistanceUtils.calculateDistance(
                driverInfo.getCurrentLatitude(), driverInfo.getCurrentLongitude(),
                moveRequest.getFromLatitude(), moveRequest.getFromLongitude()
        );

        return distanceToFrom <= driverInfo.getRange();
    }
}
