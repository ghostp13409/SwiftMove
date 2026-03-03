package com.swiftmove.clientservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDto {

    public Long id;

    private String username;

    private String firstName;

    private String lastName;

    private String email;

    private String passwordHash;

    private LocalDate dob;

    private Float rating;

    private String role;

    private Long addressId;

    private LocalDate createdAt;

    private LocalDate updatedAt;
}
