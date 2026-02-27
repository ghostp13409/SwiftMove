package com.swiftmove.authservice.client;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserCreateRequest {
    private String userName;
    private String password;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
}
