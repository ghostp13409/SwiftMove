package com.swiftmove.clientservice.dto;

import lombok.*;

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
