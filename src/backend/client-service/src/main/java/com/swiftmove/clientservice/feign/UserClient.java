package com.swiftmove.clientservice.feign;

import com.swiftmove.clientservice.dto.UserResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name ="user-service" )
public interface UserClient {
    @GetMapping("/users/allUsers")
    List<UserResponseDTO> getAll();

    @GetMapping("/users/iam/profile/{id}")
    UserResponseDTO getById(@PathVariable Long id);
}



