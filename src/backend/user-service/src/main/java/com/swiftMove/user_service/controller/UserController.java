package com.swiftMove.user_service.controller;

import com.swiftMove.user_service.dto.AddressDTO;
import com.swiftMove.user_service.dto.UserRequestDTO;
import com.swiftMove.user_service.dto.UserResponseDTO;
import com.swiftMove.user_service.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users/")
@RequiredArgsConstructor
public class UserController {
  @Autowired
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

  @PostMapping("/addUser")
  public ResponseEntity<UserResponseDTO> addNewUser(@RequestBody UserRequestDTO userRequestDTO) {

    UserResponseDTO newUserResponseDto = userService.addNewUser(userRequestDTO);
    return ResponseEntity.status(HttpStatus.CREATED).body(newUserResponseDto);
  }

  @PutMapping("/iam/profile/{id}")
  public ResponseEntity<Void> updateUser(@PathVariable Long id, @RequestBody UserRequestDTO updateUser) {
    userService.updateExistingUser(id, updateUser);
    return ResponseEntity.noContent().build();

  }

  @DeleteMapping("iam/delete/{id}")
  public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
    userService.deleteUser(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/userAddress/{id}")
  public ResponseEntity<AddressDTO> getCurrentUserAddress(@PathVariable Long id) {
    return ResponseEntity.ok(userService.getUserAddress(id));
  }

}
