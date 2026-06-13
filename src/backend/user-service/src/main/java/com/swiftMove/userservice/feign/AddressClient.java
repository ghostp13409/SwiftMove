package com.swiftMove.userservice.feign;

import com.swiftMove.userservice.dto.AddressDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "LOCATION-SERVICE")
public interface AddressClient {
    @GetMapping("/addresses/{id}")
    AddressDTO getAddress(@PathVariable Long id);
}
