package com.swiftmove.tripservice.client;

import com.swiftmove.tripservice.dto.AddressDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "location-service")
public interface LocationServiceClient {
    @GetMapping("/addresses/{id}")
    AddressDTO getAddressById(@PathVariable("id") Long id);
}
