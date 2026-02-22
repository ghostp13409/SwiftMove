package com.swiftmove.userservice;


import com.swiftmove.userservice.dto.AddressDTO;
import com.swiftmove.userservice.dto.UserRequestDTO;
import com.swiftmove.userservice.dto.UserResponseDTO;
import com.swiftmove.userservice.feign.AddressClient;
import com.swiftmove.userservice.model.User;
import com.swiftmove.userservice.repo.UserRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static com.swiftmove.userservice.mapper.UserMapper.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepo userRepo;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AddressClient addressClient;

    @InjectMocks
    private com.swiftmove.userservice.service.UserService userService;

    private User user;
    private UserRequestDTO requestDTO;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("test@test.com");
        user.setPasswordHash("hashed");
        user.setAddressId(100L);
        user.setCreatedAt(LocalDate.now());
        user.setUpdatedAt(LocalDate.now());

        requestDTO = new UserRequestDTO();
        requestDTO.setEmail("test@test.com");
        requestDTO.setPassword("password");
    }

    // ==============================
    // addNewUser
    // ==============================

    @Test
    void addNewUser_success() {

        when(userRepo.existsByEmail(requestDTO.getEmail())).thenReturn(false);
        when(passwordEncoder.encode("password")).thenReturn("hashed");
        when(userRepo.save(any(User.class))).thenReturn(user);

        try (MockedStatic<com.swiftmove.userservice.mapper.UserMapper> mapper =
                     mockStatic(com.swiftmove.userservice.mapper.UserMapper.class)) {

            mapper.when(() -> createUserFromDto(requestDTO)).thenReturn(user);
            mapper.when(() -> userToResponseDto(user)).thenReturn(new UserResponseDTO());

            UserResponseDTO response = userService.addNewUser(requestDTO);

            assertNotNull(response);
            verify(userRepo).save(any(User.class));
        }
    }

    @Test
    void addNewUser_emailExists_shouldThrowConflict() {
        when(userRepo.existsByEmail(requestDTO.getEmail())).thenReturn(true);

        ResponseStatusException ex =
                assertThrows(ResponseStatusException.class,
                        () -> userService.addNewUser(requestDTO));

        assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
    }

    // ==============================
    // findById
    // ==============================

    @Test
    void findById_success() {

        when(userRepo.findById(1L)).thenReturn(Optional.of(user));

        try (MockedStatic<com.swiftmove.userservice.mapper.UserMapper> mapper =
                     mockStatic(com.swiftmove.userservice.mapper.UserMapper.class)) {

            mapper.when(() -> userToResponseDto(user))
                    .thenReturn(new UserResponseDTO());

            UserResponseDTO result = userService.findById(1L);

            assertNotNull(result);
        }
    }

    @Test
    void findById_notFound_shouldThrow404() {
        when(userRepo.findById(1L)).thenReturn(Optional.empty());

        ResponseStatusException ex =
                assertThrows(ResponseStatusException.class,
                        () -> userService.findById(1L));

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
    }

    // ==============================
    // updateExistingUser
    // ==============================

    @Test
    void updateExistingUser_success_withPasswordChange() {

        when(userRepo.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.encode("password")).thenReturn("newHashed");
        when(userRepo.save(any(User.class))).thenReturn(user);

        try (MockedStatic<com.swiftmove.userservice.mapper.UserMapper> mapper =
                     mockStatic(com.swiftmove.userservice.mapper.UserMapper.class)) {

            mapper.when(() -> userToResponseDto(user))
                    .thenReturn(new UserResponseDTO());

            UserResponseDTO result =
                    userService.updateExistingUser(1L, requestDTO);

            assertNotNull(result);
            verify(passwordEncoder).encode("password");
            verify(userRepo).save(user);
        }
    }

    @Test
    void updateExistingUser_notFound_shouldThrow404() {
        when(userRepo.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class,
                () -> userService.updateExistingUser(1L, requestDTO));
    }

    // ==============================
    // deleteUser
    // ==============================

    @Test
    void deleteUser_success() {
        when(userRepo.existsById(1L)).thenReturn(true);

        userService.deleteUser(1L);

        verify(userRepo).deleteById(1L);
    }

    @Test
    void deleteUser_notFound_shouldThrow404() {
        when(userRepo.existsById(1L)).thenReturn(false);

        assertThrows(ResponseStatusException.class,
                () -> userService.deleteUser(1L));
    }

    // ==============================
    // getUserAddress
    // ==============================

    @Test
    void getUserAddress_success() {

        AddressDTO addressDTO = new AddressDTO();

        when(userRepo.findById(1L)).thenReturn(Optional.of(user));
        when(addressClient.getAddress(100L)).thenReturn(addressDTO);

        AddressDTO result = userService.getUserAddress(1L);

        assertNotNull(result);
        verify(addressClient).getAddress(100L);
    }

    @Test
    void getUserAddress_userNotFound_shouldThrow404() {
        when(userRepo.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class,
                () -> userService.getUserAddress(1L));
    }

    // ==============================
    // findAll
    // ==============================

    @Test
    void findAll_success() {

        when(userRepo.findAll()).thenReturn(List.of(user));

        try (MockedStatic<com.swiftmove.userservice.mapper.UserMapper> mapper =
                     mockStatic(com.swiftmove.userservice.mapper.UserMapper.class)) {

            mapper.when(() -> userToResponseDto(user))
                    .thenReturn(new UserResponseDTO());

            List<UserResponseDTO> result = userService.findAll();

            assertEquals(1, result.size());
        }
    }
}
