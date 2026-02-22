package com.swiftmove.userservice.feign;

import com.swiftmove.userservice.dto.AddressDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name ="address-service" )
public interface AddressClient {
    @GetMapping("/address/{id}")
    AddressDTO getAddress(@PathVariable Long id);
}
