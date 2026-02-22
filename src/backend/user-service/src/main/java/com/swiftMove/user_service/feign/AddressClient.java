package com.swiftMove.user_service.feign;

import com.swiftMove.user_service.dto.AddressDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name ="address-service" )
public interface AddressClient {
    @GetMapping("/address/{id}")
    AddressDTO getAddress(@PathVariable Long id);
}
