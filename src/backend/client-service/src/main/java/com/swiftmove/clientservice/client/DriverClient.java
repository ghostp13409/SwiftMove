package com.swiftmove.clientservice.client;

import com.swiftmove.clientservice.dto.MoveOfferDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "driver-service")
public interface DriverClient {
    @GetMapping("/move-offers")
    List<MoveOfferDto> getMoveOffersByMoveRequestId(@RequestParam Long requestId);
}
