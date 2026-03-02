package com.swiftmove.authservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "user-service")
public interface UserServiceClient {

    @PostMapping("/users")
    UserDTO createUser(@RequestBody UserCreateRequest request);

    @GetMapping("/users/byEmail/{email}")
    UserDTO getUserByEmail(@PathVariable("email") String email);

    @GetMapping("/users/{id}")
    UserDTO getUserById(@PathVariable("id") Long id);
}
