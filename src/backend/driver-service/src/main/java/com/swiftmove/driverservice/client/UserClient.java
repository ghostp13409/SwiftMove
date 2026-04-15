package com.swiftmove.driverservice.client;

import com.swiftmove.driverservice.dto.UserResponseDto;
import java.util.List;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "USER-SERVICE")
public interface UserClient {
    @GetMapping("/users")
    ResponseEntity<List<UserResponseDto>> getAll();

    @GetMapping("/users/{id}")
    ResponseEntity<UserResponseDto> getById(@PathVariable Long id);

    @DeleteMapping("/{id}")
    ResponseEntity<Void> deleteUser(@PathVariable Long id);
}
