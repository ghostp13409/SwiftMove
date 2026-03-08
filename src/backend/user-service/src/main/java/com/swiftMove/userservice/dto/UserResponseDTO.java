package com.swiftMove.userservice.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    private String passwordHash;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dob;
    private Float rating;
    private String role;
    private Long addressId;
}
