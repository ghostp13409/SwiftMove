package com.swiftmove.userservice.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.swiftmove.userservice.dto.AddressDTO;
import com.swiftmove.userservice.dto.UserRequestDTO;
import com.swiftmove.userservice.dto.UserResponseDTO;
import com.swiftmove.userservice.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/allUsers")
    public ResponseEntity<List<UserResponseDTO>> getAll() {
        return ResponseEntity.ok(userService.findAll());
    }

    @GetMapping("/iam/profile/{id}")
    public ResponseEntity<UserResponseDTO> getById(@PathVariable Long id) {
        UserResponseDTO userResponseDTO = userService.findById(id);
        if (userResponseDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(userResponseDTO);
    }

    @GetMapping("/byEmail/{email}")
    public ResponseEntity<UserResponseDTO> getByEmail(@PathVariable String email) {
        UserResponseDTO userResponseDTO = userService.findByEmail(email);
        if (userResponseDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(userResponseDTO);
    }

    @PostMapping("/addUser")
    public ResponseEntity<UserResponseDTO> addNewUser(@RequestBody UserRequestDTO userRequestDTO) {
        UserResponseDTO newUserResponseDto = userService.addNewUser(userRequestDTO);
        return ResponseEntity.ok(newUserResponseDto);
    }

    @PutMapping("/iam/profile/{id}")
    public ResponseEntity<Void> updateUser(@PathVariable Long id, @RequestBody UserRequestDTO updateUser) {
        userService.updateExistingUser(id, updateUser);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/iam/delete/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/userAddress/{id}")
    public ResponseEntity<AddressDTO> getCurrentUserAddress(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserAddress(id));
    }
}
