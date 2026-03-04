package com.swiftmove.driverservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class AuthUserResponseDto {
    private Long id;
    private String email;
    private String name;
    private String role;
}
