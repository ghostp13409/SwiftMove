package com.swiftmove.driverservice.client;

import com.swiftmove.driverservice.dto.CreateMoveTripDto;
import com.swiftmove.driverservice.dto.MoveTripDto;
import java.util.List;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "TRIP-SERVICE")
public interface TripServiceClient {
    @PostMapping("/trips")
    MoveTripDto createTrip(@RequestBody CreateMoveTripDto createMoveTripDto);

    @GetMapping("/trips/driver/{driverId}")
    List<MoveTripDto> getTripsByDriverId(
        @PathVariable("driverId") Long driverId
    );
}
