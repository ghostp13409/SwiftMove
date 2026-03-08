package com.swiftMove.userservice.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.swiftMove.userservice.dto.AddressDTO;

@FeignClient(name ="address-service" )
public interface AddressClient {
    @GetMapping("/address/{id}")
    AddressDTO getAddress(@PathVariable Long id);
}
