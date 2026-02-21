package com.swiftMove.clientManagement_service.feign;

import com.swiftMove.clientManagement_service.dto.UserResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
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



