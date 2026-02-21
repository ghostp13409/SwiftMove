package com.swiftMove.user_service.dto;

import lombok.*;

import java.time.LocalDate;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO {

    public Long id;

    private String username;

    private String firstName;

    private String lastName;

    private String email;

    private LocalDate dob;

    private Float rating;

    private String role;

    private Long addressId;

    private LocalDate createdAt;

    private LocalDate updatedAt;
}
