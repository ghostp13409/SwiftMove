package com.swiftmove.clientservice.client;

import com.swiftmove.clientservice.dto.AuthUserResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "auth-service")
public interface AuthClient {
    @GetMapping("/auth/me")
    ResponseEntity<AuthUserResponseDto> getCurrentUser(
            @RequestHeader(value = "Authorization", required = false) String authHeader);
}
