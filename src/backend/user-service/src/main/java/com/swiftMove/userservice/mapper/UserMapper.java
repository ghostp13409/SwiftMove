package com.swiftMove.userservice.mapper;


import com.swiftMove.userservice.dto.UserRequestDTO;
import com.swiftMove.userservice.dto.UserResponseDTO;
import com.swiftMove.userservice.model.User;
import com.swiftMove.userservice.model.UserRole;

public class UserMapper {

    // connecting User -> Response Dto
    public static UserResponseDTO userToResponseDto(User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getUsername(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPasswordHash(),
                user.getDob(),
                user.getRating(),
                user.getRole() != null ? user.getRole().name() : null,
                user.getAddressId()
        );
    }

    // connecting RequestDTO->User
    public static User createUserFromDto(UserRequestDTO dto){
        User user = new User();
        user.setUsername(dto.getUserName());
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setDob(dto.getDob());
        user.setAddressId(dto.getAddressId());
        if (dto.getRole() != null && !dto.getRole().isBlank()) {
            try {
                user.setRole(UserRole.valueOf(dto.getRole().toUpperCase()));
            } catch (IllegalArgumentException e) {
                user.setRole(UserRole.CLIENT);
            }
        }

        return user;

    }
    // connecting RequestDTO -> user(existing user)

    public static void updateEntity(User existing, UserRequestDTO dto) {

        if (dto.getUserName() != null) existing.setUsername(dto.getUserName());
        if (dto.getFirstName() != null) existing.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) existing.setLastName(dto.getLastName());
        if (dto.getEmail() != null) existing.setEmail(dto.getEmail());
        if (dto.getDob() != null) existing.setDob(dto.getDob());
        if (dto.getAddressId() != null) existing.setAddressId(dto.getAddressId());
        if (dto.getRole() != null && !dto.getRole().isBlank()) {
            try {
                existing.setRole(UserRole.valueOf(dto.getRole().toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Keep existing role if new one is invalid
            }
        }
    }


}
