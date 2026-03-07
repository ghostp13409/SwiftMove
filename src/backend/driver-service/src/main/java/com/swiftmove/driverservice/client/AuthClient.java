package com.swiftmove.driverservice.client;


import com.swiftmove.driverservice.dto.AuthUserResponseDto;
import com.swiftmove.driverservice.dto.UserResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "auth-service")
public interface AuthClient {
    @GetMapping("/auth/me")
    ResponseEntity<UserResponseDto> getCurrentUser(
            @RequestHeader(value = "Authorization", required = false) String authHeader);
}