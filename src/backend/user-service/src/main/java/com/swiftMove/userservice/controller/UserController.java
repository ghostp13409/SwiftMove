package com.swiftMove.userservice.controller;

import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.swiftMove.userservice.dto.UserRequestDTO;
import com.swiftMove.userservice.dto.UserResponseDTO;
import com.swiftMove.userservice.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAll() {
        return ResponseEntity.ok(userService.findAll());
    }

    @GetMapping("/{id}")
    public CompletableFuture<ResponseEntity<UserResponseDTO>> getById(@PathVariable Long id) {
        return userService.findById(id)
                .thenApply(userResponseDTO -> {
                    if (userResponseDTO == null) {
                        return ResponseEntity.notFound().build();
                    }
                    return ResponseEntity.ok(userResponseDTO);
                });
    }

    @GetMapping("/byEmail")
    public CompletableFuture<ResponseEntity<UserResponseDTO>> getByEmail(@RequestParam String email) {
        return userService.findByEmail(email)
                .thenApply(userResponseDTO -> {
                    if (userResponseDTO == null) {
                        return ResponseEntity.notFound().build();
                    }
                    return ResponseEntity.ok(userResponseDTO);
                });
    }

    @PostMapping
    public ResponseEntity<UserResponseDTO> addNewUser(@RequestBody UserRequestDTO userRequestDTO) {
        UserResponseDTO newUserResponseDto = userService.addNewUser(userRequestDTO);
        return ResponseEntity.ok(newUserResponseDto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateUser(@PathVariable Long id, @RequestBody UserRequestDTO updateUser) {
        userService.updateExistingUser(id, updateUser);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }


}
