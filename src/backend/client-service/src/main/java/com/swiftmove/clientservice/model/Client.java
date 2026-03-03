package com.swiftmove.clientservice.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Client {
    private Long id;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String passwordHash;
    private LocalDate dob;
    private Float rating;
    private Long addressId;
    private List<MoveRequest> moveRequests;
}
