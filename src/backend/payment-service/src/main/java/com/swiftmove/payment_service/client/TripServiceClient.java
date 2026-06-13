package com.swiftmove.payment_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "TRIP-SERVICE")
public interface TripServiceClient {
    @PostMapping("/trips/{id}/status")
    void updateStatus(
        @PathVariable("id") Long id,
        @RequestParam("status") String status
    );
}
