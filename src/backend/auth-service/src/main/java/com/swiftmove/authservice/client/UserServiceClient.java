package com.swiftmove.authservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "USER-SERVICE")
public interface UserServiceClient {
    @PostMapping("/users")
    UserDTO createUser(@RequestBody UserCreateRequest request);

    @GetMapping("/users/byEmail")
    UserDTO getUserByEmail(@RequestParam("email") String email);

    @GetMapping("/users/{id}")
    UserDTO getUserById(@PathVariable("id") Long id);
}
