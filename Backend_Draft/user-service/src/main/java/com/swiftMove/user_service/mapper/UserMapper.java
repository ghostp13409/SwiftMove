package com.swiftMove.user_service.mapper;

import com.swiftMove.user_service.dto.UserRequestDTO;
//import com.swiftMove.user_service.dto.UpdateUserDTO;
import com.swiftMove.user_service.dto.UserResponseDTO;
import com.swiftMove.user_service.model.User;

public class UserMapper {

    // connecting User -> Response Dto
    public static UserResponseDTO userToResponseDto(User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getUsername(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getDob(),
                user.getRating(),
                user.getRole(),
                user.getAddressId(),
                user.getCreatedAt(),
                user.getUpdatedAt()
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

        return user;

    }
    // connecting RequestDTO -> user(existing user)

    public static void updateEntity(User existing, UserRequestDTO dto) {

        existing.setUsername(dto.getUserName());
        existing.setFirstName(dto.getFirstName());
        existing.setLastName(dto.getLastName());
        existing.setEmail(dto.getEmail());
        existing.setDob(dto.getDob());
        existing.setAddressId(dto.getAddressId());
    }


}
