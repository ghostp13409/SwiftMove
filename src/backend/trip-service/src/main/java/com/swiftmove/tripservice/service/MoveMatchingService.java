package com.swiftmove.tripservice.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.swiftmove.tripservice.client.ClientServiceClient;
import com.swiftmove.tripservice.client.DriverServiceClient;
import com.swiftmove.tripservice.dto.DriverInfoDto;
import com.swiftmove.tripservice.dto.MoveRequestDto;
import com.swiftmove.tripservice.dto.VehicleDto;
import com.swiftmove.tripservice.service.matching.MoveRequestMatcher;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MoveMatchingService {

    private final ClientServiceClient clientServiceClient;
    private final DriverServiceClient driverServiceClient;
    private final MoveRequestMatcher moveRequestMatcher;

    public List<MoveRequestDto> getMatchingRequestsForDriver(Long driverId) {
        DriverInfoDto driverInfo = driverServiceClient.getDriverInfoByDriverId(driverId);
        if (driverInfo == null)
            return new ArrayList<>();

        List<VehicleDto> vehicles = driverServiceClient.getVehiclesByDriverId(driverInfo.getId());
        List<MoveRequestDto> allRequests = clientServiceClient.getAllMoveRequests();

        return allRequests.stream()
                .filter(request -> "CREATED".equals(request.getStatus())
                        || "OFFER_AVAILABLE".equals(request.getStatus()))
                .filter(request -> vehicles.stream()
                        .anyMatch(vehicle -> moveRequestMatcher.matches(request, driverInfo, vehicle)))
                .collect(Collectors.toList());
    }
}
