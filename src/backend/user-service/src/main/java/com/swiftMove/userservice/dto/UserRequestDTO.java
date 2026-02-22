package com.swiftmove.userservice.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UserRequestDTO {
    private String userName;
    private String password;
    private String firstName;
    private String lastName;
    private String email;
    private LocalDate dob;
    private Long addressId;
}
