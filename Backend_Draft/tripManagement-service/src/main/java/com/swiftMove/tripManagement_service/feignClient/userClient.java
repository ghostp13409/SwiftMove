package com.swiftMove.tripManagement_service.feignClient;

import com.swiftMove.tripManagement_service.dto.UserResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name ="user-service" )
public interface userClient {
    @GetMapping("/users/iam/profile/{id}")
    UserResponseDTO getById(@PathVariable Long id);
}
