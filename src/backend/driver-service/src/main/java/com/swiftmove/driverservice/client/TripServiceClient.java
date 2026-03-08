package com.swiftmove.driverservice.client;

import com.swiftmove.driverservice.dto.CreateMoveTripDto;
import com.swiftmove.driverservice.dto.MoveTripDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "trip-service")
public interface TripServiceClient {
    @PostMapping("/trips")
    MoveTripDto createTrip(@RequestBody CreateMoveTripDto createMoveTripDto);
}
