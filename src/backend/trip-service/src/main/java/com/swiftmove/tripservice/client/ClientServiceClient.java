package com.swiftmove.tripservice.client;

import com.swiftmove.tripservice.dto.LuggageEntryDto;
import com.swiftmove.tripservice.dto.LuggageTypeDto;
import com.swiftmove.tripservice.dto.MoveRequestDto;
import java.util.List;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "CLIENT-SERVICE")
public interface ClientServiceClient {
    @GetMapping("/clients/move-requests/{id}")
    MoveRequestDto getMoveRequestById(@PathVariable("id") Long id);

    @GetMapping("/clients/move-requests/all")
    List<MoveRequestDto> getAllMoveRequests();

    @GetMapping("/clients/move-requests/by-client")
    List<MoveRequestDto> getMoveRequestsByClientId(
        @RequestParam("clientId") Long clientId
    );

    @GetMapping("/clients/move-requests/luggage")
    List<LuggageEntryDto> getLuggageForMoveRequest(
        @RequestParam("moveRequestId") Long moveRequestId
    );

    @GetMapping("/clients/move-requests/luggage/types/{id}")
    LuggageTypeDto getLuggageTypeById(@PathVariable("id") Long id);

    @org.springframework.web.bind.annotation.DeleteMapping(
        "/clients/move-requests/{id}"
    )
    void deleteMoveRequest(@PathVariable("id") Long id);
}
