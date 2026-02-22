package com.swiftmove.userservice.service;

import com.swiftmove.userservice.dto.AddressDTO;
import com.swiftmove.userservice.dto.UserRequestDTO;
import com.swiftmove.userservice.dto.UserResponseDTO;
import com.swiftmove.userservice.feign.AddressClient;
import com.swiftmove.userservice.mapper.UserMapper;
import com.swiftmove.userservice.model.User;
import com.swiftmove.userservice.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final AddressClient addressClient;

    // For Adding a new user
    public UserResponseDTO addNewUser(UserRequestDTO dto) {
        // User email must be unique
        if (userRepo.existsByEmail(dto.getEmail()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");

        User user = UserMapper.createUserFromDto(dto);

        // Bcrypt Hashing
        user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));

        // TODO: REMOVE THIS FOR PROD
        // IMPORTANT JUST SETTING FOR TESTING PURPOSE ROLE
        user.setRole("CLIENT");
        user.setCreatedAt(LocalDate.now());
        user.setUpdatedAt(LocalDate.now());

        User savedUser = userRepo.save(user);
        return UserMapper.userToResponseDto(savedUser);
    }


    // Get All Users
    public List<UserResponseDTO> findAll() {
        List<User> users = userRepo.findAll();
        System.out.println(users.size());
        System.out.println(userRepo.findAll().stream().map(UserMapper::userToResponseDto).toList().stream().count());
        return userRepo.findAll().stream().map(UserMapper::userToResponseDto).toList();
    }

    // Test Get all
    public Iterable<User> getAll() {
        return userRepo.getAllUsers();
    }

    // GetByID
    public UserResponseDTO findById(long id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        return UserMapper.userToResponseDto(user);
    }

    // Update user
    public UserResponseDTO updateExistingUser(long userId, UserRequestDTO dto) {
        User existingUser = userRepo.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        UserMapper.updateEntity(existingUser, dto);

        // only and only if the user wants to change the password
        if (dto.getPassword() != null && !dto.getPassword().isBlank())
            existingUser.setPasswordHash(passwordEncoder.encode(dto.getPassword()));

        existingUser.setUpdatedAt(LocalDate.now());
        User savedUser = userRepo.save(existingUser);
        return UserMapper.userToResponseDto(savedUser);

    }

    public void deleteUser(Long id) {

        if (!userRepo.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "User not found");
        }

        userRepo.deleteById(id);
    }

    public AddressDTO getUserAddress(long id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        return addressClient.getAddress(user.getAddressId());

    }
}
