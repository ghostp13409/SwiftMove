package com.swiftmove.clientservice.client;

import com.swiftmove.clientservice.dto.UserResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "user-service")
public interface UserClient {

    @GetMapping("/users")
    ResponseEntity<List<UserResponseDto>> getAll();

    @GetMapping("/users/{id}")
    ResponseEntity<UserResponseDto> getById(@PathVariable Long id);
}
