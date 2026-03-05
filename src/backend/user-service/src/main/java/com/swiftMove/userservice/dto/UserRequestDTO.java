package com.swiftmove.userservice.dto;

import lombok.*;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserRequestDTO {
    private String userName;
    private String password;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private LocalDate dob;
    private Long addressId;
}
