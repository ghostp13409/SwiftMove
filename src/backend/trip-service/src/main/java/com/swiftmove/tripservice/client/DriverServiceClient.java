package com.swiftmove.tripservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "driver-service")
public interface DriverServiceClient {
    @GetMapping("/drivers/move-offers/{id}")
    Object getMoveOfferById(@PathVariable("id") Long id);
}
