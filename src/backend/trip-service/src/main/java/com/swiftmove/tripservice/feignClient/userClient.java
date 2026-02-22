package com.swiftmove.tripservice.feignClient;

import com.swiftmove.tripservice.dto.UserResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name ="user-service" )
public interface userClient {
    @GetMapping("/users/iam/profile/{id}")
    UserResponseDTO getById(@PathVariable Long id);
}
