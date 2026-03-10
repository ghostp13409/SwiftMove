package com.swiftmove.tripservice.service.matching;

import com.swiftmove.tripservice.client.ClientServiceClient;
import com.swiftmove.tripservice.client.DriverServiceClient;
import com.swiftmove.tripservice.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Order(5)
@RequiredArgsConstructor
public class CapacityMatchingStrategy implements MatchingStrategy {

    private final ClientServiceClient clientServiceClient;
    private final DriverServiceClient driverServiceClient;

    @Override
    public boolean matches(MoveRequestDto moveRequest, DriverInfoDto driverInfo, VehicleDto vehicle) {
        VehicleTypeDto vehicleType = driverServiceClient.getVehicleTypeByVehicleId(vehicle.getId());
        if (vehicleType == null) return false;

        List<LuggageEntryDto> luggageEntries = clientServiceClient.getLuggageForMoveRequest(moveRequest.getId());
        if (luggageEntries == null || luggageEntries.isEmpty()) return true;

        double totalVolume = 0;
        double totalWeight = 0;

        for (LuggageEntryDto entry : luggageEntries) {
            LuggageTypeDto type = clientServiceClient.getLuggageTypeById(entry.getLuggageTypeId());
            if (type != null) {
                totalVolume += (type.getVolume() != null ? type.getVolume() : 0) * entry.getQuantity();
                totalWeight += (type.getWeight() != null ? type.getWeight() : 0) * entry.getQuantity();
            }
        }

        return totalVolume <= (vehicleType.getMaxCapacity() != null ? vehicleType.getMaxCapacity() : Double.MAX_VALUE) &&
               totalWeight <= (vehicleType.getMaxWeight() != null ? vehicleType.getMaxWeight() : Double.MAX_VALUE);
    }
}
