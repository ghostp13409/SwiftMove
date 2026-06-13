package com.swiftmove.driverservice.client;

import com.swiftmove.driverservice.dto.MoveRequestDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "CLIENT-SERVICE")
public interface ClientServiceClient {
    @PutMapping("/clients/move-requests/{id}")
    MoveRequestDto updateMoveRequest(
        @PathVariable("id") Long id,
        @RequestBody MoveRequestDto moveRequestDto
    );

    @GetMapping("/clients/move-requests/{id}")
    MoveRequestDto getMoveRequestById(@PathVariable("id") Long id);
}
